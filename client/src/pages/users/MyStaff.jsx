import { useEffect } from "react";
import server_route_names from "../../routes/server_route_names";
import { useFetch } from "../../providers/AppProvider";
import { Chip, Paper, Stack, TableContainer, Typography } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import route_names from "../../routes/route_names";
import { useAuth } from "../../providers/AuthProvider";
import TableLoadingData from "../../components/TableLoadingData";
import LegacyPage from "../../subcomponents/LegacyPage";
import Layout from "../../components/Layout";


export default function MyStaff(){
    const { data: staffData, error: staffError, fetching: staffLoading } = useFetch(`${server_route_names.users}?limit=250`);

    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        document.title = "My staff";
    }, []);

    if (staffLoading) {
        return (
            <LegacyPage
                title="My staff"
            >
                <TableLoadingData />
            </LegacyPage>
        )
    }
    

    if (staffError || !staffData) {
        return (
            <LegacyPage
                title="My staff"
            >
                {staffError}
            </LegacyPage>
        )
    }

    return (
        <LegacyPage
            title="My staff"
            actions={[
                {
                    title: "Add staff",
                    onClick: () => {
                        navigate(route_names["management.staff.add"]);
                    }
                }
            ]}
        >
            <Layout>
                <Layout.Section>
                    <TableContainer component={Paper}>
                        <DataGrid
                            columns={columns}
                            rows={DataGridRow(staffData, user)}
                            pageSizeOptions={[25, 50, 100]}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 25
                                    }
                                }
                            }}
                            onRowDoubleClick={(event) => {
                                return navigate(String(route_names["management.staff.edit"]).replace(":id", event.row._id));
                            }}
                            disableRowSelectionOnClick
                            disableColumnFilter
                            disableColumnMenu
                            disableColumnSelector
                        >
                        </DataGrid>
                    </TableContainer>
                </Layout.Section>
                <Layout.Section>
                    <Typography variant="caption">
                        To modify staff permissions or adjust their account status, simply double-click on the cell/row containing their full name.
                    </Typography>
                </Layout.Section>
            </Layout>
        </LegacyPage>
    )
}

const columns = [
    {   field: 'fullName', 
        headerName: 'Name',
        width: 240,
        hideable: false,
        renderCell: params => {
            return <Stack direction="column" spacing={0}>
                <Typography variant="subtitle2" sx={{textTransform: "uppercase"}}>{params.value}</Typography>
                <Typography variant="caption" sx={{textTransform: "capitalize"}}>{String(params.row?.designation).replace(/\_/g, " ").toLowerCase()}</Typography>
            </Stack>
        }
    },
    {   field: 'email', 
        headerName: 'Email address',
        width: 200,
        hideable: false
    },
    {   field: 'phone', 
        headerName: 'Phone Number',
        width: 160,
        hideable: false
    },
    {   field: 'status', 
        headerName: 'Status',
        width: 120,
        filterable: false,
        sortable: false,
        renderCell: params => {
            return <Chip variant="outlined" size="small" color={params.value === "ACTIVE"?"success":params.value === "BLOCKED"?"error":"default"} label={params.value}></Chip>
        }
    },
    {   field: 'lastLogin', 
        headerName: 'Last login',
        filterable: false,
        sortable: false,
        width: 120,
        valueGetter: (params) =>  params.value?moment(params.row.lastLogin).fromNow():null
    },
    {   field: 'hireDate', 
        headerName: 'Hire date',
        filterable: false,
        sortable: false,
        width: 120,
        valueGetter: (params) =>  params.row.hireDate?moment(params.row.hireDate).format("MM/DD/YYYY"):null
    },
    {   field: 'createdAt', 
        headerName: 'Created',
        filterable: false,
        sortable: false,
        width: 180,
        valueGetter: (params) =>  `${ moment(params.value).calendar() }`
    },
];

const DataGridRow = (data, user) => {
    let finalData = [];

    if (data?.items?.length > 0) {
        finalData = data?.items.filter(x => x._id !== user?._id);
        return data?.items;
    }
    else{
        return [];
    }
}