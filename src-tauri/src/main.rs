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
use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::net::TcpListener;
use tauri::menu::MenuBuilder;
use tauri::Emitter;
use tauri::Manager;
use tauri::WebviewWindow;

#[derive(Clone, Debug)]
struct MyHandler {
    buffer: Vec<u8>,
}

impl MyHandler {
    pub fn new() -> MyHandler {
        MyHandler { buffer: vec![] }
    }
}

impl Handler for MyHandler {
    fn data(&mut self, buf: &[u8]) -> std::io::Result<()> {
        self.buffer.extend_from_slice(buf);
        Ok(())
    }

    fn data_end(&mut self) -> Response {
        let raw = String::from_utf8_lossy(&std::mem::take(&mut self.buffer)).into_owned();
        let payload = parse(raw);

        // emit email to the UI
        if let Some(main_window) = MAIN_WINDOW.get() {
            if let Err(err) = main_window.emit("new-email", payload) {
                eprintln!("Failed to emit new-email event: {err}");
            }
        }

        OK
    }
}

#[tauri::command]
async fn start_server(address: Option<String>) -> Result<String, String> {
    if SERVER_RUNNING.swap(true, Ordering::SeqCst) {
        return Ok("SMTP server is already running.".into());
    }

    let address = address.unwrap_or("127.0.0.1:1025".into());
    let listener = match TcpListener::bind(&address) {
        Ok(listener) => listener,
        Err(err) => {
            SERVER_RUNNING.store(false, Ordering::SeqCst);
            return Err(format!("Failed to bind SMTP server on {address}: {err}"));
        }
    };

    let address_for_thread = address.clone();
    thread::spawn(move || {
        let mut server = Server::new(MyHandler::new());

        if let Err(err) = server
            .with_name("blade mail")
            .with_tcp_listener(listener)
            .with_ssl(SslConfig::None)
        {
            eprintln!("Failed to configure SMTP server on {address_for_thread}: {err}");
            SERVER_RUNNING.store(false, Ordering::SeqCst);
            return;
        }

        println!("SMTP server is starting on {address_for_thread}...");

        if let Err(err) = server.serve() {
            eprintln!("SMTP server stopped with error on {address_for_thread}: {err}");
        }

        SERVER_RUNNING.store(false, Ordering::SeqCst);
    });

    Ok(format!("SMTP server started on {address}."))
}

#[tauri::command]
fn stop_server() -> String {
    if SERVER_RUNNING.load(Ordering::SeqCst) {
        "SMTP server stop is not implemented yet. The SMTP server is still running.".into()
    } else {
        "SMTP server is not running.".into()
    }
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

impl EmailPayload {
    fn empty(raw: String) -> Self {
        Self {
            raw,
            sender: (String::new(), String::new()),
            from: vec![],
            to: None,
            cc: None,
            subject: String::new(),
            html: String::new(),
            text: String::new(),
            attachments: vec![],
        }
    }
}

fn mailbox_name<T: AsRef<str>>(parts: Option<&[T]>) -> String {
    parts
        .map(|parts| {
            parts
                .iter()
                .map(|part| part.as_ref())
                .collect::<Vec<_>>()
                .join(" ")
        })
        .unwrap_or_default()
}

fn mailbox_address(local_part: &str, domain: &str) -> String {
    format!("{local_part}@{domain}")
}

fn collect_addresses(addresses: Option<&Vec<Address>>) -> Option<Vec<String>> {
    let addresses: Vec<String> = addresses
        .into_iter()
        .flat_map(|addresses| addresses.iter())
        .filter_map(|address| match address {
            Address::Mailbox(mailbox) => Some(mailbox_address(
                &mailbox.address.local_part,
                &mailbox.address.domain,
            )),
            _ => None,
        })
        .collect();

    (!addresses.is_empty()).then_some(addresses)
}

fn parse(raw: String) -> EmailPayload {
    let mut payload = EmailPayload::empty(raw);

    let email = match Email::parse(payload.raw.as_bytes()) {
        Ok(email) => email,
        Err(err) => {
            eprintln!("Failed to parse SMTP message: {err}");
            payload.text = payload.raw.clone();
            return payload;
        }
    };

    payload.from = email
        .from
        .iter()
        .map(|mailbox| {
            (
                mailbox_name(mailbox.name.as_deref()),
                mailbox_address(&mailbox.address.local_part, &mailbox.address.domain),
            )
        })
        .collect();

    let sender = &email.sender;
    payload.sender = (
        mailbox_name(sender.name.as_deref()),
        mailbox_address(&sender.address.local_part, &sender.address.domain),
    );
    payload.to = collect_addresses(email.to.as_ref());
    payload.cc = collect_addresses(email.cc.as_ref());
    payload.subject = email
        .subject
        .as_ref()
        .map(|subject| subject.to_string().trim().to_string())
        .unwrap_or_default();

    let parsed = match email.mime_entity.parse() {
        Ok(parsed) => parsed,
        Err(err) => {
            eprintln!("Failed to parse MIME entity: {err}");
            payload.text = payload.raw.clone();
            return payload;
        }
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
                        let parsed = match entity.parse() {
                            Ok(parsed) => parsed,
                            Err(err) => {
                                eprintln!("Failed to parse nested multipart entity: {err}");
                                continue;
                            }
                        };

                        match parsed {
                            Entity::Multipart { subtype, content } => {
                                for entity in content {
                                    println!("multipart 2 {}", subtype);
                                    match entity.subtype.to_string().as_str() {
                                        "html" => payload.html = String::from_utf8_lossy(&entity.value).into_owned(),
                                        "plain" => payload.text = String::from_utf8_lossy(&entity.value).into_owned(),
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
                        let parsed = match entity.parse() {
                            Ok(parsed) => parsed,
                            Err(err) => {
                                eprintln!("Failed to parse text entity: {err}");
                                continue;
                            }
                        };

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
static SERVER_RUNNING: AtomicBool = AtomicBool::new(false);

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

            app.set_menu(menu) // set the menu
                .expect("error while setting menu");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::parse;

    #[test]
    fn parses_plain_text_email_without_panicking() {
        let payload = parse(
            concat!(
                "From: Alice Johnson <alice@example.com>\r\n",
                "Sender: Alice Johnson <alice@example.com>\r\n",
                "To: Bob <bob@example.com>\r\n",
                "Date: Sat, 07 Mar 2026 10:00:00 +0000\r\n",
                "Subject: Hello from Blade Mail\r\n",
                "Content-Type: text/plain; charset=utf-8\r\n",
                "\r\n",
                "This is a plain text email.\r\n"
            )
            .to_string(),
        );

        assert_eq!(payload.subject, "Hello from Blade Mail");
        assert_eq!(payload.sender.1, "alice@example.com");
        assert_eq!(payload.to, Some(vec!["bob@example.com".to_string()]));
        assert!(payload.html.is_empty());
        assert!(payload.text.contains("plain text email"));
    }

    #[test]
    fn falls_back_to_raw_text_for_invalid_messages() {
        let raw = "this is not a valid smtp message";
        let payload = parse(raw.to_string());

        assert_eq!(payload.raw, raw);
        assert_eq!(payload.text, raw);
        assert!(payload.subject.is_empty());
        assert!(payload.from.is_empty());
    }
}
