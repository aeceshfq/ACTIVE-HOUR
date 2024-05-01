import { createContext, useContext } from "react";
import { useFetch, useRequest } from "./AppProvider";
import server_route_names from "../routes/server_route_names";
import CreateOrganization from "../onboarding/CreateOrganization";

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

const AppDataProvider  = ({children}) => {
    const { data: organization, fetching: loadingOrganization, error: errorOrganization } = useFetch(server_route_names.organization);

    console.log("loadingOrganization", loadingOrganization);
    console.log("organization", organization);

    return (
        <AppDataContext.Provider value={{
            organization,
            loadingOrganization,
            errorOrganization,
        }}>
            {
                (!loadingOrganization && (!organization || !organization?.name)) && (
                    <CreateOrganization organization={organization}/>
                )
            }
            {children}
        </AppDataContext.Provider>
    )
}

export default AppDataProvider;