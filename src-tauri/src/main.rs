#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use email_parser::email::Email;
use std::mem::drop;
use std::net::TcpListener;
// use mailin_embedded::err::Error;
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
        OK
    }
}

// #[tauri::command]
// fn start_server() -> String {
//     "SMTP server started.".into()
// }

#[tauri::command]
async fn start_server(address: Option<String>) -> Result<String, String> {
    let mut server = Server::new(MyHandler::new());
    let address = address.unwrap_or("127.0.0.1:1025".into());
    let listener = TcpListener::bind(&address).unwrap();
    // listener
    //     .set_nonblocking(true)
    //     .expect("set_nonblocking call failed");

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

fn parse(mime: String) {
    let email = Email::parse(mime.as_bytes()).unwrap();

    println!("{:?}", email.to);
}

struct State {
    tcp_listener: Option<TcpListener>,
}

impl State {
    pub fn new() -> State {
        State { tcp_listener: None }
    }

    pub fn set_tcp_listener(&mut self, tcp_listener: TcpListener) {
        self.tcp_listener = Some(tcp_listener);
    }
}

fn main() {
    tauri::Builder::default()
        .manage(State::new())
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
