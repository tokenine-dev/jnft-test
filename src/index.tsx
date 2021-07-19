import React from 'react'
import ReactDOM from 'react-dom'
import { RecoilRoot } from 'recoil'

import reportWebVitals from './reportWebVitals'
import { Router } from './routes'

import './styles/base/index.scss'
import 'react-slideshow-image/dist/styles.css'
import DAppProvider from './providers/dapp'
import { AppStoreProvider } from 'hooks/context'

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <DAppProvider>
                <AppStoreProvider>
                    <Router />
                </AppStoreProvider>
            </DAppProvider>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById("root")
)

reportWebVitals()
