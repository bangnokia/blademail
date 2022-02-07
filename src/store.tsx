import create, { GetState, SetState } from "zustand";

export type Email = {
    id: string;
    raw: string;
    subject: string;
    from: [string, string][]; // author of message, not the sender
    sender: [string, string]; // [name, email]
    to: string[];
    cc?: string[];
    date: Date;
    html: string;
    text: string;
    excerpt: string;
    isOpen: boolean;
};

type AppState = {
    emails: Email[];
    currentEmailId?: string;
    autoOpenNewEmail: boolean;
    setEmails: (emails: Email[]) => void;
    addEmail: (email: Email) => void;
    setCurrentEmailId: (id?: string) => void;
    setAutoOpenNewEmail: (autoOpenNewEmail: boolean) => void;
    deleteEmails: () => void;
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
}));

export default useStore;
