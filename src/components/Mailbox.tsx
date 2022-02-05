import MailItem from "./MailItem";
import useStore, { Email } from "../store";
import shallow from "zustand/shallow";
import ButtonAutoOpenNewEmail from "./buttons/ButtonAutoOpenNewEmail";
import ButtonDeleteEmails from "./buttons/ButtonDeleteEmails";

export default function Mailbox() {
    const [emails, setCurrentEmailId] = useStore((state) => [state.emails, state.setCurrentEmailId], shallow);

    function openEmail(email: Email) {
        email.isOpen = true;
        setCurrentEmailId(email.id);
    }

    return (
        <div className="hidden h-full w-[450px] flex-col overflow-y-auto  p-2 text-white md:flex">
            <div className="toolbox flex items-end justify-between p-2 pt-0">
                <ButtonAutoOpenNewEmail />
                <ButtonDeleteEmails />
            </div>
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
