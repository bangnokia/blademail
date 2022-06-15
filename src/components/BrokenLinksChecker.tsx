import { useEffect, useState } from "react";
import { Email, EmailLink } from "../types";
import LinkCheckerRow from "./LinkCheckerRow";

// extract all a links and image urls from html
function parseUrls(html: string): string[] {
  const links = [];
  const images = [];
  const regex = /(<a[^>]+href=")([^"]+)("[^>]*>)([^<]*)(<\/a>)/g;
  let match;
  while (match = regex.exec(html)) {
    links.push(match[2]);
  }
  const regex2 = /(<img[^>]+src=")([^"]+)("[^>]*>)/g;
  while (match = regex2.exec(html)) {
    images.push(match[2]);
  }
  return links.concat(images);
}

export default function BrokenLinksChecker({ email }: { email: Email }) {
  const [checkTableKey, setCheckTableKey] = useState('arandomstring')
  const [links, setLinks] = useState<EmailLink[]>([]);
  const [checkedCount, setCheckedCount] = useState(() => {
    if (!email.links) {
      return 0;
    }
    return email.links.filter((l) => l.status === null).length;
  });

  const total = links.length;

  useEffect(() => {
    const result = parseUrls(email.html);
    setLinks(result.map((item) => ({
      url: item,
      status: null
    })))
  }, [email.id])

  function checkUrls() {
    setCheckedCount(0)
    setCheckTableKey(Math.random().toString())
  }

  function increaseCheckedCount() {
    setCheckedCount(checkedCount => checkedCount + 1);
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={checkUrls} type="button" className="px-3 py-1.5 border border-gray-300 text-sm rounded">Recheck</button>
        <div>
          Checked: <span>{checkedCount}/{total}</span>
        </div>
      </div>

      <table className="w-full mt-2 border border-collapse" key={checkTableKey}>
        <tbody>
          {links.map((link, index) => (
            <LinkCheckerRow key={link.url} link={link} index={index} onFinished={increaseCheckedCount} />
          ))}
        </tbody>
      </table>

    </div>
  )
}