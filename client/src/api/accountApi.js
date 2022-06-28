import axiosClient from "./axiosClient";
const accountEndpoint = "account";

const accountApi = {
    getSummary: () => axiosClient.get(`${accountEndpoint}/summary`),
    getAll: () => axiosClient.get(accountEndpoint),
    getRole: () => axiosClient.get(`${accountEndpoint}/role`),
    getInfoAccount: () => axiosClient.get(`${accountEndpoint}/profile`),
    updateInfoAccount: (params) =>
        axiosClient.post(`${accountEndpoint}/update-profile`, params),
    getOne: (id) => axiosClient.get(`${accountEndpoint}/${id}`),
    create: (params) => axiosClient.post(accountEndpoint, params),
    delete: (id) => axiosClient.delete(`${accountEndpoint}/${id}`),
    update: (id, params) => axiosClient.put(`${accountEndpoint}/${id}`, params),
};

export default accountApi;
