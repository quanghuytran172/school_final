import axiosClient from "./axiosClient";

const diseaseEndpoint = "disease";

const diseaseApi = {
    getAll: () => axiosClient.get(diseaseEndpoint),
    create: (params) => axiosClient.post(diseaseEndpoint, params),
    delete: (id) => axiosClient.delete(`${diseaseEndpoint}/${id}`),
    update: (id, params) => axiosClient.put(`${diseaseEndpoint}/${id}`, params),
};

export default diseaseApi;
