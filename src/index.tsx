import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { RecoilRoot } from 'recoil'

import App from '@/components/App'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!)

root.render(
    <RecoilRoot>
        <BrowserRouter>
            <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <React.Suspense fallback={<div>Loading...</div>}>
                    <App />
                </React.Suspense>
            </SnackbarProvider>
        </BrowserRouter>
    </RecoilRoot>
)
