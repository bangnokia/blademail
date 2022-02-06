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
        <div className="h-full w-[450px] flex-col text-white md:flex">
            <div className="toolbox top-0 z-20 flex items-end justify-between bg-white p-2 shadow-md">
                <ButtonAutoOpenNewEmail />
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
