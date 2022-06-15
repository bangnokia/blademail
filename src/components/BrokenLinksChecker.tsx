import { EmailLink } from "../types";
import LinkCheckerRow from "./LinkCheckerRow";

export default function BrokenLinksChecker({ links }: { links: EmailLink[] }) {
  const testLinks: EmailLink[] = [
    { url: 'https://deelay.me/5000/https://google.com', status: null },
    { url: 'https://facebook.com', status: null },
    { url: 'https://invalid.clgt', status: null },
    { url: 'https://daudau.cc', status: null },
  ];

  function checkUrls() {

  }

  return (
    <div>
      <div className="flex items-center">
        <button onClick={checkUrls} type="button" className="px-3 py-1.5 border border-gray-300 text-sm rounded">Recheck</button>
      </div>
      <table className="w-full mt-2">
        <tbody>
          {testLinks.map((link, index) => (
            <LinkCheckerRow key={link.url} link={link} index={index} />
          ))}
        </tbody>
      </table>

    </div>
  )
}