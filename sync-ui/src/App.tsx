import { useState, useEffect, useRef } from 'react';

const SyncBoardApp = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');


    const onDrawingStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        // get current bounding box of the canvas
        const { left, top } = canvas.getBoundingClientRect();

        // get current mouse position
        const x = e.clientX - left;
        const y = e.clientY - top;

        setIsDrawing(true); // we are drawing

        context.beginPath();
        context.moveTo(x, y);
    };


    const onDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        if (!isDrawing) return;
        // get current mouse position
        const { left, top } = canvas.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        // draw line
        context.lineTo(x, y);
        context.stroke();
    };

    const onDrawingStop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        setIsDrawing(false);
        context.closePath();
    };


    const onColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setColor(e.target.value);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        setColor(e.target.value)
        // change the color of the canvas
        context.strokeStyle = e.target.value;
        context.fillStyle = e.target.value;
    }



    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className='w-[500px] h-[500px] border-2 border-gray-300 rounded-md'>
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    onMouseDown={onDrawingStart}
                    onMouseUp={onDrawingStop}
                    onMouseMove={onDrawing}
                    onMouseLeave={onDrawingStop}
                    className="cursor-crosshair"
                />

                <select
                    className='select'
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
    );
};

export default SyncBoardApp;