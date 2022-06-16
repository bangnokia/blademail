import { useState } from "react";
import { Email } from "../types";
import BrokenLinksChecker from "./BrokenLinksChecker";
import SpamAssassin from "./SpamAssassin";

export default function EmailBodyTabs({ email }: { email: Email }) {
    const tabs = ["html", "html source", "text", "raw", 'links checker', 'Spam Assassin'];
    const [activeTab, setActiveTab] = useState("html");

    return (
        <>
            <div className="flex items-center justify-between bg-gray-200 px-5 py-2 text-xs font-medium text-gray-700">
                <ul className="flex items-center space-x-3">
                    {tabs.map((tab) => (
                        <li
                            key={tab}
                            className={`cursor-default rounded px-3 py-1 ${tab === activeTab ? "bg-white" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.toUpperCase()}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="h-full w-full overflow-auto p-5">
                <div className="h-full w-full rounded-xl bg-white text-sm">
                    <iframe
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        srcDoc={email.html}
                        frameBorder="0"
                        className={`h-full w-full ${activeTab === "html" ? "flex" : "hidden"}`}
                    />
                    <pre className={activeTab === "html source" ? "flex" : "hidden"}>{email.html}</pre>
                    <pre className={activeTab === "text" ? "flex" : "hidden"}>{email.text}</pre>
                    <div className={activeTab === "raw" ? "w-full h-full flex" : "hidden"}>
                        <textarea
                            readOnly
                            className="w-full border-transparent border font-mono overflow-auto text-sm
                            focus:border-0 focus:ring-0">{email.raw}</textarea>
                    </div>
                    <div className={activeTab === "links checker" ? "flex" : "hidden"}>
                        {activeTab === 'links checker' && <BrokenLinksChecker email={email} />}
                    </div>
                    <div className={activeTab === "Spam Assassin" ? "block" : "hidden"}>
                        <SpamAssassin email={email} />
                    </div>
                </div>
            </div>
        </>
    );
}
