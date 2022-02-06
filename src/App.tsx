import { useEffect, useState } from "react";
import CurrentEmail from "./components/CurrentEmail";
import Mailbox from "./components/Mailbox";
import { startSmtpServer } from "./smtp";
import { listen, Event } from "@tauri-apps/api/event";
import useStore, { Email } from "./store";
import { nanoid } from "nanoid";
import ReactTooltip from "react-tooltip";
import { extendTheme, VechaiProvider } from "@vechaiui/react";
import { bee } from "./themes";

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

    const theme = extendTheme({
        cursor: "pointer",
        colorSchemes: {
            bee,
        },
    });

    return (
        <VechaiProvider theme={theme} colorScheme="bee">
            <div className="flex h-screen w-screen bg-white font-sans">
                <div className="hidden h-full w-14 bg-stone-800"></div>
                <Mailbox />
                <CurrentEmail />
            </div>
            <ReactTooltip place="right" className="!rounded !px-3 !py-1 !text-xs" />
        </VechaiProvider>
    );
}

export default App;
