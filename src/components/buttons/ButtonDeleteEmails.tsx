import { Button } from "@vechaiui/react";
import useStore from "../../store";

export default function ButtonDeleteEmails() {
    const deleteEmails = useStore((state) => state.deleteEmails);

    function deleteAllEmails() {
        deleteEmails();
    }

    return (
        <Button type="button" variant="solid" color="red" size="xs" onClick={() => deleteAllEmails()}>
            DELETE ALL
        </Button>
    );
}
