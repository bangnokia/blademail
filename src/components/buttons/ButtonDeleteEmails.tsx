import useStore from "../../store";
export default function ButtonDeleteEmails() {
    const deleteEmails = useStore((state) => state.deleteEmails);
    const deleteAllEmails = function () {
        console.log("delete all emails");
        deleteEmails();
    };

    return (
        <button type="button" className="rounded bg-red-500 px-2 py-1 text-xs" onClick={() => deleteAllEmails()}>
            Delete all
        </button>
    );
}
