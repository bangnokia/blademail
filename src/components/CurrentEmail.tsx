import { useCallback, useState } from "react";
import useStore from "../store";
import EmailBodyTabs from "./EmailBodyTabs";

export default function CurrentEmail() {
    const currentEmailId = useStore((state) => state.currentEmailId);
    const email = useStore(
        useCallback((state) => state.emails.find((email) => email.id === state.currentEmailId), [currentEmailId])
    );

    if (!email) {
        return <BlankEmail />;
    }
    return (
        <div className="relative h-full w-full overflow-auto border">
            <header className="grid grid-cols-1 px-5 py-3 lg:grid-cols-2">
                <div className="flex gap-x-5 py-1 text-sm">
                    <div className="upp w-24 font-semibold">Subject:</div>
                    <div className="font-semibold uppercase">{email.subject.trim()}</div>
                </div>
                <div className="flex gap-x-5 py-1 text-sm">
                    <div className="w-24 font-semibold">From:</div>
                    <div>
                        {email.sender[0]} {`<${email.sender[1]}>`}
                    </div>
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
                <EmailBodyTabs email={email} />
            </main>
        </div>
    );
}

function BlankEmail() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="text-gray-500">
                <div className="flex flex-col items-center space-y-5">
                    <h4 className="text-xl font-semibold">Configuration for Laravel</h4>
                    <pre className=" relative rounded bg-gray-500 py-1 px-2 font-mono text-white">
                        MAIL_MAILER=smtp{"\n"}
                        MAIL_HOST=127.0.0.1{"\n"}
                        MAIL_PORT=1025{"\n"}
                        MAIL_USERNAME=null{"\n"}
                        MAIL_PASSWORD=null
                    </pre>
                </div>
            </div>
        </div>
    );
}
