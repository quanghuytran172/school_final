import axiosClient from "./axiosClient";

const scheduleEndpoint = "schedule";

const scheduleApi = {
    getAll: () => axiosClient.get(scheduleEndpoint),
    getOne: (id) => axiosClient.get(`${scheduleEndpoint}/${id}`),
    getInfoVaccinated: (userId, userBookingId) => axiosClient.get(`${scheduleEndpoint}/certificate/${userBookingId}/${userId}`),
    create: (params) => axiosClient.post(scheduleEndpoint, params),
    delete: (id) => axiosClient.delete(`${scheduleEndpoint}/${id}`),
    update: (id, params) =>
        axiosClient.put(`${scheduleEndpoint}/${id}`, params),
};

export default scheduleApi;
