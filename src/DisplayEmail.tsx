import { Email } from "./Mailbox";

export interface DisplayEmail {
    email: Email | null;
}

export default function DisplayEmail({ email }: DisplayEmail) {
    return (
        <div>
            <h1>{email ? email.subject : "There is no email"}</h1>
        </div>
    );
}
