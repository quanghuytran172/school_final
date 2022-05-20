import axiosClient from "./axiosClient";

const authApi = {
    login: (params) => axiosClient.post("account/login", params),
    checkToken: () => axiosClient.post("account/check-token"),
};

export default authApi;
