import { Email } from "./Mailbox";

export default function DisplayEmail({ email }: { email?: Email }) {
    return (
        <div>
            <h1>{email ? email.subject : "There is no email"}</h1>
        </div>
    );
}
