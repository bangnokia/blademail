import { useCallback, useState } from "react";
import useStore from "../store";

export default function CurrentEmail() {
    const currentEmailId = useStore((state) => state.currentEmailId);
    const email = useStore(
        useCallback((state) => state.emails.find((email) => email.id === state.currentEmailId), [currentEmailId])
    );

    const tabs = ["html", "text", "raw"];
    const [activeTab, setActiveTab] = useState("html");

    if (!email) {
        return <div>There is no selected email</div>;
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
                <div className="flex gap-x-5 py-1 text-sm">
                    <div className="w-24 font-semibold">Cc:</div>
                    <div>{email.cc.join(", ")}</div>
                </div>
            </header>

            <main className="h-full w-full">
                <ul className="flex w-full items-center justify-center space-x-3  py-2 text-sm">
                    {tabs.map((tab) => (
                        <li
                            key={tab}
                            className={`rounded px-3 ${tab === activeTab ? "bg-sky-300" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
                <div className="h-full w-full p-5">
                    <div className="h-full w-full rounded-xl bg-white">
                        <iframe
                            srcDoc={email.html}
                            frameBorder="0"
                            className={`h-full w-full ${activeTab === "html" ? "block" : "hidden"}`}
                        ></iframe>
                        <pre className={activeTab === "text" ? "block" : "hidden"}>{email.text}</pre>
                        <pre className={activeTab === "raw" ? "block" : "hidden"}>{email.raw}</pre>
                    </div>
                </div>
            </main>
        </div>
    );
}
