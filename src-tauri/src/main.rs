#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use email_parser::email::Email;
use email_parser::prelude::DateTime;
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
    mime: Vec<String>,
}

impl MyHandler {
    pub fn new() -> MyHandler {
        MyHandler { mime: vec![] }
    }
}

impl Handler for MyHandler {
    fn data(&mut self, buf: &[u8]) -> std::io::Result<()> {
        self.mime.push(String::from_utf8(Vec::from(buf)).unwrap());
        Ok(())
    }

    fn data_end(&mut self) -> Response {
        let mime = self.mime.join("");
        let payload = parse(mime);

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
    mime: String,
    body: String,
    from: Vec<(String, String)>,
    sender: (String, String),
    subject: String,
    date: String,
    to: Option<Vec<(String, String)>>,
}

fn parse(mime: String) -> EmailPayload {
    let email = Email::parse(mime.as_bytes()).unwrap();

    println!("{:#?}", mime);
    println!("{:#?}", email);
    // println!("{:?}", email);

    EmailPayload {
        mime: mime.clone(),
        body: String::from(""),
        from: email.from.iter().map(|mailbox| {
            (
                mailbox.name.as_ref().unwrap().join(" "),
                format!("{}@{}", mailbox.address.local_part, mailbox.address.domain)
            )
        }).collect(),
        sender: (email.sender.name.unwrap().join(" "), "".into()),
        subject: email.subject.unwrap().to_string(),
        date: "".into(),
        to: Some(vec![("".into(), "".into())]),
    }
}

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
