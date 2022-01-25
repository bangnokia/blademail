import { useLayoutEffect } from "react";
import DisplayEmail from "./DisplayEmail";
import Mailbox from "./Mailbox";
import { startSmtpServer } from "./smtp";

function App() {
    useLayoutEffect(function () {
        startSmtpServer().then(() => console.log("SMTP server started"));
    }, []);

    return (
        <div className="bg-white w-screen h-screen flex">
            <div className="h-full w-14 bg-stone-800 hidden"></div>
            <Mailbox />
            <DisplayEmail email={null} />
        </div>
    );
}

export default App;
