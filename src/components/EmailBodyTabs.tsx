import { useState } from "react";
import { Email } from "../types";
import BrokenLinksChecker from "./BrokenLinksChecker";

export default function EmailBodyTabs({ email }: { email: Email }) {
    const tabs = ["html", "html source", "text", "raw", 'links checker'];
    const [activeTab, setActiveTab] = useState("links checker");

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
                        className={`h-full w-full ${activeTab === "html" ? "block" : "hidden"}`}
                    />
                    <pre className={activeTab === "html source" ? "block" : "hidden"}>{email.html}</pre>
                    <pre className={activeTab === "text" ? "block" : "hidden"}>{email.text}</pre>
                    <pre className={activeTab === "raw" ? "block" : "hidden"}>{email.raw}</pre>
                    <div className={activeTab === "links checker" ? "block" : "hidden"}>
                        {activeTab === 'links checker' && <BrokenLinksChecker email={email} />}
                    </div>
                </div>
            </div>
        </>
    );
}
