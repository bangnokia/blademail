import { useCallback, useState } from "react";
import useStore from "../store";

export default function CurrentEmail() {
    const currentEmailId = useStore((state) => state.currentEmailId);
    const email = useStore(
        useCallback((state) => state.emails.find((email) => email.id === state.currentEmailId), [currentEmailId])
    );

    const tabs = ["html", "html source", "text", "raw"];
    const [activeTab, setActiveTab] = useState("html");

    if (!email) {
        return <BlankEmail />;
    }
    return (
        <div className="relative h-full w-full overflow-auto border">
            <header className="grid grid-cols-1 px-5 py-3 shadow-lg">
                <div className="flex gap-x-5 py-1 text-sm">
                    <div className="w-24 font-semibold">From:</div>
                    <div>
                        {email.sender[0]} {`<${email.sender[1]}>`}
                    </div>
                </div>
                <div className="flex gap-x-5 py-1 text-sm">
                    <div className="w-24 font-semibold">Subject:</div>
                    <div>{email.subject.trim()}</div>
                </div>
                <div className="flex gap-x-5 py-1 text-sm">
                    <div className="w-24 font-semibold">To:</div>
                    <div>{email.to.join(", ")}</div>
                </div>
                {email.cc && (
                    <div className="flex gap-x-5 py-1 text-sm">
                        <div className="w-24 font-semibold">Cc:</div>
                        <div>{email.cc.join(", ")}</div>
                    </div>
                )}
            </header>

            <main className="relative h-full w-full">
                <ul className="flex w-full space-x-3  px-5 py-1 pb-0 text-sm">
                    {tabs.map((tab) => (
                        <li
                            key={tab}
                            className={`cursor-default rounded-sm px-3 ${tab === activeTab ? "bg-sky-300" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
                <div className="h-full w-full p-5">
                    <div className="h-full w-full rounded-xl bg-white text-sm">
                        <iframe
                            srcDoc={email.html}
                            frameBorder="0"
                            className={`h-full w-full ${activeTab === "html" ? "block" : "hidden"}`}
                        />
                        <pre className={activeTab === "html source" ? "block" : "hidden"}>{email.html}</pre>
                        <pre className={activeTab === "text" ? "block" : "hidden"}>{email.text}</pre>
                        <pre className={activeTab === "raw" ? "block" : "hidden"}>{email.raw}</pre>
                    </div>
                </div>
            </main>
        </div>
    );
}

function BlankEmail() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="text-gray-500">
                <div className="flex flex-col items-center space-y-5">
                    <div>Blade mail's SMTP server running at</div>
                    <code className="relative rounded bg-gray-500 py-1 px-2 font-mono text-white">
                        127.0.0.1:1025
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
                        </span>
                    </code>
                </div>
            </div>
        </div>
    );
}
