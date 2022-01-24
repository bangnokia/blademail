import * as dayjs from "dayjs";
import { Email } from "./Mailbox";

type MailItemProps = {
    email: Email;
    active: boolean;
};

function formatTime(date: Date) {
    return dayjs(date).format("HH:mm:ss");
}

export default function MailItem({ email, active }: MailItemProps) {
    return (
        <div className={`pl-7 pr-3 py-3 rounded-md cursor-default` + (active ? " bg-cyan-500" : "")}>
            <div className="relative flex flex-col gap-y-1">
                <div className="flex justify-between">
                    <h3 className="font-semibold text-sm text-gray-800">{email.sender}</h3>
                    <time className="text-xs text-gray-600">{formatTime(email.date)}</time>
                </div>
                <div className="text-xs text-gray-900">{email.subject}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{email.excerpt}</div>
            </div>
        </div>
    );
}
