import { listen, Event } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import MailItem from "./MailItem";

export type Email = {
    raw: string;
    subject: string;
    from: [string, string][]; // author of message, not the sender
    sender: [string, string]; // [name, email]
    to: string[];
    cc: string[];
    date: Date;
    html: string;
    text: string;
    excerpt: string;
};

function makeExcerpt(email: Email) {
    let excerpt = "";

    if (email.html) {
        const text = new DOMParser().parseFromString(email.html, "text/html").body.textContent?.trim();
        excerpt = text ? text.substring(0, 120) : "";
    } else {
        excerpt = email.text.substring(0, 120);
    }

    return excerpt + "...";
}

export default function Mailbox() {
    const [emails, setEmails] = useState<Email[]>([]);

    useEffect(function () {
        listen("new-email", (event: Event<Email>) => {
            const email: Email = event.payload;
            email.excerpt = makeExcerpt(email);
            email.date = new Date();
            setEmails((emails) => [email, ...emails]);
        });
    }, []);

    return (
        <div className="flex w-full h-full">
            {/* list email */}
            <div className="w-80 h-full overflow-y-auto flex flex-col text-white px-2 py-2">
                {emails.map((email, index) => {
                    return <MailItem key={index} email={email} active={false} />;
                })}
            </div>

            {/* view email content */}
            <div></div>
        </div>
    );
}
