import { useEffect, useState } from "react"
import { getLicense, saveLicense, verify } from "../stores/license"
import { appDir } from "@tauri-apps/api/path"
import Cog from "./icons/Cog"

export default function LicenseStatus() {
  const [valid, setValid] = useState(true)
  const [open, setOpen] = useState(false)
  const [license, setLicense] = useState<string>('')
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getLicense().then(val => {
      setLicense(val === null ? '' : val)
      if (val) {
        verify(val).then(result => {
          if (!result) {
            setValid(false)
          } else {
            setValid(true)
          }
        })
      }
    })
  }, [])

  async function submit(e: any) { // this shit
    e.preventDefault();
    setLoading(true)
    let isValid = await verify(license)
    setLoading(false)

    if (!isValid) {
      setError('Your license is invalid')
      setLoading(false)
      setValid(false)
      return;
    }

    setError('')
    await saveLicense(license + '')
    setValid(true)
    setOpen(false)
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {!valid && 'Unregistered'}
      <button onClick={() => setOpen(true)}>
        <Cog className="w-4 h-4" />
      </button>
      {open && (
        <div className="fixed inset-0 w-screen h-screen z-40 bg-gray-500/40 grid place-items-center">

          <form className="inset-0 bg-white flex flex-col gap-6 px-8 py-6 rounded-md shadow" onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="license-key" className="text-base font-medium">License key</label>
              <input type="text" id="license-key" placeholder="Your license key"
                defaultValue={license}
                onChange={e => setLicense(e.target.value)}
                className="w-[400px] text-sm rounded border-gray-300 focus:border-sky-500 focus:ring-sky-500" />
              {error && (<p className="text-rose-500 text-sm">{error}</p>)}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-rose-500 text-white px-4 py-2 rounded disabled:bg-opacity-50" disabled={loading || !license}>Save</button>
            </div>
          </form>

        </div>
      )
      }
    </div >
  )
}