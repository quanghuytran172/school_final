import axiosClient from "./axiosClient";

const scheduleEndpoint = "schedule";

const scheduleApi = {
    getScheduleAvailable: () => axiosClient.get(scheduleEndpoint),
    getInfoVaccinated: (userId, userBookingId) =>
        axiosClient.get(
            `${scheduleEndpoint}/certificate/${userBookingId}/${userId}`
        ),
    getAllSystem: () => axiosClient.get(`${scheduleEndpoint}/system`),
    getOne: (id) => axiosClient.get(`${scheduleEndpoint}/system/${id}`),
    create: (params) => axiosClient.post(`${scheduleEndpoint}/system`, params),
    delete: (id) => axiosClient.delete(`${scheduleEndpoint}/system/${id}`),
    update: (id, params) =>
        axiosClient.put(`${scheduleEndpoint}/system/${id}`, params),
    directBooking: (params) =>
        axiosClient.post(`${scheduleEndpoint}/direct-booking`, params),
};

export default scheduleApi;
