import { useLayoutEffect, useEffect } from "react";
import CurrentEmail from "./components/CurrentEmail";
import Mailbox from "./components/Mailbox";
import { startSmtpServer } from "./smtp";

function App() {
    useEffect(function () {
        startSmtpServer().then(() => console.log("SMTP server started"));
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
