import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SyncBoardApp = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io('http://localhost:5000');
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // TODO: Implement start drawing
    };


    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        // TODO: Implement draw
    };

    const stopDrawing = () => {
        // TODO: Implement stop drawing
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className='w-[500px] h-[500px] border-2 border-gray-300 rounded-md'>
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair"
                />
            </div>
        </div>
    );
};

export default SyncBoardApp;