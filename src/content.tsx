import type {
  PlasmoCSConfig,
  PlasmoCSUIJSXContainer,
  PlasmoRender
} from "plasmo"
import React, { useEffect } from "react"
import { createRoot } from "react-dom/client"
import * as tocbot from "tocbot"

import "style.css"
import "tocbot/dist/tocbot.css"

const footer = document.querySelector(
  "[id^='PersonalArticlePage-react-component-']"
).lastElementChild.firstElementChild

export const config: PlasmoCSConfig = {
  matches: ["https://qiita.com/*/items/*"]
}

export const getRootContainer = () =>
  new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      clearInterval(checkInterval)
      const rootContainer = document.createElement("div")
      footer.insertBefore(rootContainer, footer.children.item(2))
      resolve(rootContainer)
    }, 1000)
  })

const makeIds = () => {
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
  const headingMap = {}

  headings.forEach((heading) => {
    let id = heading.id
      ? heading.id
      : encodeURIComponent(heading.textContent.trim().toLowerCase())
    headingMap[id] = !isNaN(headingMap[id]) ? ++headingMap[id] : 0
    if (headingMap[id]) {
      heading.id = id + "-" + headingMap[id]
    } else {
      heading.id = id
    }
  })
}

const TOCButton = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  makeIds()

  const contentContainer = document.querySelector(
    "#personal-public-article-body > .mdContent-inner"
  )
  contentContainer.id = "content-container"

  useEffect(() => {
    tocbot.init({
      tocSelector: ".toc",
      contentSelector: "#content-container",
      headingSelector: "h1, h2, h3, h4, h5, h6",
      collapseDepth: 6,
      orderedList: false,
      scrollSmooth: false
    })
    return () => tocbot.destroy()
  }, [])

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => {
          setIsOpen(!isOpen)
        }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24">
          <path
            fill="#5e6060"
            d="M4 17q-.425 0-.712-.288T3 16t.288-.712T4 15h12q.425 0 .713.288T17 16t-.288.713T16 17zm0-4q-.425 0-.712-.288T3 12t.288-.712T4 11h12q.425 0 .713.288T17 12t-.288.713T16 13zm0-4q-.425 0-.712-.288T3 8t.288-.712T4 7h12q.425 0 .713.288T17 8t-.288.713T16 9zm16 8q-.425 0-.712-.288T19 16t.288-.712T20 15t.713.288T21 16t-.288.713T20 17m0-4q-.425 0-.712-.288T19 12t.288-.712T20 11t.713.288T21 12t-.288.713T20 13m0-4q-.425 0-.712-.288T19 8t.288-.712T20 7t.713.288T21 8t-.288.713T20 9"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className="z-50 absolute bottom-16 right-6 p-2 max-w-[320px] rounded-lg max-h-[300px] overflow-y-auto "
        style={{
          backgroundColor: window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "#2f3232"
            : "#fff",
          boxShadow:
            "rgba(30, 33, 33, 0.25) 0px 3px 5px 0px, rgba(255, 255, 255, 0.08) 0px 0px 0px 1px"
        }}
        hidden={!isOpen}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path
              fill={
                window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "#ffffffa6"
                  : "#00000099"
              }
              d="M11 9.825L8.1 12.7q-.275.275-.688.288T6.7 12.7q-.275-.275-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.288.688t-.288.712q-.275.275-.7.275t-.7-.275L13 9.825V17q0 .425-.288.713T12 18q-.425 0-.713-.288T11 17V9.825Z"
            />
          </svg>
          ページトップへ
        </button>
        <p className="font-bold">目次</p>
        <nav className="toc" />
      </div>
    </div>
  )
}

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
  createRootContainer
}) => {
  const rootContainer = await createRootContainer()
  const root = createRoot(rootContainer)
  root.render(<TOCButton />)
}

export default TOCButton
