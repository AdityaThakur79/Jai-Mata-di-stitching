import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/admin/content/styles/style.css'
import './assets/user/styles/style.css'
import App from './App.jsx'
import LenisProvider from './components/LenisProvider.jsx'

import { Provider } from 'react-redux'
import { appStore } from './app/store'
import { Toaster } from 'react-hot-toast'

// Buffer polyfill for @react-pdf/renderer
import { Buffer } from 'buffer'
window.Buffer = Buffer

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={appStore}>
      <LenisProvider>
        <App />
        <Toaster />
      </LenisProvider>
    </Provider>
  </>

)
