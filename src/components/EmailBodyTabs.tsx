import { useState } from "react";
import { Email } from "../store";

export default function EmailBodyTabs({ email }: { email: Email }) {
    const tabs = ["html", "html source", "text", "raw"];
    const [activeTab, setActiveTab] = useState("html");
    const size = new Blob([email.raw]).size;

    return (
        <>
            <div className="flex items-center justify-between bg-gray-200 px-5 py-2 text-xs font-medium">
                <ul className="flex items-center space-x-3 ">
                    {tabs.map((tab) => (
                        <li
                            key={tab}
                            className={`cursor-default rounded px-3 py-1 ${tab === activeTab ? "bg-sky-300" : ""}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.toUpperCase()}
                        </li>
                    ))}
                </ul>
                {/* meta info   */}
                <div>
                    <div>Size: {Math.round(size / 1024)} KB</div>
                </div>
            </div>
            <div className="h-full w-full overflow-auto p-5">
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
        </>
    );
}
