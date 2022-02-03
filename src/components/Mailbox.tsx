import MailItem from "./MailItem";
import useStore, { Email } from "../store";
import shallow from "zustand/shallow";

export default function Mailbox() {
    const [emails, setCurrentEmailId] = useStore((state) => [state.emails, state.setCurrentEmailId], shallow);

    function openEmail(email: Email) {
        email.isOpen = true;
        setCurrentEmailId(email.id);
    }

    return (
        <div className="hidden h-full w-[450px] flex-col overflow-y-auto p-2 text-white md:flex">
            {emails.map((email, index) => {
                return (
                    <div onClick={() => openEmail(email)} key={email.id}>
                        <MailItem email={email} active={false} />
                    </div>
                );
            })}
        </div>
    );
}
