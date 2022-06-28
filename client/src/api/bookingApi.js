import axiosClient from "./axiosClient";

const bookingEndpoint = "booking";

const bookingApi = {
    getAll: () => axiosClient.get(bookingEndpoint),
    getOneBooking: (id) => axiosClient.get(`${bookingEndpoint}/${id}`),
    booking: (params) => axiosClient.post(bookingEndpoint, params),
    cancel: (id) => axiosClient.delete(`${bookingEndpoint}/${id}`),
    update: (id, params) => axiosClient.put(`${bookingEndpoint}/${id}`, params),
};

export default bookingApi;
