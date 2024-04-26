import { createContext, useContext } from "react";

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

const AppDataProvider  = ({children}) => {
    return (
        <AppDataContext.Provider value={{}}>
            {children}
        </AppDataContext.Provider>
    )
}

export default AppDataProvider;