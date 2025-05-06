import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react()
    ],
    server: {
        allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', "f01f-120-138-102-134.ngrok-free.app"]
    }
})
