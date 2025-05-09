import React from "react"
import { Code, Type } from "lucide-react"

type ToolboxProps = {
    tools: {
        language: string
        showLines: boolean
        codeMode: boolean
        fontsize: number
    }
    setTools: React.Dispatch<
        React.SetStateAction<{
            language: string
            showLines: boolean
            codeMode: boolean
            fontsize: number
        }>
    >
    data: {
        size: number
    }
}

const Toolbox = ({ tools, setTools }: ToolboxProps) => {
    return (
        <div className="flex items-center gap-4 p-2 mb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <Code size={16} className="text-gray-500" />

                <select
                    className="select select-sm"
                    value={tools.language}
                    onChange={(e) => setTools({ ...tools, language: e.target.value })}
                >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="java">Java</option>
                    <option value="c">C</option>
                    <option value="c++">C++</option>
                    <option value="c#">C#</option>
                </select>

                <span className="text-sm font-medium">
                    {tools.language.charAt(0).toUpperCase() + tools.language.slice(1)}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showLines"
                    checked={tools.showLines}
                    onChange={() => setTools({ ...tools, showLines: !tools.showLines })}
                    className="checkbox checkbox-sm"
                />
                <label htmlFor="showLines" className="text-sm cursor-pointer">
                    Show Line Numbers
                </label>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <Type size={16} className="text-gray-500" />
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setTools({ ...tools, fontsize: Math.max(12, tools.fontsize - 2) })}
                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-l"
                    >
                        -
                    </button>
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800">{tools.fontsize}px</span>
                    <button
                        onClick={() => setTools({ ...tools, fontsize: Math.min(24, tools.fontsize + 2) })}
                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-r"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toolbox
