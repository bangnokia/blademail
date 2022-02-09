import { useState, ChangeEvent, DOMAttributes, MouseEventHandler } from "react";
import useStore from "../store";

export default function StatusBar() {
    const [autoOpenNewEmail, setAutoOpenNewEmai] = useStore((state) => [
        state.autoOpenNewEmail,
        state.setAutoOpenNewEmail,
    ]);

    return (
        <div className="bg-gray-300 px-3 text-xs text-gray-700">
            <Checkbox
                id="status-bar-auto-open-email-checkbox" // lol
                label="Auto open email"
                defaultChecked={autoOpenNewEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setAutoOpenNewEmai(e.target.checked);
                }}
            />
        </div>
    );
}

type CheckboxProps = {
    id: string;
    label: string;
    defaultChecked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Checkbox({ label, defaultChecked, onChange }: CheckboxProps) {
    return (
        <div className="inline-block px-1 hover:bg-white/50">
            <label htmlFor="daudau">
                {label}:
                {defaultChecked ? (
                    <svg
                        className="inline h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg
                        className="inline h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </label>
            <input className="hidden" type="checkbox" id="daudau" defaultChecked={defaultChecked} onChange={onChange} />
        </div>
    );
}
