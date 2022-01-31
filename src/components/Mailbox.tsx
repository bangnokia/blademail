import { listen, Event } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import MailItem from "./MailItem";
import useStore, { Email } from "../store";
import shallow from "zustand/shallow";
import { nanoid } from "nanoid";

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
    const [emails, addEmail, setCurrentEmailId] = useStore(
        (state) => [state.emails, state.addEmail, state.setCurrentEmailId],
        shallow
    );

    function openEmail(email: Email) {
        email.isOpen = true;
        setCurrentEmailId(email.id);
    }

    useEffect(function () {
        listen("new-email", (event: Event<Email>) => {
            const email: Email = {
                ...event.payload,
                id: nanoid(),
                excerpt: makeExcerpt(event.payload),
                date: new Date(),
                isOpen: false,
            };

            addEmail(email);
        });
    }, []);

    return (
        <div className="flex h-full w-[450px] flex-col overflow-y-auto p-2 text-white">
            {emails.map((email, index) => {
                return (
                    <div onClick={() => openEmail(email)} key={email.id}>
                        <MailItem email={email} active={false} />
                    </div>
                );
            })}
        </div>
    );
}
