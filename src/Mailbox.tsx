type Email = {
    sender: string;
    subject: string;
    content: string;
    date: string;
};

function emails(total: number): Email[] {
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

export default function Mailbox() {
    return (
        <div className="flex w-full h-full">
            {/* list email */}
            <div className="w-80 h-full overflow-y-auto flex flex-col text-white px-2 py-2">
                {emails(20).map((email, index) => {
                    const active = index === 1;
                    return (
                        <div
                            key={index}
                            className={
                                `pl-7 pr-3 py-3 rounded-md cursor-default` +
                                (active ? " bg-cyan-500" : "")
                            }
                        >
                            <div className="relative flex flex-col gap-y-1">
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
                    );
                })}
            </div>

            {/* view email content */}
            <div></div>
        </div>
    );
}
