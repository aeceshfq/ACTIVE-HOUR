import { createContext, useContext, useEffect, useState } from "react";
import { locals as english } from "../locals/en";
import { httpRequest } from "../functions/httpRequest";

const AppContext = createContext();

export const useTranslate = () => useContext(AppContext);

const AppProvider = ({ children }) => {

    const t = (label) => {
        var text = label;
        if (label) {
            var labels = label.split(".");
            switch (labels.length) {
                case 1:
                    try {
                        text = english[labels[0]];
                    } catch (error) { }
                    break;
                case 2:
                    try {
                        text = english[labels[0]][labels[1]];
                    } catch (error) { }
                    break;
                case 3:
                    try {
                        text = english[labels[0]][labels[1]][labels[2]];
                    } catch (error) { }
                    break;
                case 4:
                    try {
                        text = english[labels[0]][labels[1]][labels[2]][labels[3]];
                    } catch (error) { }
                    break;
                case 5:
                    try {
                        text =
                            english[labels[0]][labels[1]][labels[2]][labels[3]][labels[4]];
                    } catch (error) { }
                    break;
                case 6:
                    try {
                        text =
                            english[labels[0]][labels[1]][labels[2]][labels[3]][labels[4]][
                            labels[5]
                            ];
                    } catch (error) { }
                    break;
                case 7:
                    try {
                        text =
                            english[labels[0]][labels[1]][labels[2]][labels[3]][labels[4]][
                            labels[5]
                            ][labels[6]];
                    } catch (error) { }
                    break;
                case 8:
                    try {
                        text =
                            english[labels[0]][labels[1]][labels[2]][labels[3]][labels[4]][
                            labels[5]
                            ][labels[6]][labels[7]];
                    } catch (error) { }
                    break;
                case 9:
                    try {
                        text =
                            english[labels[0]][labels[1]][labels[2]][labels[3]][labels[4]][
                            labels[5]
                            ][labels[6]][labels[7]][labels[8]];
                    } catch (error) { }
                    break;
                case 10:
                    try {
                        text =
                            english[labels[0]][labels[1]][labels[2]][labels[3]][labels[4]][
                            labels[5]
                            ][labels[6]][labels[7]][labels[8]][labels[9]];
                    } catch (error) { }
                    break;

                default:
                    break;
            }
        }
        if (typeof text !== "string") {
            text = label;
        }
        return text;
    };

    return <AppContext.Provider value={{ t }}>{children}</AppContext.Provider>;
};

export const useFetch = (url, options) => {
    const [fetching, setFetching] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        fetchData(signal);
        return () => {
            abortController.abort();
        };
    }, [url]);

    const fetchData = async (signal) => {
        setFetching(true);
        setData(null);
        setError(null);
        try {
            let fetch_options = {...options||{}, ...{ signal: signal }};
            if (String(options?.type).toLowerCase() === "post" && fetch_options.data) {
                fetch_options = {...fetch_options, ...fetch_options.data}
            }
            var response = await httpRequest[options?.type??"get"](url, fetch_options);
            console.log("response", response);
            if (response?.status === "success") {
                setData(response?.data);
            } else {
                setError(response?.message??response);
            }
        } catch (error) {
            console.error(error);
        }
        finally{
            setFetching(false);
        }
        return response?.data??response?.message??response;
    };

    return {
        data,
        error,
        fetching,
        reFetch: fetchData,
    };
};

export const useCreateRecord = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const createRecord = async (payload) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            var response = await httpRequest.post(url, payload);
            if (response?.status === "success") {
                setData(response?.data);
            } else {
                setError(response?.message??response);
            }
        } catch (error) {
            
        }
        finally {
            setLoading(false);
        }
        return response;
    };

    return { data, error, loading, createRecord };
};

export const useUpdateRecord = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const updateRecord = async (id, payload) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            var response = await httpRequest.put(`${url}?id=${id}`, payload);
            if (response?.status === "success") {
                setData(response);
            } else {
                setError(response?.message);
            }
        } catch (error) {
            
        }
        finally{
            setLoading(false);
        }
        return response;
    };
    return { data, error, loading, updateRecord };
};

export const useDeleteRecord = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const deleteRecord = async (id) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            var response = await httpRequest.del(`${url}?id=${id}`);
            if (response?.status === "success") {
                setData(response?.data);
            } else {
                setError(response?.message);
            }
        } catch (error) {
            
        }
        finally{
            setLoading(false);
        }
        return response;
    };

    return { data, error, loading, deleteRecord };
};

export const useRequest = () => {
    const [loading, setLoading] = useState(null);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const sendRequest = async (options) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            var response = await httpRequest[options?.type??"get"](options?.url, options?.data);
            if (response?.status === "success") {
                setData(response);
            } else {
                setError(response?.message);
            }
        } catch (error) {
            
        }
        finally{
            setLoading(false);
        }
        return response;
    };

    return { data, error, loading, sendRequest };
};

export default AppProvider;