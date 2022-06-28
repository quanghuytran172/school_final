import { useEffect, useState } from "react";
import { isAuthenticated } from "../handlers/authHandler";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/login-bg.png";
import { Box, Card, FormControl, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import authApi from "../api/authApi";

const LoginSystem = () => {
    const navigate = useNavigate();
    const [loginErr, setLoginErr] = useState();
    const [username, setUsername] = useState("");
    const [usernameErr, setUsernameErr] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);

    useEffect(() => {
        const checkTokenSystem = async () => {
            const res = await isAuthenticated();
            if (res) return navigate("/system");
        };
        checkTokenSystem();
    }, []);

    const loginSubmit = async () => {
        if (onSubmit) return;
        setLoginErr(undefined);

        const checkErr = {
            username: username.trim().length === 0,
            password: password.trim().length === 0,
        };
        setUsernameErr(checkErr.username);
        setPasswordErr(checkErr.password);
        if (checkErr.username || checkErr.password) return;

        const params = {
            username,
            password,
        };
        setOnSubmit(true);
        try {
            const res = await authApi.loginSystem(params);
            localStorage.setItem("token", res.token);
            setOnSubmit(false);
            navigate("/system");
        } catch (err) {
            if (err.response.status === 401) {
                setLoginErr(err.response.data);
            }
            setOnSubmit(false);
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "flex-start",
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "right",
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: "600px",
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        width: "100%",
                        maxWidth: "400px",
                        "& .MuiTextField-root": { mb: 5 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexDirection: "column",
                        margin: "auto",
                        padding: "5rem 1rem",
                    }}
                >
                    <Typography
                        variant='h5'
                        textAlign='center'
                        mb='4rem'
                        fontWeight='700'
                    >
                        Hệ thống Quản lý đăng ký tiêm chủng cho cơ sở y tế
                    </Typography>
                    <FormControl fullWidth>
                        <TextField
                            label='Tên tài khoản'
                            variant='outlined'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={usernameErr}
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            label='Mật khẩu'
                            type='password'
                            variant='outlined'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={passwordErr}
                        />
                    </FormControl>
                    {loginErr && (
                        <FormControl>
                            <Typography color='error'>{loginErr}</Typography>
                        </FormControl>
                    )}

                    <LoadingButton
                        variant='contained'
                        fullWidth
                        size='large'
                        sx={{ marginTop: "0rem" }}
                        onClick={loginSubmit}
                    >
                        Đăng nhập
                    </LoadingButton>
                    <LoadingButton
                        variant='outlined'
                        fullWidth
                        size='large'
                        sx={{ marginTop: "1rem" }}
                        onClick={() => {
                            navigate("/login-user");
                        }}
                    >
                        Đăng nhập dành cho người dân
                    </LoadingButton>
                </Box>
            </Card>
        </Box>
    );
};

export default LoginSystem;
