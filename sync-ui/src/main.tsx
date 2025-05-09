import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SyncBoardApp from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <div className="w-full h-[calc(100vh-2rem)]">
                <SyncBoardApp />
            </div>
        </main>
    </StrictMode>,
)
