import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TamboProvider } from '@tambo-ai/react';
import { tamboComponents } from './components/generative-ui';
import App from './App.tsx';
import './index.css';

const TAMBO_CONFIG = {
  apiKey: "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", // User reset this to placeholder
  model: "groq/meta-llama/llama-4-maverick-17b-128e-instruct",
  components: tamboComponents,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TamboProvider
      apiKey={TAMBO_CONFIG.apiKey}
      model={TAMBO_CONFIG.model}
      components={TAMBO_CONFIG.components}
    >
      <App />
    </TamboProvider>
  </StrictMode>,
);
