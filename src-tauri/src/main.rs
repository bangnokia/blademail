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
use tauri::menu::MenuBuilder;
use tauri::Emitter;
use tauri::Manager;
use tauri::WebviewWindow;
use std::fmt::Debug;
use std::net::TcpListener;

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
        let _ = MAIN_WINDOW.get().unwrap().emit("new-email", payload);
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
    attachments: Vec<Attachment>,
}

#[derive(Serialize, Clone, Debug)]
struct Attachment {
    filename: String,
    content_type: String,
    data: Vec<u8>,
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
        html: "".into(),
        text: "".into(),
        attachments: vec![],
    };

    match parsed {
        Entity::Text { subtype, value, .. } => match subtype.to_string().as_str() {
            "html" => payload.html = value.to_string(),
            "plain" => payload.text = value.to_string(),
            _ => println!("unknown text subtype: {}", subtype),
        },
        // parsing content of multipart body, when user using markdown,
        // there will be a plain text and a html version of the email (maybe it sent from Laravel app)
        Entity::Multipart { subtype, content } => {
            println!("multipart {:?}", subtype);
            for entity in content {
                match entity.mime_type {
                    ContentType::Multipart => {
                        let parsed = entity.parse().unwrap();

                        match parsed {
                            Entity::Multipart { subtype, content } => {
                                for entity in content {
                                    println!("multipart 2 {}", subtype);
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
                    ContentType::Application => {
                        let attachment = Attachment {
                            filename: entity
                                .parameters
                                .get("name")
                                .map_or_else(|| "".to_string(), |name| name.to_string()),
                            content_type: entity.subtype.to_string(),
                            data: entity.value.to_vec(),
                        };
                        payload.attachments.push(attachment);
                    }
                    _ => println!("not multipart"),
                }
            }
        }

        _ => println!("other {:#?}", parsed),
    }

    payload
}

static MAIN_WINDOW: OnceCell<WebviewWindow> = OnceCell::new();

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            // how we make app to globaly access from other function
            let main_window = app.get_webview_window("main").unwrap();
            let _ = MAIN_WINDOW.set(main_window);

            // build the menu
            let handle = app.handle();
            let menu = MenuBuilder::new(handle)
                .copy()
                .cut()
                .separator()
                .paste()
                .build()?;

            app.set_menu(menu);


            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
