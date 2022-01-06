import { useState } from "react";

type Email = {
    sender: string;
    subject: string;
    content: string;
    date: string;
};

function emails(total): Email[] {
    const emails: Email[] = [];
    for (let i = 0; i < total; i++) {
        emails.push({
            sender: "Laravel " + i,
            subject: "Your order is in transit",
            date: "2020-01-01",
            content:
                "Lorem ipsum dolor it amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        });
    }

    return emails;
}

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="bg-white w-screen h-screen flex">
            {/* sidebar */}
            <div className="h-full w-14 bg-stone-800"></div>

            <div className="flex w-full h-full">
                {/* list email */}
                <div className="w-80 h-full overflow-y-auto flex flex-col text-white px-2 py-2">
                    {emails(20).map((email, index) => (
                        <div
                            key={index}
                            className={
                                `px-5 py-3 rounded-md` +
                                (index === 0 ? " bg-cyan-500" : "")
                            }
                        >
                            <div className="flex flex-col gap-y-1">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold text-sm text-gray-800">
                                        {email.sender}
                                    </h3>
                                    <time
                                        dateTime={email.date}
                                        className="text-xs text-gray-600"
                                    >
                                        {email.date}
                                    </time>
                                </div>
                                <div className="text-xs text-gray-900">
                                    {email.subject}
                                </div>
                                <p className="text-xs text-gray-600">
                                    {email.content.substring(0, 50)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* view email content */}
                <div></div>
            </div>
        </div>
    );
}

export default App;
