import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TamboProvider } from '@tambo-ai/react'
import { tamboComponents } from './components/generative-ui'
import './index.css'
import App from './App.tsx'

const TAMBO_CONFIG = {
  apiKey: "apikey",
  model: "meta-llama/llama-4-maverick-17b-128e-instruct",
  components: tamboComponents,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TamboProvider
      apiKey={TAMBO_CONFIG.apiKey}
      components={TAMBO_CONFIG.components}
    >
      <App />
    </TamboProvider>
  </StrictMode>,
)
