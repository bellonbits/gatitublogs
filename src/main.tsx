import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TamboProvider } from '@tambo-ai/react';
import { tamboComponents, tamboTools } from './lib/tambo';
import App from './App.tsx';
import './index.css';

const TAMBO_CONFIG = {
  apiKey: import.meta.env.VITE_TAMBO_API_KEY || "tambo_rGgcn8LdF8XdDwxOJ5OeESdqqk6hoOWiwfEIMlGOjJZ5Cm3/5dvaKbvg3rFtorE+y/XFsmMr3mMbQPZCZpeXxQSMQVw7VvDouKu9K+Ppomc=",
  userKey: "gatitu-user",
  components: tamboComponents,
};

createRoot(document.getElementById('root')!).render(
  <TamboProvider
    apiKey={TAMBO_CONFIG.apiKey}
    userKey={TAMBO_CONFIG.userKey}
    components={tamboComponents}
    tools={tamboTools}
  >
    <App />
  </TamboProvider>,
);
