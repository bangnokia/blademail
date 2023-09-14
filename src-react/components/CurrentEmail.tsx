import { useCallback, useState, useEffect } from "react";
import useStore from "../store";
import { Email } from "../types";
import EmailBodyTabs from "./EmailBodyTabs";
import Instruction from "./Instruction";

export default function CurrentEmail() {
    const [size, setSize] = useState(0);
    const currentEmailId = useStore((state) => state.currentEmailId);
    const deleteEmail = useStore((state) => (email: Email) => state.deleteEmail(email));
    const email = useStore(
        useCallback((state) => state.emails.find((email) => email.id === state.currentEmailId), [currentEmailId])
    );

    useEffect(() => {
        if (!email) {
            return;
        }
        setSize(new Blob([email.raw]).size)
    }, [email]);

    function deleteCurrentEmail(email: Email) {
        deleteEmail(email)
    }

    if (!email) {
        return <Instruction />;
    }
    return (
        <div className="relative h-full w-full overflow-auto" key={currentEmailId}>
            <div className="toolbox sticky top-0 w-full z-20 flex items-center justify-between bg-white px-2 py-1 shadow-sm text-gray-700">
                <div>
                    <button onClick={() => deleteCurrentEmail(email)} type="button" className="rounded flex items-center bg-white text-gray-500 px-2 py-1 text-xs hover:text-white hover:bg-rose-500  transition">
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
                <div>
                    <span className="text-xs font-medium">Size: {Math.round(size / 1024)} KB</span>
                </div>
            </div>

            <header className="grid grid-cols-1 px-5 py-3 lg:grid-cols-2 text-sm">
                <div className="flex gap-x-5 py-1">
                    <div className="upp w-24 font-semibold">Subject:</div>
                    <div className="font-semibold uppercase">{email.subject.trim()}</div>
                </div>
                <div className="flex gap-x-5 py-1">
                    <div className="w-24 font-semibold">From:</div>
                    <div>
                        {email.sender[0]} {`<${email.sender[1]}>`}
                    </div>
                </div>
                <div className="flex gap-x-5 py-1">
                    <div className="w-24 font-semibold">To:</div>
                    <div>{email.to.join(", ")}</div>
                </div>
                {email.cc && (
                    <div className="flex gap-x-5 py-1">
                        <div className="w-24 font-semibold">Cc:</div>
                        <div>{email.cc.join(", ")}</div>
                    </div>
                )}
            </header>

            <main className="relative h-full w-full">
                <EmailBodyTabs email={email} />
            </main>
        </div>
    );
}
