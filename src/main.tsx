import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TamboProvider } from '@tambo-ai/react';
import { tamboComponents } from './components/generative-ui';
import App from './App.tsx';
import './index.css';

const TAMBO_CONFIG = {
  apiKey: "apikey", // User reset this to placeholder
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
);
