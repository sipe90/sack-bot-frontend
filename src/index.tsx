import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { closeSnackbar, SnackbarProvider } from 'notistack'
import { RecoilRoot } from 'recoil'

import App from '@/components/App'
import { Button } from '@mui/material'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!)

root.render(
    <RecoilRoot>
        <BrowserRouter>
            <SnackbarProvider
                autoHideDuration={5000}
                maxSnack={5}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                action={(snackbarId) => (
                    <Button onClick={() => closeSnackbar(snackbarId)}>
                        Dismiss
                    </Button>
                )}
            >
                <React.Suspense fallback={<div>Loading...</div>}>
                    <App />
                </React.Suspense>
            </SnackbarProvider>
        </BrowserRouter>
    </RecoilRoot>
)
