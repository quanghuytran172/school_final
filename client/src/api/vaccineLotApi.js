import axiosClient from "./axiosClient";

const vaccineLotEndpoint = "vaccine/lots";

const vaccineLotApi = {
    create: (params) => axiosClient.post(vaccineLotEndpoint, params),
    update: (id, params) =>
        axiosClient.put(`${vaccineLotEndpoint}/${id}`, params),
    delete: (id) => axiosClient.delete(`${vaccineLotEndpoint}/${id}`),
};

export default vaccineLotApi;
