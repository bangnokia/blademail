import useStore from "../../store";

export default function ButtonDeleteEmails() {
    const deleteEmails = useStore((state) => state.deleteEmails);

    function deleteAllEmails() {
        deleteEmails();
    }

    return (
        <button data-tip="Delete all emails" onClick={deleteAllEmails} type="button" className="rounded flex items-center bg-rose-500 px-2 py-1 text-xs text-white hover:bg-rose-600  transition">
            <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
    );
}
