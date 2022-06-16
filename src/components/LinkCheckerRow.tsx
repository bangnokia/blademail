import { useEffect, useState } from "react";
import { EmailLink, EmailLinkStatus } from "../types"
import CheckIcon from "./icons/CheckIcon";
import Loading from "./icons/Loading";
import XIcon from "./icons/XIcon";
import { getClient, ResponseType } from "@tauri-apps/api/http"

interface LinkCheckerProps {
  link: EmailLink;
  index: number,
  forceCheck?: boolean;
  onFinished: (link: EmailLink, status: EmailLinkStatus) => void;
}

export default function LinkCheckerRow({ link, index, forceCheck = false, onFinished }: LinkCheckerProps) {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<EmailLinkStatus>(() => link.status);

  useEffect(() => {
    async function checkLink() {
      setChecking(true)
      let newStatus = status;

      const client = await getClient()
      try {
        const response = await client.get(link.url, { timeout: 12, responseType: ResponseType.Text })

        if (response.status === 200) {
          newStatus = 'ok'
        } else {
          newStatus = 'error'
        }
      } catch (ex) {
        newStatus = 'error'
      }
      setStatus(newStatus)
      onFinished(link, newStatus)
      setChecking(false)
    }

    if (status === 'pending') {
      checkLink();
    }
  }, [])


  return (
    <tr>
      <td className="w-10 border text-center">{index + 1}</td>
      <td className="border px-3 py-1.5 break-all max-w-64">{link.url}</td>
      <td className="border px-3 py-1 text-center w-8">
        {checking ? <Loading className="w-5 h-5" /> : <LinkStatus status={status} />}
      </td>
    </tr>
  )
}

function LinkStatus({ status }: { status: EmailLinkStatus }) {
  if (status === 'ok') {
    return <CheckIcon className="w-5 h-5 text-sky-500" />
  }

  if (status === 'error') {
    return <XIcon className="w-5 h-5 text-rose-500" />
  }

  return <span className="text-gray-500">--</span>
}