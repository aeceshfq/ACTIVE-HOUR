import { Route, Routes } from "react-router-dom";
import Page from "../components/Page";
import { navigation } from "./navigations";
import { usePrivileges } from "../providers/AuthProvider";
import Home from "../pages/Home";

const AppRouter = () => {
    const { hasPermission } = usePrivileges();
    const routes = () => {
        let routes = [];
        for (let index = 0; index < navigation.length; index++) {
            const item = navigation[index];
            const has_permission = hasPermission(item.permissions);
            if (!has_permission) {
                continue;
            }
            if (item && item.path) {
                if (item.path && item.element) {
                    routes.push (<Route path={item.path} element={item.element} key={`router-item-${index}`}/> )
                }
                if (item.submenu) {
                    for (let subMenuIndex = 0; subMenuIndex < item.submenu.length; subMenuIndex++) {
                        const subMenuItem = item.submenu[subMenuIndex];
                        const has_sub_permission = hasPermission(subMenuItem.permissions);
                        if (!has_sub_permission) {
                            continue;
                        }
                        if (item.path && item.element) {
                            routes.push (<Route path={subMenuItem.path} element={subMenuItem.element} key={`router-sub-item-${subMenuIndex}`}/> )
                        }
                    }
                }
            }
        }
        return routes;
    }
    return (
        <Routes>
            <Route index element={<Home/>}></Route>
            {routes()}
            <Route path="*" element={<ErrorPage />}/>
        </Routes>
    )
}
export default AppRouter;

export const ErrorPage = () => {
    return (
        <Page title="404 Page not found">
            <p>This page was may be renamed or removed</p>
        </Page>
    )
}