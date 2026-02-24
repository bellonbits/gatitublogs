import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TamboProvider } from '@tambo-ai/react';
import { tamboComponents } from './components/generative-ui';
import App from './App.tsx';
import './index.css';

const TAMBO_CONFIG = {
  apiKey: "apikey", // User reset this to placeholder
  userKey: "gatitu-user",
  components: tamboComponents,
};

createRoot(document.getElementById('root')!).render(
  <TamboProvider
    apiKey={TAMBO_CONFIG.apiKey}
    userKey={TAMBO_CONFIG.userKey}
    components={TAMBO_CONFIG.components}
  >
    <App />
  </TamboProvider>,
);
