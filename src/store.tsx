import create, { GetState, SetState } from "zustand";
import { Email, EmailLink } from "./types";

type AppState = {
    emails: Email[];
    currentEmailId?: string;
    autoOpenNewEmail: boolean;
    setEmails: (emails: Email[]) => void;
    addEmail: (email: Email) => void;
    setCurrentEmailId: (id?: string) => void;
    setAutoOpenNewEmail: (autoOpenNewEmail: boolean) => void;
    deleteEmails: () => void;
    deleteEmail: (email: Email) => void,
    setEmailLinks: (email: Email, links: EmailLink[]) => void;
};

const useStore = create<AppState>((set) => ({
    emails: [],
    currentEmailId: undefined,
    autoOpenNewEmail: true,
    setEmails: (emails) => set({ emails }),
    addEmail: (email: Email) =>
        set((state) => ({
            emails: [{ ...email, isOpen: state.autoOpenNewEmail }, ...state.emails],
            currentEmailId: state.autoOpenNewEmail ? email.id : state.currentEmailId,
        })),
    setCurrentEmailId: (id) => set({ currentEmailId: id }),
    setAutoOpenNewEmail: (autoOpenNewEmail: boolean) => set({ autoOpenNewEmail }),
    deleteEmails: () => set({ emails: [], currentEmailId: undefined }),
    deleteEmail: (email: Email) => set((state) => ({
        emails: state.emails.filter((e) => e.id !== email.id),
        currentEmailId: state.currentEmailId === email.id ? undefined : state.currentEmailId,
    })),
    setEmailLinks: (email: Email, links: EmailLink[]) => set((state) => {
        const index = state.emails.findIndex((e) => e.id === email.id);
        if (index === -1) {
            return state;
        }
        // replace the email in the state
        const newEmails = [...state.emails];
        newEmails[index] = { ...email, links };
        return { emails: newEmails };
    })
}));

export default useStore;
