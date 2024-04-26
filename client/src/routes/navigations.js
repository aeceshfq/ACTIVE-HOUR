import HomeIcon from '@mui/icons-material/Home';
import route_names from "./route_names";
import MyAccount from "../pages/users/MyAccount";
import MyStaff from '../pages/users/MyStaff';
import AddMyStaff from '../pages/users/AddMyStaff';
import EditMyStaff from '../pages/users/EditMyStaff';
import privileges from '../privileges';
import Home from '../pages/Home';

export const navigation = [
    {
        path: route_names.index,
        element: <Home />,
        isMenu: false,
    },
    {
        title: 'Home',
        path: route_names.home,
        element: <Home />,
        icon: <HomeIcon />,
        isMenu: true,
        position: 1,
        permissions: true,
    },
    {
        title: 'My Account',
        path: route_names["myaccount"],
        element: <MyAccount />,
        isMenu: false,
        permissions: true
    },
    {
        title: 'My Team',
        path: route_names['management.staff'],
        element: <MyStaff />,
        isMenu: false,
        position: 102,
        permissions: privileges['staff.manage']
    },
    {
        title: 'Add Staff',
        path: route_names['management.staff.add'],
        element: <AddMyStaff />,
        isMenu: false,
        permissions: privileges['staff.manage']
    },
    {
        title: 'Edit Staff',
        path: route_names['management.staff.edit'],
        element: <EditMyStaff />,
        isMenu: false,
        permissions: privileges['staff.manage']
    },
];
