import { useCallback } from "react";
import useStore from "../store";

export default function CurrentEmail() {
    const currentEmailId = useStore((state) => state.currentEmailId);
    const email = useStore(
        useCallback((state) => state.emails.find((email) => email.id === state.currentEmailId), [currentEmailId])
    );

    console.log("email", email);

    if (!email) {
        return <div>There is no selected email</div>;
    }
    return (
        <div className="w-full border p-2">
            <header className="grid grid-cols-1 divide-y">
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

            <main>
                <div dangerouslySetInnerHTML={{ __html: email.html }}></div>
            </main>
        </div>
    );
}
