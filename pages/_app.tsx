import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useState, useMemo, createContext, useContext } from "react";
import { light, dark } from '../scss/MaterialTheme';
import "../scss/styles/globals.css";

// Context for toggling color mode
export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export default function App({ Component, pageProps }: AppProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark'); // Default to dark as requested

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () => createTheme(mode === 'light' ? light : dark),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
