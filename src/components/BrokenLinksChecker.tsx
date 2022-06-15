import { useEffect, useState } from "react";
import useStore from "../store";
import { Email, EmailLink, EmailLinkStatus } from "../types";
import LinkCheckerRow from "./LinkCheckerRow";

export default function BrokenLinksChecker({ email }: { email: Email }) {
  const [setEmailLinks] = useStore((state) => [state.setEmailLinks]);
  const [checkTableKey, setCheckTableKey] = useState('arandomstring')
  const [links, setLinks] = useState<EmailLink[]>(function () {
    return email.links;
  });
  const [checkedCount, setCheckedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);

  const total = links.length;

  useEffect(function () {
    setCheckedCount(links.filter((l) => l.status !== 'pending').length);
    setErrorCount(links.filter((l) => l.status === 'error').length);
  }, [])

  useEffect(() => {
    if (checkedCount === total) {
      setEmailLinks(email, links)
    }
  })

  function checkUrls() {
    setCheckedCount(0)
    setErrorCount(0)
    setLinks(links.map((l) => ({ ...l, status: 'pending' })))
    setCheckTableKey(Math.random().toString())
  }

  function handleLinkCheckFinished(link: EmailLink, status: EmailLinkStatus) {
    setCheckedCount(checkedCount => checkedCount + 1);
    if (status === 'error') {
      setErrorCount(errorCount => errorCount + 1);
    }
    setLinks(oldLinks => oldLinks.map(l => l.url === link.url ? { ...link, status } : l))
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={checkUrls} type="button" className="px-3 py-1.5 border border-gray-300 text-sm rounded">Recheck</button>
        <div className="flex items-center gap-3">
          <div>
            Checked: <span>{checkedCount}/{total}</span>
          </div>
          <div>
            Errors: <span className={errorCount > 0 ? 'text-rose-500' : ''}>{errorCount}</span>
          </div>
        </div>
      </div>

      <table className="w-full mt-4 border border-collapse" key={checkTableKey}>
        <tbody>
          {links.map((link, index) => (
            <LinkCheckerRow key={`${email.id}-${link.url}`} link={link} index={index} onFinished={handleLinkCheckFinished} />
          ))}
        </tbody>
      </table>
    </div>
  )
}