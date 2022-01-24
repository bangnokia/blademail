import Mailbox from "./Mailbox";
import SmtpServer from "./SmtpServer";

function s(obj: Object): Object {
    return JSON.stringify(obj);
}

function App() {
    return (
        <div className="bg-white w-screen h-screen flex">
            {/* sidebar */}
            <div className="h-full w-14 bg-stone-800 hidden"></div>
            <Mailbox />
            <SmtpServer />
        </div>
    );
}

export default App;
