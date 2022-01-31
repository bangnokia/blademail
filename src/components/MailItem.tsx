import * as dayjs from "dayjs";
import useStore, { Email } from "../store";

type MailItemProps = {
    email: Email;
    active: boolean;
};

function formatTime(date: Date) {
    return dayjs(date).format("HH:mm:ss");
}

export default function MailItem({ email }: MailItemProps) {
    const active = useStore((state) => state.currentEmailId === email.id);

    return (
        <div className={`relative cursor-default rounded-md py-3 pl-7 pr-3` + (active ? " bg-sky-300" : "")}>
            {!email.isOpen && <span className="absolute left-2 top-4 block h-2 w-2 rounded-full bg-blue-500"></span>}
            <div className="relative flex flex-col gap-y-1">
                <div className="flex justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">{email.sender[0]}</h3>
                    <time className="text-xs text-gray-600">{formatTime(email.date)}</time>
                </div>
                <div className="text-xs text-gray-900">{email.subject}</div>
                <div className="line-clamp-2 text-xs text-gray-500">{email.excerpt}</div>
            </div>
        </div>
    );
}
