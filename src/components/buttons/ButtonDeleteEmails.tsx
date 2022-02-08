import useStore from "../../store";

export default function ButtonDeleteEmails() {
    const deleteEmails = useStore((state) => state.deleteEmails);

    function deleteAllEmails() {
        deleteEmails();
    }

    return (
        <button type="button" className="rounded bg-rose-500 px-2 py-1 text-xs text-white hover:bg-rose-600">
            DELETE ALL
        </button>
    );
}
