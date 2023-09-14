import { ChangeEvent, useState } from "react";
import useStore from "../store";
import CheckIcon from "./icons/CheckIcon";
import XIcon from "./icons/XIcon";
import LicenseStatus from "./LicenseStatus";

export default function StatusBar() {
    const [autoOpenNewEmail, setAutoOpenNewEmai] = useStore((state) => [
        state.autoOpenNewEmail,
        state.setAutoOpenNewEmail,
    ]);
    const [validLicense, setValidLicense] = useState(false)

    return (
        <div className="bg-gray-300 px-3 text-xs text-gray-700 flex items-center justify-between">
            <Checkbox
                id="status-bar-auto-open-email-checkbox" // lol
                label="Auto open new email"
                defaultChecked={autoOpenNewEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setAutoOpenNewEmai(e.target.checked);
                }}
            />

            <LicenseStatus />
        </div>
    );
}

type CheckboxProps = {
    id: string;
    label: string;
    defaultChecked: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function Checkbox({ label, defaultChecked, id, onChange }: CheckboxProps) {
    return (
        <div className="inline-block px-1 hover:bg-white/50 rounded-xs">
            <label htmlFor={id}>
                {label}:
                {defaultChecked ? (
                    <CheckIcon className="inline w-5 h-5 text-green-500" />
                ) : (
                    <XIcon className="inline w-5 h-5 text-gray-500" />
                )}
            </label>
            <input className="hidden" type="checkbox" id={id} defaultChecked={defaultChecked} onChange={onChange} />
        </div >
    );
}
