import { useEffect, useState } from "react";
import CurrentEmail from "./components/CurrentEmail";
import Mailbox from "./components/Mailbox";
import { startSmtpServer } from "./smtp";
import { listen, Event } from "@tauri-apps/api/event";
import useStore, { Email } from "./store";
import { nanoid } from "nanoid";
import ReactTooltip from "react-tooltip";

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
    const [addEmail, autoOpenNewEmail, setCurrentEmailId] = useStore((state) => [
        state.addEmail,
        state.autoOpenNewEmail,
        state.setCurrentEmailId,
    ]);
    const [latestEmailId, setLatestEmailId] = useState<string>("");

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

            setLatestEmailId(email.id);
        });
    }, []);

    // useEffect(
    //     function () {
    //         if (autoOpenNewEmail && latestEmailId !== "") {
    //             console.log("set current email id", latestEmailId);
    //             setCurrentEmailId(latestEmailId);
    //         }
    //     },
    //     [latestEmailId, autoOpenNewEmail]
    // );

    return (
        <>
            <div className="flex h-screen w-screen bg-white">
                <div className="hidden h-full w-14 bg-stone-800"></div>
                <Mailbox />
                <CurrentEmail />
            </div>
            <ReactTooltip place="right" className="!rounded !px-3 !py-1 !text-xs" />
        </>
    );
}

export default App;
