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
import StatusBar from "./components/StatusBar";
import { makeExcerpt } from "./utils/utils";

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

    const theme = extendTheme({
        cursor: "pointer",
        colorSchemes: {
            bee,
        },
    });

    return (
        <VechaiProvider theme={theme} colorScheme="bee">
            <div className="flex h-screen w-screen flex-col  bg-white font-sans">
                <div className="flex h-full w-full overflow-auto">
                    <Mailbox />
                    <CurrentEmail />
                </div>
                <div className="bottom-0 w-full shrink-0 grow-0">
                    <StatusBar />
                </div>
            </div>
            <ReactTooltip place="right" className="!rounded !px-3 !py-1 !text-xs" />
        </VechaiProvider>
    );
}

export default App;
