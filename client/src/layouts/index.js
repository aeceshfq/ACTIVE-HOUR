import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { CssBaseline } from '@mui/material';
import { blueGrey, common, indigo } from '@mui/material/colors';
import store from 'store2';
import namespace from '../namespace';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
export const useThemeMode = () => React.useContext(ColorModeContext);

export default function ThemeColorModeProvider() {
  const [mode, setMode] = React.useState(store.get(namespace.app_modes) || 'light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
            let dmode = prevMode === 'light' ? 'dark' : 'light';
            store.set(namespace.app_modes, dmode);
            return dmode;
        });
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        breakpoints: {
            values: {
                xs: 320,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
            },
        },
        palette: {
            mode: mode,
            primary: indigo,
            secondary: indigo,
            background: {
                default: mode === "light"?"#f5f5ff":common.black
            }
        },
        shadows: [
            "0px 1px 1px rgba(0, 0, 0, 0.30)",
            "0px 1px 2px rgba(0, 0, 0, 0.30)",
            "0px 1px 5px rgba(0, 0, 0, 0.30)",
            "0px 1px 8px rgba(0, 0, 0, 0.30)",
            "0px 1px 10px rgba(0, 0, 0, 0.30)",
            "0px 1px 14px rgba(0, 0, 0, 0.30)",
            "0px 1px 18px rgba(0, 0, 0, 0.30)",
            "0px 2px 16px rgba(0, 0, 0, 0.30)",
            "0px 3px 14px rgba(0, 0, 0, 0.30)",
            "0px 3px 16px rgba(0, 0, 0, 0.30)",
            "0px 4px 18px rgba(0, 0, 0, 0.30)",
            "0px 4px 20px rgba(0, 0, 0, 0.30)",
            "0px 5px 22px rgba(0, 0, 0, 0.30)",
            "0px 5px 24px rgba(0, 0, 0, 0.30)",
            "0px 5px 26px rgba(0, 0, 0, 0.30)",
            "0px 6px 28px rgba(0, 0, 0, 0.30)",
            "0px 6px 30px rgba(0, 0, 0, 0.30)",
            "0px 6px 32px rgba(0, 0, 0, 0.30)",
            "0px 7px 34px rgba(0, 0, 0, 0.30)",
            "0px 7px 36px rgba(0, 0, 0, 0.30)",
            "0px 8px 38px rgba(0, 0, 0, 0.30)",
            "0px 8px 40px rgba(0, 0, 0, 0.30)",
            "0px 8px 42px rgba(0, 0, 0, 0.30)",
            "0px 9px 44px rgba(0, 0, 0, 0.30)",
            "0px 9px 46px rgba(0, 0, 0, 0.30)",
        ],
        components: {
            MuiTable : {
                defaultProps: {
                    style: {
                        backgroundColor: mode === 'dark'?null:"#ffffff"
                    },
                },
            },
            MuiAppBar:{
                defaultProps: {
                    variant: "elevation",
                    style: {
                        backdropFilter: "blur(6px)",
                        boxShadow: "none",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backgroundColor: mode === 'dark'?common.black:blueGrey[900],
                        color: common.white
                    }
                }
            },
            MuiCard: {
                defaultProps: {
                    variant: "outlined",
                    style: {
                        borderRadius: 0,
                        backgroundColor: mode === 'dark'?null:"#ffffff"
                    },
                },
            },
            MuiPaper: {
                defaultProps: {
                    style: {
                        backgroundColor: mode === 'dark'?null:"#ffffff",
                        borderRadius: 0,
                    },
                },
            },
            MuiListSubheader: {
                defaultProps: {
                    style: {
                        backgroundColor: "transparent",
                        textTransform: "uppercase"
                    }
                }
            },
            MuiButton: {
                defaultProps: {
                    variant: "contained",
                    size: "medium",
                    color: "primary"
                }
            },
            MuiTextField: {
                defaultProps: {
                    size: "small",
                    margin: "normal",
                },
            }
        },
        mixins: {
            toolbar: {
                height: "56px",
                minHeight: "56px"
            }
        }
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <App />
                </LocalizationProvider>
            </BrowserRouter>
        </ThemeProvider>
    </ColorModeContext.Provider>
  );
}