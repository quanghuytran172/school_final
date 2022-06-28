import { useEffect, useState } from "react";
import { isAuthenticated, isAuthenticatedUser } from "../handlers/authHandler";
import { Outlet, useNavigate } from "react-router-dom";
import { Loading, TopNav, SideBar } from "../components";
import { Box, colors, Toolbar } from "@mui/material";

const AppLayout = ({ type }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [role, setRole] = useState("");
    useEffect(() => {
        const checkTokenSystem = async () => {
            const res = await isAuthenticated();
            if (!res) return navigate("/login");
            setRole(res);
            setIsLoading(false);
        };

        const checkTokenUser = async () => {
            const res = await isAuthenticatedUser();
            if (!res) return navigate("/login");
            setRole(res);
            setIsLoading(false);
        };
        if (type === "system") {
            checkTokenSystem();
            return;
        }

        if (type === "user") {
            checkTokenUser();
            return;
        }
        navigate("/login");
    }, []);

    return isLoading ? (
        <Box sx={{ width: "100%", height: "100vh" }}>
            <Loading />
        </Box>
    ) : (
        <Box>
            <TopNav role={role} />
            <Box sx={{ display: "flex" }}>
                <SideBar role={role} />
                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        backgroundColor: colors.grey["100"],
                        width: "max-content",
                    }}
                >
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AppLayout;
