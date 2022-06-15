import { useEffect, useState } from "react";
import { EmailLink } from "../types"
import CheckIcon from "./icons/CheckIcon";
import Loading from "./icons/Loading";
import XIcon from "./icons/XIcon";
import { sleep } from "../utils/utils";
import { getClient, ResponseType } from "@tauri-apps/api/http"

export default function LinkCheckerRow({ link, index }: { link: EmailLink, index: number }) {
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState(() => link.status);

  useEffect(() => {
    async function checkLink() {
      setChecking(true)

      const client = await getClient()
      try {
        const response = await client.get(link.url, { timeout: 12, responseType: ResponseType.Text })

        if (response.status === 200) {
          setStatus('ok')
        } else {
          setStatus('error')
        }

      } catch (ex) {
        console.log('exception', ex)
        setStatus('error')
      }
      setChecking(false)
    }

    if (status === null) {
      checkLink();
    }
  }, [])


  return (
    <tr>
      <td>{index + 1}</td>
      <td className="px-3 py-2 break-all max-w-64">{link.url}</td>
      <td className="px-3 py-1">
        {checking ? <Loading className="w-5 h-5" /> : <LinkStatus status={status} />}
      </td>
    </tr>
  )
}

function LinkStatus({ status }: { status: string | null }) {
  if (status === 'ok') {
    return <CheckIcon className="w-5 h-5 text-sky-500" />
  }

  if (status === 'error') {
    return <XIcon className="w-5 h-5 text-rose-500" />
  }

  return <span className="text-gray-500">--</span>
}