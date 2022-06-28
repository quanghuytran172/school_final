import axiosClient from "./axiosClient";

const authApi = {
    loginSystem: (params) => axiosClient.post("account/login", params),
    checkTokenSystem: () => axiosClient.post("account/check-token"),
    checkTokenUser: () => axiosClient.post("user/check-token"),
    sendOtpUser: (params) => axiosClient.post("user/sendOtp", params),
    loginUser: (params) => axiosClient.post("user/login", params),
};

export default authApi;
