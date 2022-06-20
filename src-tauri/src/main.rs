#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use email_parser::address::Address;
use email_parser::email::Email;
use email_parser::mime::ContentType;
use email_parser::mime::Entity;
use mailin_embedded::response::OK;
use mailin_embedded::{Handler, Response, Server, SslConfig};
use once_cell::sync::OnceCell;
use serde::Serialize;
use std::fmt::Debug;
use std::net::TcpListener;
use tauri::AboutMetadata;
use tauri::Manager;
use tauri::{Menu, MenuItem, Submenu, Window};
use tauri_plugin_store::PluginBuilder;

#[derive(Clone, Debug)]
struct MyHandler {
    lines: Vec<String>,
}

impl MyHandler {
    pub fn new() -> MyHandler {
        MyHandler { lines: vec![] }
    }
}

impl Handler for MyHandler {
    fn data(&mut self, buf: &[u8]) -> std::io::Result<()> {
        self.lines.push(String::from_utf8(Vec::from(buf)).unwrap());
        Ok(())
    }

    fn data_end(&mut self) -> Response {
        let raw = self.lines.join("");
        let payload = parse(raw);

        // emit email to the UI
        let _ = MAIN_WINDOW.get().unwrap().emit_all("new-email", payload);
        OK
    }
}

#[tauri::command]
async fn start_server(address: Option<String>) -> Result<String, String> {
    let mut server = Server::new(MyHandler::new());
    let address = address.unwrap_or("127.0.0.1:1025".into());
    let listener = TcpListener::bind(&address).unwrap();

    server
        .with_name("blade mail")
        .with_tcp_listener(listener)
        .with_ssl(SslConfig::None)
        .unwrap();

    println!("SMTP server is starting...");

    match server.serve() {
        Ok(_) => Ok("SMTP server started.".into()),
        Err(e) => Err(format!("{}", e)),
    }
}

#[tauri::command]
fn stop_server() -> String {
    "SMTP server stopped.".into()
}

// MailBox = (Name: String, EmailAddress: String)
#[derive(Serialize, Clone, Debug)]
struct EmailPayload {
    raw: String,
    sender: (String, String),
    from: Vec<(String, String)>,
    to: Option<Vec<String>>,
    cc: Option<Vec<String>>,
    subject: String,
    // date: String,
    // message_id: String,
    html: String,
    text: String,
}

fn parse(raw: String) -> EmailPayload {
    let email = Email::parse(raw.as_bytes()).unwrap();
    let parsed = email.mime_entity.parse().unwrap();

    let mut payload = EmailPayload {
        raw: raw.clone(),
        // message_id: email.message_id.unwrap().to_string(),
        from: email
            .from
            .iter()
            .map(|mailbox| {
                (
                    mailbox.name.as_ref().unwrap().join(" "),
                    format!("{}@{}", mailbox.address.local_part, mailbox.address.domain),
                )
            })
            .collect(),
        sender: (
            email.sender.name.unwrap().join(" "),
            format!(
                "{}@{}",
                email.sender.address.local_part, email.sender.address.domain
            ),
        ),
        to: match email.to {
            Some(addresses) => addresses
                .iter()
                .map(|add| match add {
                    Address::Mailbox(mailbox) => Some(format!(
                        "{}@{}",
                        mailbox.address.local_part, mailbox.address.domain
                    )),
                    _ => None,
                })
                .collect(),
            _ => None,
        },
        cc: match email.cc {
            Some(addresses) => addresses
                .iter()
                .map(|add| match add {
                    Address::Mailbox(mailbox) => Some(format!(
                        "{}@{}",
                        mailbox.address.local_part, mailbox.address.domain
                    )),
                    _ => None,
                })
                .collect(),
            _ => None,
        },
        subject: email.subject.unwrap().to_string(),
        // date: format!(
        //     "{} {} {} {} {}",
        //     format!("{:?}", email.date.day_name.unwrap()),
        //     email.date.date.day,
        //     format!("{:?}", email.date.date.month),
        //     email.date.date.year,
        //     email.date.time.time.hour
        // ),
        html: "".into(),
        text: "".into(),
    };

    match parsed {
        Entity::Text { subtype, value, .. } => match subtype.to_string().as_str() {
            "html" => payload.html = value.to_string(),
            "plain" => payload.text = value.to_string(),
            _ => (),
        },
        // parsing content of multipart body, when user using markdown,
        // there will be a plain text and a html version of the email (maybe it sent from Laravel app)
        Entity::Multipart { subtype, content } => {
            println!("{:?}", subtype);
            for entity in content {
                match entity.mime_type {
                    ContentType::Multipart => {
                        let parsed = entity.parse().unwrap();

                        match parsed {
                            Entity::Multipart { subtype, content } => {
                                for entity in content {
                                    println!("before match {}", subtype);
                                    match entity.subtype.to_string().as_str() {
                                        "html" => {
                                            payload.html =
                                                String::from_utf8(entity.value.to_vec()).unwrap()
                                        }

                                        "plain" => {
                                            payload.text =
                                                String::from_utf8(entity.value.to_vec()).unwrap()
                                        }

                                        _ => println!("unknown subtype: {}", subtype),
                                    }
                                    println!(
                                        "mime_type: {:#?}, subtype {:#?}, parameters {:#?} disposition {:#?}",
                                        entity.mime_type, entity.subtype.to_string().as_str(), entity.parameters, entity.disposition
                                    );
                                }
                            }
                            Entity::Text {
                                subtype: _,
                                value: _,
                            } => {}
                            _ => println!("not multipart or text"),
                        }
                    }
                    ContentType::Text => {
                        let parsed = entity.parse().unwrap();
                        println!("parsing text {:#?}", parsed);

                        match parsed {
                            Entity::Text { subtype, value, .. } => {
                                println!("text, subtype: {}", subtype);
                                match subtype.to_string().as_str() {
                                    "html" => payload.html = value.to_string(),
                                    "plain" => payload.text = value.to_string(),
                                    _ => (),
                                }
                            }
                            _ => println!("not text"),
                        }
                    }
                    _ => println!("not multipart"),
                }
            }
        }
        _ => println!("other"),
    }

    payload
}

static MAIN_WINDOW: OnceCell<Window> = OnceCell::new();

fn main() {
    let menu = make_menu();

    tauri::Builder::default()
        .setup(|app| {
            // how we make app to globaly access from other function
            let main_window = app.get_window("main").unwrap();

            let _ = MAIN_WINDOW.set(main_window);

            Ok(())
        })
        .menu(menu)
        .plugin(PluginBuilder::default().build())
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn make_menu() -> Menu {
    let main_submenu = Submenu::new(
        "Blade Mail",
        Menu::new()
            .add_native_item(MenuItem::About(
                "Blade Mail".to_string(),
                AboutMetadata::new(),
            ))
            .add_native_item(MenuItem::EnterFullScreen)
            .add_native_item(MenuItem::HideOthers)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::Quit),
    );

    let file_submenu = Submenu::new(
        "File",
        Menu::new()
            .add_native_item(MenuItem::Minimize)
            .add_native_item(MenuItem::Quit),
    );

    let edit_submenu = Submenu::new(
        "Edit",
        Menu::new()
            .add_native_item(MenuItem::Undo)
            .add_native_item(MenuItem::Redo)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Cut)
            .add_native_item(MenuItem::Copy)
            .add_native_item(MenuItem::Paste)
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::SelectAll),
    );

    Menu::new()
        .add_submenu(main_submenu)
        .add_submenu(file_submenu)
        .add_submenu(edit_submenu)
}
