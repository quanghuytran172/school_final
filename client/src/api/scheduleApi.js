import axiosClient from "./axiosClient";

const scheduleEndpoint = "schedule";

const scheduleApi = {
    getScheduleAvailable: () => axiosClient.get(scheduleEndpoint),
    getAllSystem: () => axiosClient.get(`${scheduleEndpoint}/system`),
    directBooking: (params) =>
        axiosClient.post(`${scheduleEndpoint}/direct-booking`, params),
    getOne: (id) => axiosClient.get(`${scheduleEndpoint}/${id}`),
    getInfoVaccinated: (userId, userBookingId) =>
        axiosClient.get(
            `${scheduleEndpoint}/certificate/${userBookingId}/${userId}`
        ),
    create: (params) => axiosClient.post(scheduleEndpoint, params),
    delete: (id) => axiosClient.delete(`${scheduleEndpoint}/${id}`),
    update: (id, params) =>
        axiosClient.put(`${scheduleEndpoint}/${id}`, params),
};

export default scheduleApi;
