import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { GdsThemeProvider } from '@gdsc-dju/styled-components';
import GlobalStyles from './styles/globalStyles';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GdsThemeProvider mode={'dark-only'}>
      <GlobalStyles />
      <div style={{ minHeight: '100vh' }}>
        <App />
      </div>
    </GdsThemeProvider>
  </React.StrictMode>,
);
