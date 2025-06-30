import React from "react";
import { HashRouter as Router, Route, useLocation } from "react-router-dom";
import NavBar from "./components/navbar";
import MyRoutes from "./routes/routes";
import HeadMenu from "./components/headmenu";
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1faec5',
    },
    danger:{
      main: '#000',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          scrollbar-width: thin;
          scrollbar-color:  #036574 transparent;
        }

        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
        }

        *::-webkit-scrollbar-thumb {
          background-color: rgba(31, 174, 197, 0.5);
          border-radius: 20px;
          border: transparent;
        }

        *::-webkit-scrollbar-thumb:hover {
          background-color: rgba(31, 174, 197, 0.7);
        }
      `,
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
    <Router>
      <AppContent />
    </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();

  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/prewelcome" || location.pathname === "/";

  return (
    <div>
      {!isLoginPage && <HeadMenu /> && <NavBar />}
      <MyRoutes />
    </div>
  );
}

export default App;
