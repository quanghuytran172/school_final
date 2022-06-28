import authApi from "../api/authApi";

export const isAuthenticated = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
        const res = await authApi.checkTokenSystem();
        return res;
    } catch (err) {
        return false;
    }
};

export const isAuthenticatedUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
        const res = await authApi.checkTokenUser();
        return res;
    } catch (err) {
        return false;
    }
};

export const logout = (navigate) => {
    localStorage.removeItem("token");
    navigate("/login");
};
