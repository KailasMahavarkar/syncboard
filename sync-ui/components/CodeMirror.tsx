import type React from "react"
import { useState } from "react"
import CodeMirrorComponent from "@uiw/react-codemirror"
import { EditorView } from "@codemirror/view"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { cpp } from "@codemirror/lang-cpp"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { json } from "@codemirror/lang-json"
import Toolbox from "./toolbox"

type CodeMirrorProps = {
    data: string
    readOnly?: boolean
    textChangeHandler: (value: string) => void
}

const CodeMirror = (props: CodeMirrorProps) => {
    const { data, readOnly, textChangeHandler } = props
    const [language, setLanguage] = useState("python")

    const [tools, setTools] = useState({
        language: "python",
        showLines: false,
        codeMode: false,
        fontsize: 16,
    })

    // Function to get the appropriate language extension
    const getLanguageExtension = (lang: string) => {
        switch (lang) {
            case "javascript":
                return javascript()
            case "python":
                return python()
            case "cpp":
                return cpp()
            case "css":
                return css()
            case "html":
                return html()
            case "json":
                return json()
            default:
                return python()
        }
    }

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = e.target.value
        setLanguage(newLanguage)
        setTools({
            ...tools,
            language: newLanguage
        })
    }

    return (
        <div className="w-full h-full flex flex-col">
            <Toolbox tools={tools} setTools={setTools} data={{ size: tools.fontsize }} />

            <CodeMirrorComponent
                className="shadow bg-transparent border-[1px] p-3 rounded-md min-h-[calc(100vh_-_200px)]"
                style={{
                    outline: "none",
                    fontSize: `${tools.fontsize}px`,
                }}
                basicSetup={{
                    lineNumbers: tools.showLines,
                    autocompletion: true,
                    highlightActiveLineGutter: false,
                    highlightSpecialChars: false,
                    foldGutter: false,
                    closeBrackets: false,
                    tabSize: 4,
                    highlightActiveLine: true,
                    highlightSelectionMatches: false,
                }}
                readOnly={readOnly || false}
                indentWithTab={true}
                suppressHydrationWarning={true}
                autoFocus={true}
                extensions={[EditorView.lineWrapping, getLanguageExtension(tools.language)]}
                minHeight="calc(100vh - 200px)"
                theme="dark"
                value={data}
                onChange={(value: string) => {
                    textChangeHandler(value)
                }}
            />

            <div className="flex items-center justify-end mt-4 mb-2">
                <select className="select select-bordered w-full max-w-xs" onChange={handleLanguageChange} value={language}>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="json">JSON</option>
                </select>
            </div>
        </div>
    )
}

export default CodeMirror
