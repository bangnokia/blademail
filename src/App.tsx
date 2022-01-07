import { useEffect } from "react";
import Mailbox from "./Mailbox";
import SmtpServer from "./SmtpServer";

function App() {
    return (
        <div className="bg-white w-screen h-screen flex">
            {/* sidebar */}
            <div className="h-full w-14 bg-stone-800"></div>
            <SmtpServer />

            {/* <Mailbox /> */}
        </div>
    );
}

export default App;
