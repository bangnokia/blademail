import { useEffect, useState } from "react";
import Mailbox from "./Mailbox";
import SmtpServer from "./SmtpServer";
import { Event, listen } from "@tauri-apps/api/event";

type Email = {
    raw: string;
    subject: string;
    from: [string, string][]; // author of message, not the sender
    sender: [string, string]; // [name, email]
    to: string[];
    cc: string[];
    date: string;
    html: string;
    text: string;
};

function s(obj: Object): Object {
    return JSON.stringify(obj);
}

function App() {
    const [emails, setEmails] = useState<Array<Email>>([]);

    useEffect(function () {
        listen("new-email", (event: Event<Email>) => {
            // console.log("new email", event);

            setEmails((emails) => [event.payload, ...emails]);
        });
    }, []);
    return (
        <div className="bg-white w-screen h-screen flex">
            {/* sidebar */}
            <div className="h-full w-14 bg-stone-800"></div>
            <div className="w-full">
                <div>
                    {emails.map((email, index) => (
                        <pre className="border" key={index}>
                            {/* date: {email.date} {"\n"}
                            subject: {email.subject} {"\n"}
                            sender: {email.sender[0]} - {email.sender[1]} {"\n"}
                            to: {email.to.join(", ")} {"\n"}
                            cc: {email.cc.join(", ")} {"\n"}
                            html: "" {"\n"}
                            text: "" {"\n"} */}
                            {email.text}
                            ----------------- {"\n"}
                            {email.html}
                            ----------------- {"\n"}
                            {email.raw}
                        </pre>
                    ))}
                </div>

                <SmtpServer />
            </div>
            {/* <Mailbox /> */}
        </div>
    );
}

export default App;
