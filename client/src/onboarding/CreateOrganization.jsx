import { Alert, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import Layout from "../components/Layout";
import LegacyModal from "../subcomponents/LegacyModal";
import { useState } from "react";
import Toast from "../components/Toast";
import server_route_names from "../routes/server_route_names";
import { useRequest } from "../providers/AppProvider";
import _enum from "../namespace/enum";
import { useAuth } from "../providers/AuthProvider";

const CreateOrganization = ({ }) => {
    const { data: organization, loading: loadingOrganization, error: errorOrganization, sendRequest: organizationRequest } = useRequest();
    const { user } = useAuth();
    const [created, setCreated] = useState(false);
    const [ownerName, setOwnerName] = useState(user?.fullName??"");
    const [name, setName] = useState("");
    const [employeeRange, setEmployeeRange] = useState("0-10");
    const [legalName, setLegalName] = useState("");
    const [businessEmail, setBusinessEmail] = useState(user?.email??"");
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("Pakistan");
    const [city, setCity] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [zipCode, setZipCode] = useState("");

    const createOrganization = async (data) => {
        let response = await organizationRequest({
            url: server_route_names.organization,
            type: "post",
            data: {data}
        });
        if (response?.status === "success") {
            setCreated(true);
        }
    };

    const validate = () => {
        if (!name || loadingOrganization || !employeeRange || !addressLine1 || !city || !country) {
            return false;
        }
        if (String(name).trim().length < 1) {
            return false;
        }
        if (String(addressLine1).trim().length < 1) {
            return false;
        }
        if (String(city).trim().length < 1) {
            return false;
        }
        if (String(country).trim().length < 1) {
            return false;
        }
        return true;
    }

    if (user?.role !== "OWNER") {
        return null;
    }

    return (
        <>
            {
                created && (
                    <Toast
                        open={true}
                        type="success"
                        message="Created successfuly"
                    />
                )
            }
            {
                errorOrganization && (
                    <Toast
                        open={true}
                        type="error"
                        message={errorOrganization}
                    />
                )
            }
            <LegacyModal
                open={!created}
                title="Create organization"
                primaryAction={{
                    variant: "contained",
                    title: "Create",
                    disabled: validate() === false,
                    onClick: async () => {
                        await createOrganization({
                            name: name,
                            ownerName,
                            businessEmail,
                            employeeRange: employeeRange,
                            businessAddress: {
                                addressLine1, addressLine2, city, country, zipCode, phone
                            }
                        });
                    }
                }}
                hideCloseIcon
            >
                <Layout>
                    <Layout.Section>
                        <Stack direction="column" spacing={2}>
                            <TextField
                                required
                                label="Organization name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                                error={errorOrganization?true:false}
                            />
                            <FormControl size="small" required>
                                <InputLabel id="employee-range-selection">Employee range</InputLabel>
                                <Select
                                    labelId="employee-range-selection"
                                    id="employee-range-select"
                                    value={employeeRange}
                                    label="Employee range"
                                    onChange={(e) => {
                                        setEmployeeRange(e.target.value)
                                    }}
                                >
                                    {
                                        _enum.employeeRange.map(x => (
                                            <MenuItem key={x} value={x}>{String(x)}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <Divider></Divider>
                            <Typography variant="h5" color="text.secondary">Address</Typography>
                            <TextField
                                required
                                fullWidth
                                label="Address line 1"
                                value={addressLine1}
                                onChange={(e) => {
                                    setAddressLine1(e.target.value)
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Address line 2"
                                value={addressLine2}
                                onChange={(e) => {
                                    setAddressLine2(e.target.value)
                                }}
                            />
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    required    
                                    fullWidth
                                    label="City"
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value)
                                    }}
                                />
                                <FormControl size="small" fullWidth required>
                                    <InputLabel id="country-selection">Country</InputLabel>
                                    <Select
                                        labelId="country-selection"
                                        id="country-selection-select"
                                        value={country}
                                        label="Country"
                                        onChange={(e) => {
                                            setCountry(e.target.value)
                                        }}
                                    >
                                        {
                                            _enum.countries.map(x => (
                                                <MenuItem key={x} value={x}>{String(x)}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Zip code"
                                    type="number"
                                    value={zipCode}
                                    error={zipCode ?isNaN(zipCode)?true:String(zipCode).length != 5:false}
                                    onChange={(e) => {
                                        setZipCode(e.target.value)
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value)
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Layout.Section>
                </Layout>
            </LegacyModal>
        </>
    )
}

export default CreateOrganization;