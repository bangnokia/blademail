import { useEffect, useRef } from "react"
import { open } from "@tauri-apps/api/shell"

export default function HtmlPreview({ html }: { html: string }) {
  const screen = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!screen.current) {
      return
    }
    // render html to shadow dom
    let shadow = screen.current.attachShadow({ mode: "closed" })
    shadow.innerHTML = html
    shadow.querySelectorAll("a").forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        open(a.href)
      })
    });
  }, [])

  return (
    <div className="w-full h-full">
      <div ref={screen}></div>
    </div>
  )
}