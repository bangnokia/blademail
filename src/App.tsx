import { useEffect } from "react";
import CurrentEmail from "./components/CurrentEmail";
import Mailbox from "./components/Mailbox";
import { startSmtpServer } from "./smtp";
import { listen, Event } from "@tauri-apps/api/event";
import useStore from "./store";
import { nanoid } from "nanoid";
import StatusBar from "./components/StatusBar";
import { makeExcerpt } from "./utils/utils";
import { Email } from "./types";

function App() {
    const [addEmail] = useStore((state) => [state.addEmail]);

    useEffect(function () {
        startSmtpServer().then(() => console.log("SMTP server started"));
    }, []);

    useEffect(function () {
        let unlisten: (() => void) | undefined;

        listen("new-email", (event: Event<Email>) => {
            const email: Email = {
                ...event.payload,
                id: nanoid(),
                excerpt: makeExcerpt(event.payload),
                date: new Date(),
                isOpen: false,
            };

            addEmail(email);
        }).then((unsubscribe) => { unlisten = unsubscribe; });

        return () => unlisten && unlisten();
    }, [addEmail]);

    return (
        <div className="flex h-screen w-screen flex-col  bg-white font-sans">
            <div className="flex h-full w-full overflow-auto">
                <Mailbox />
                <CurrentEmail />
            </div>
            <div className="bottom-0 w-full shrink-0 grow-0">
                <StatusBar />
            </div>
        </div>
    );
}

export default App;
