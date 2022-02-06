import { Select } from "@vechaiui/react";
import { randomQuotes } from "../utils/quote-machines";

export default function Instruction() {
    const quote = randomQuotes();

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-y-10 p-10">
            <div className="flex flex-col items-center gap-y-5">
                <p className="text-center font-mono tracking-wider text-sky-500">{quote}</p>
                <hr className="h-px w-48 bg-gray-300" />
            </div>
            <div className="flex w-full flex-col gap-y-5 rounded-md p-5 text-gray-500">
                <div>
                    Blade Mail's running it own SMTP server on{" "}
                    <code className="rounded bg-gray-300 px-2 py-1 text-sm text-sky-500">127.0.0.1:1025</code> <br />
                    So please ensure you don't have any other processes running on that port.
                </div>
                <div className="flex flex-col space-y-3">
                    <h4 className="font-semibold tracking-wide">Example configuration</h4>
                    <select value="laravel" className="w-48 shrink-0 rounded">
                        <option value="laravel">Larave</option>
                    </select>
                    <pre className="relative rounded bg-gray-400 px-7 py-3 font-mono text-sm leading-6 text-white">
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
