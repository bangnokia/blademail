import { EmailLink } from "../types";
import LinkCheckerRow from "./LinkCheckerRow";

export default function BrokenLinksChecker({ links }: { links: EmailLink[] }) {
  const testLinks: EmailLink[] = [
    { url: 'https://deelay.me/5000/https://google.com', status: null },
    { url: 'https://facebook.com', status: null },
    { url: 'https://invalid.clgt', status: null },
    { url: 'https://daudau.cc', status: null },
  ];

  return (
    <div>
      <table className="w-full">
        <tbody>
          {testLinks.map((link, index) => (
            <LinkCheckerRow key={index} link={link} index={index} />
          ))}
        </tbody>
      </table>

    </div>
  )
}