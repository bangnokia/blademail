import { useEffect } from "react";
import CurrentEmail from "./components/CurrentEmail";
import Mailbox from "./components/Mailbox";
import { startSmtpServer } from "./smtp";
import { listen, Event } from "@tauri-apps/api/event";
import useStore, { Email } from "./store";
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

function App() {
    const [addEmail] = useStore((state) => [state.addEmail]);
    useEffect(function () {
        startSmtpServer().then(() => console.log("SMTP server started"));
    }, []);

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
        <div className="flex h-screen w-screen bg-white">
            <div className="hidden h-full w-14 bg-stone-800"></div>
            <Mailbox />
            <CurrentEmail />
        </div>
    );
}

export default App;
