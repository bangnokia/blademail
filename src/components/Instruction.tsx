import { useEffect, useState } from "react";
import { randomQuotes } from "../utils/quote-machines";

export default function Instruction() {
    const [quote] = useState(() => randomQuotes());

    return (
        <div className="flex h-full w-full mx-auto max-w-2xl flex-col items-center justify-center gap-y-10 p-10">
            <div className="flex flex-col items-center gap-y-5">
                <p className="text-center leading-6 font-mono tracking-wide text-rose-500">{quote}</p>
                <hr className="h-px w-48 bg-gray-300" />
            </div>
            <div className="flex w-full flex-col tracking-wide gap-y-5 rounded-md p-5 text-sm text-gray-500">
                <div>
                    Blade Mail's running it own SMTP server on{" "}
                    <code className="rounded bg-rose-300 px-2 py-1 text-xs text-white">127.0.0.1:1025</code> <br />
                    So please ensure you don't have any other processes running on that port.
                </div>
                <div className="flex flex-col space-y-3">
                    <h4 className="font-semibold tracking-wide">Example configuration</h4>
                    <select defaultValue="laravel" className="w-48 shrink-0 rounded text-sm py-2">
                        <option value="laravel">Laravel</option>
                    </select>
                    <pre className="relative rounded bg-gray-500 px-7 py-3 font-mono text-sm leading-6 text-white">
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
