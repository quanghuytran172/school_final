import axiosClient from "./axiosClient";

const userEndpoint = "user";

const userApi = {
    getAll: () => axiosClient.get(userEndpoint),
    getInfo: () => axiosClient.get(`${userEndpoint}/profile`),
    updateInfo: (params) =>
        axiosClient.put(`${userEndpoint}/update-profile`, params),
    create: (params) => axiosClient.post(userEndpoint, params),
    getOne: (id) => axiosClient.get(`${userEndpoint}/${id}`),
    delete: (id) => axiosClient.delete(`${userEndpoint}/${id}`),
    update: (id, params) => axiosClient.put(`${userEndpoint}/${id}`, params),
    vaccinated: (params) =>
        axiosClient.post(`${userEndpoint}/vaccinated`, params),
    getMyVaccinated: () =>
        axiosClient.get(`${userEndpoint}/vaccination-records`),
};

export default userApi;
