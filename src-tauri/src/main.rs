#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use email_parser::address::Address;
use email_parser::email::Email;
use once_cell::sync::OnceCell;
use serde::Serialize;
use std::fmt::Debug;
use std::net::TcpListener;
use tauri::Window;
// use mailin_embedded::err::Error;
use mailin_embedded::response::OK;
use mailin_embedded::{Handler, Response, Server, SslConfig};
use tauri::Manager;

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
        .unwrap()
        // .with_addr(address)
        // .unwrap()
        ;

    // println!("{:?}", );

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
#[derive(Serialize, Clone)]
struct EmailPayload {
    raw: String,
    sender: (String, String),
    from: Vec<(String, String)>,
    to: Option<Vec<String>>,
    cc: Option<Vec<String>>,
    subject: String,
    date: String,
    // body: String,
    message_id: String,
}

fn parse(raw: String) -> EmailPayload {
    let email = Email::parse(raw.as_bytes()).unwrap();

    // println!("{:#?}", raw);
    println!("{:#?}", email.mime_entity.parse());

    EmailPayload {
        raw: raw.clone(),
        // body: email.body.unwrap().to_string(),
        message_id: "123".to_string(),
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
        sender: (email.sender.name.unwrap().join(" "), "".into()),
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
        date: format!(
            "{} {} {} {} {}",
            format!("{:?}", email.date.day_name.unwrap()),
            email.date.date.day,
            format!("{:?}", email.date.date.month),
            email.date.date.year,
            email.date.time.time.hour
        ),
    }
}

// welcome to viet nam

static MAIN_WINDOW: OnceCell<Window> = OnceCell::new();

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // how we make app to globaly access from other function
            let main_window = app.get_window("main").unwrap();

            let _ = MAIN_WINDOW.set(main_window);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
