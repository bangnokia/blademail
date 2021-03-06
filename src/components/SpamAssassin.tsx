import { useEffect, useState } from "react";
import { Email } from "../types";
import { getClient, ResponseType, Body } from "@tauri-apps/api/http";

export interface SpamReport {
  report: string,
  score: number,
  rules: {
    score: number,
    description: string,
  }[]
}

async function checkSpam(raw: string) {
  const client = await getClient();
  const response = await client.post<SpamReport>('https://spamcheck.postmarkapp.com/filter', Body.json({ email: raw }), {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    responseType: ResponseType.JSON
  })

  return response.data
}

export default function SpamAssassin({ email, setSpamScore }: { email: Email, setSpamScore: (score: number) => void }) {
  const [result, setResult] = useState<SpamReport>()

  useEffect(() => {
    const timer = setTimeout(() => {
      checkSpam(email.raw).then(response => {
        setResult(response)
        setSpamScore(response.score)
      })
    }, 500); // this prevent we check spam when email is open too fast

    return () => clearTimeout(timer);
  }, [])

  return (
    <div>
      {result && (
        <div>
          <div className="text-lg font-medium">Score: {result.score}</div>
          <table className="w-full mt-4 border border-collapse">
            <tbody>
              {result.rules.map(rule => (
                <tr key={rule.description}>
                  <td className="w-10 border text-right pr-1 tabular-nums">{rule.score}</td>
                  <td className="border px-3 py-1.5 break-all max-w-64">{rule.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}