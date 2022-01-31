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
    setEmails: (emails: Email[]) => void;
    addEmail: (email: Email) => void;
    currentEmailId?: string;
    setCurrentEmailId: (id?: string) => void;
};

const useStore = create<AppState>((set) => ({
    emails: [],
    setEmails: (emails) => set((state) => ({ emails })),
    addEmail: (email: Email) => set((state) => ({ emails: [email, ...state.emails] })),
    currentEmailId: undefined,
    setCurrentEmailId: (id) => set({ currentEmailId: id }),
}));

export default useStore;
