import { useEffect, useState } from "react";
import Mailbox from "./Mailbox";
import SmtpServer from "./SmtpServer";
import { Event, listen } from "@tauri-apps/api/event";

type EmailPayload = {
    mime: string;
    body: string;
    from: [string, string][];
    sender: [string, string];
    subject: string;
    date: string;
    to: [string, string][];
};

function s(obj: Object): Object {
    return JSON.stringify(obj);
}

function App() {
    const [emails, setEmails] = useState<Array<EmailPayload>>([]);

    useEffect(function () {
        listen("new-email", (event: Event<EmailPayload>) => {
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
                            {email.mime}
                            {s(email.cc)}
                            {/* {JSON.stringify(email.sender)} */}
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
