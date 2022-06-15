import MailItem from "./MailItem";
import useStore from "../store";
import { Email } from "../types";
import shallow from "zustand/shallow";
import ButtonDeleteEmails from "./buttons/ButtonDeleteEmails";

export default function Mailbox() {
    const [emails, setCurrentEmailId] = useStore((state) => [state.emails, state.setCurrentEmailId], shallow);

    function openEmail(email: Email) {
        email.isOpen = true;
        setCurrentEmailId(email.id);
    }

    if (!emails.length) {
        return null;
    }

    return (
        <div className="hidden h-full w-[322px] shrink-0 grow-0 flex-col border-r border-gray-300 text-white md:flex">
            <div className="toolbox sticky w-full top-0 z-20 flex items-end justify-between bg-white p-2 shadow-sm">
                <ButtonDeleteEmails />
            </div>
            <div className="items-stretch overflow-y-auto p-2">
                {emails.length > 0 &&
                    emails.map((email, index) => {
                        return (
                            <div onClick={() => openEmail(email)} key={email.id}>
                                <MailItem email={email} active={false} />
                            </div>
                        );
                    })}
            </div>

            {emails.length === 0 && (
                <div className="flex items-center justify-center text-gray-500">You have no emails :(</div>
            )}
        </div>
    );
}
