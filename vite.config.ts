import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'


// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    plugins: [
        react(),
        tsconfigPaths()
    ],
    server: {
        host: 'localhost',
        port: 3000,
        open: true,
        proxy: {
            '^/(oauth2|login/oauth2|logout|api)': {
                target: 'http://localhost:8080',
                xfwd: true
            }
        },
    }
})
