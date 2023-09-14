import { useState, } from "react";
import { Email } from "../types";
import BrokenLinksChecker from "./BrokenLinksChecker";
import SpamAssassin from "./SpamAssassin";
import { open } from "@tauri-apps/api/shell";
import GoogleChrome from "./icons/GoogleChrome";
import Firefox from "./icons/Firefox";
import HtmlPreview from "./HtmlPreview";
import { ensureEmailFileIsWritten } from "../utils/utils";

export default function EmailBodyTabs({ email }: { email: Email }) {
    const tabs = ["html", "html source", "text", "raw", 'links checker', 'Spam Assassin'];
    const [activeTab, setActiveTab] = useState("html");
    const [spamScore, setSpamScore] = useState<number | undefined>();

    let spamScoreClasses = 'text-green-500';

    if (spamScore !== undefined) {
        if (spamScore > 0 && spamScore < 5) {
            spamScoreClasses = 'text-yellow-500';
        } else if (spamScore >= 5) {
            spamScoreClasses = 'text-red-500';
        }
    }

    async function openInBrowser(browserName: 'google chrome' | 'firefox') {
        // ensure html file is write to temp folder
        const filePath = await ensureEmailFileIsWritten(email);

        if (filePath) {
            open(filePath, browserName)
        }
    }

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
                            {spamScore !== undefined && tab === "Spam Assassin" && <span className={`px-1 ml-0.5 text-xs rounded ${spamScoreClasses}`}>{spamScore}</span>}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="h-full w-full overflow-auto p-5">
                <div className="h-full w-full rounded-xl bg-white text-sm">
                    {/* html preview tab */}
                    <div className={`relative h-full w-full ${activeTab === "html" ? "flex" : "hidden"}`}>
                        <HtmlPreview html={email.html} />
                        <div className="z-40  absolute top-0 right-0 flex gap-2">
                            <button onClick={() => openInBrowser('google chrome')} type="button" title="Preview in Google chrome" className=" p-1 hover:bg-gray-200 rounded transition">
                                <GoogleChrome className="w-5 h-5" />
                            </button>
                            <button onClick={() => openInBrowser('firefox')} type="button" title="Preview in Firefox" className=" p-1 hover:bg-gray-200 rounded transition">
                                <Firefox className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {/* html source tab */}
                    <div className={activeTab === "html source" ? "w-full h-full flex" : "hidden"}>
                        <textarea
                            readOnly
                            className="w-full border-transparent border font-mono overflow-auto text-sm
                            focus:border-0 focus:ring-0" defaultValue={email.html}></textarea>
                    </div>

                    {/* text tab */}
                    <div className={activeTab === "text" ? "w-full h-full flex" : "hidden"}>
                        <textarea
                            readOnly
                            className="w-full border-transparent border font-mono overflow-auto text-sm
                            focus:border-0 focus:ring-0" defaultValue={email.text}></textarea>
                    </div>

                    {/* raw tab */}
                    <div className={activeTab === "raw" ? "w-full h-full flex" : "hidden"}>
                        <textarea
                            readOnly
                            className="w-full border-transparent border font-mono overflow-auto text-sm
                            focus:border-0 focus:ring-0" defaultValue={email.raw}></textarea>
                    </div>

                    {/* broken links checker tab */}
                    <div className={activeTab === "links checker" ? "flex" : "hidden"}>
                        {activeTab === 'links checker' && <BrokenLinksChecker email={email} />}
                    </div>

                    {/* spam assassin tab */}
                    <div className={activeTab === "Spam Assassin" ? "block" : "hidden"}>
                        <SpamAssassin email={email} setSpamScore={setSpamScore} />
                    </div>
                </div>
            </div>
        </>
    );
}
