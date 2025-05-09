"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import CodeMirror from "../components/CodeMirror"

const SyncBoardApp = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [color, setColor] = useState("#000000")
    const [notebookMode, setNotebookMode] = useState(false)
    const [data, setData] = useState("")
    const [drawingData, setDrawingData] = useState<ImageData | null>(null)

    // Initialize canvas and handle resizing
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d")
        if (!context) return

        const resizeCanvas = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect()
                canvas.width = width
                canvas.height = height

                // Restore drawing data if available
                if (drawingData) {
                    try {
                        context.putImageData(drawingData, 0, 0)
                    } catch (e) {
                        console.error("Failed to restore canvas state:", e)
                    }
                }
            }
        }

        // Set initial canvas size
        resizeCanvas()

        // Set stroke style based on current color
        context.strokeStyle = color
        context.lineWidth = 2

        // Add resize event listener
        window.addEventListener("resize", resizeCanvas)

        return () => {
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [drawingData, color, notebookMode])

    // Restore drawing when switching back to drawing mode
    useEffect(() => {
        if (!notebookMode && drawingData) {
            const canvas = canvasRef.current
            if (!canvas) return

            const context = canvas.getContext("2d")
            if (!context) return

            try {
                context.putImageData(drawingData, 0, 0)
            } catch (e) {
                console.error("Failed to restore canvas state:", e)
            }
        }
    }, [notebookMode, drawingData])

    const onDrawingStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return

        // get current bounding box of the canvas
        const { left, top } = canvas.getBoundingClientRect()

        // get current mouse position
        const x = e.clientX - left
        const y = e.clientY - top

        setIsDrawing(true) // we are drawing

        context.beginPath()
        context.moveTo(x, y)
    }

    const onDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context || !isDrawing) return

        // get current mouse position
        const { left, top } = canvas.getBoundingClientRect()
        const x = e.clientX - left
        const y = e.clientY - top

        // draw line
        context.lineTo(x, y)
        context.stroke()
    }

    const onDrawingStop = () => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return

        context.closePath()
        setIsDrawing(false)

        // Save the current state of the canvas
        try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            setDrawingData(imageData)
        } catch (e) {
            console.error("Failed to save canvas state:", e)
        }
    }

    const onColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newColor = e.target.value
        setColor(newColor)

        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return

        context.strokeStyle = newColor
        context.fillStyle = newColor
    }

    const onTextChange = (value: string) => {
        setData(value)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const context = canvas.getContext("2d")
        if (!context) return

        context.clearRect(0, 0, canvas.width, canvas.height)
        setDrawingData(null) // Clear saved image data too
    }

    // Handle mode switching with state preservation
    const handleModeToggle = () => {
        // If switching from draw to code, save the canvas state first
        if (!notebookMode) {
            const canvas = canvasRef.current
            if (canvas) {
                const context = canvas.getContext("2d")
                if (context) {
                    try {
                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
                        setDrawingData(imageData)
                    } catch (e) {
                        console.error("Failed to save canvas state:", e)
                    }
                }
            }
        }

        // Toggle the mode
        setNotebookMode(!notebookMode)
    }

    return (
        <div className="flex flex-col w-full h-full p-4">
            <div className="border-2 border-gray-300 rounded-md w-full h-full flex flex-col">
                <div className="flex items-center p-2 gap-2 border-b border-gray-300">
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={handleModeToggle}
                    >
                        {notebookMode ? "Switch to Draw" : "Switch to Code"}
                    </button>

                    {!notebookMode && (
                        <button
                            className="btn px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                            onClick={clearCanvas}
                        >
                            Clear Canvas
                        </button>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        <label htmlFor="color-select">Color:</label>
                        <select
                            id="color-select"
                            className="select border border-gray-300 rounded px-2 py-1"
                            onChange={onColorChange}
                            value={color}
                        >
                            <option value="#000000">Black</option>
                            <option value="#ffffff">White</option>
                            <option value="#ff0000">Red</option>
                            <option value="#00ff00">Green</option>
                            <option value="#0000ff">Blue</option>
                        </select>
                    </div>
                </div>

                <div className="flex-grow w-full relative">
                    {notebookMode ? (
                        <div className="w-full h-full">
                            <CodeMirror data={data} readOnly={false} textChangeHandler={onTextChange} />
                        </div>
                    ) : (
                        <div ref={containerRef} className="w-full h-full bg-white">
                            <canvas
                                ref={canvasRef}
                                onMouseDown={onDrawingStart}
                                onMouseUp={onDrawingStop}
                                onMouseMove={onDrawing}
                                onMouseLeave={onDrawingStop}
                                className="cursor-crosshair"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SyncBoardApp
