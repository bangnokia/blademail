#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use email_parser::email::Email;
use std::net::TcpListener;
// use mailin_embedded::err::Error;
use email_parser::address::Mailbox;
use mailin_embedded::response::OK;
use mailin_embedded::{Handler, Response, Server, SslConfig};

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
        parse(mime);

        // emit email to the UI
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

struct EmailPayload {
    from: Vec<Mailbox>,
    to: Vec<Mailbox>,
}

fn parse(mime: String) -> EmailPayload {
    let email = Email::parse(mime.as_bytes()).unwrap();

    println!("{:?}", email.from);
    println!("{:?}", email.to);

    EmailPayload {
        from: email.from,
        to: email.to,
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
