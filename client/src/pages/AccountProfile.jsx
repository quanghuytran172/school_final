import { useEffect, useState } from "react";
import vaccineApi from "../api/vaccineApi";
import {
    PageHeader,
    CustomDialog,
    VaccineLots,
    CustomDialogConfirm,
} from "../components";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
    Card,
    CardContent,
    Grid,
    FormControl,
    TextField,
    CardActions,
    Typography,
    Box,
    Button,
    InputAdornment,
    IconButton,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import accountApi from "../api/accountApi";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const AccountProfile = () => {
    const [username, setUsername] = useState("");
    const [usernameErr, setUsernameErr] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState(false);
    const [fullname, setFullname] = useState("");
    const [fullnameErr, setFullnameErr] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberErr, setPhoneNumberErr] = useState(false);
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState(false);

    const [onSubmit, setOnSubmit] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [dialogOpenConfirm, setDialogOpenConfirm] = useState(false);

    useEffect(() => {
        const getAccountDetail = async () => {
            try {
                const account = await accountApi.getInfoAccount();
                setUsername(account.username);
                setPassword(account.password);
                setFullname(account.fullname);
                setEmail(account.email);
                setPhoneNumber(account.phoneNumber);
            } catch (err) {
                console.log(err);
            }
        };

        getAccountDetail();
    }, []);

    const updateAccount = async () => {
        if (onSubmit) return;
        const err = [!username, !fullname, !password, !phoneNumber, !email];
        setUsernameErr(!username);
        setPasswordErr(!password);
        setFullnameErr(!fullname);
        setPhoneNumberErr(!phoneNumber);
        setEmailErr(!email);
        if (!err.every((e) => !e)) return;
        setOnSubmit(true);
        try {
            const res = await accountApi.updateInfoAccount({
                username,
                password,
                fullname,
                email,
                phoneNumber,
                password,
            });
            console.log(res);
            setDialogText("Cập nhật thông tin tài khoản thành công");
            setDialogType("success");
        } catch (err) {
            console.log(err);
            setDialogText("Cập nhật thông tin tài khoản thất bại");
            setDialogType("error");
        } finally {
            setOnSubmit(false);
            setDialogOpen(true);
        }
    };

    return (
        <>
            <PageHeader title='Cập nhật thông tin cá nhân' />
            <CustomDialogConfirm
                open={dialogOpenConfirm}
                title={"Xác nhận xóa tài khoản"}
                content={"Bạn có chắc chắn muốn xóa không ?"}
                handleClose={() => {
                    setDialogOpenConfirm(false);
                }}
                handleOk={() => {
                    deleteAccount();
                    setDialogOpenConfirm(false);
                }}
                delete={true}
            />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card elevation={0}>
                        <CardContent>
                            <Grid container spacing={4} component='form'>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Tên tài khoản'
                                            variant='outlined'
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            error={usernameErr}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl variant='outlined' fullWidth>
                                        <InputLabel htmlFor='outlined-adornment-password'>
                                            Password
                                        </InputLabel>
                                        <OutlinedInput
                                            id='outlined-adornment-password'
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            error={passwordErr}
                                            endAdornment={
                                                <InputAdornment position='end'>
                                                    <IconButton
                                                        aria-label='toggle password visibility'
                                                        onClick={() => {
                                                            setShowPassword(
                                                                !showPassword
                                                            );
                                                        }}
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                        }}
                                                        edge='end'
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label='Password'
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Họ và tên'
                                            variant='outlined'
                                            value={fullname}
                                            onChange={(e) =>
                                                setFullname(e.target.value)
                                            }
                                            error={fullnameErr}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Số điện thoại'
                                            variant='outlined'
                                            value={phoneNumber}
                                            type={"number"}
                                            onChange={(e) =>
                                                setPhoneNumber(e.target.value)
                                            }
                                            error={phoneNumberErr}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Email'
                                            variant='outlined'
                                            value={email}
                                            type='email'
                                            autoComplete={"email"}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            error={emailErr}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                        <CardActions>
                            <LoadingButton
                                variant='contained'
                                loading={onSubmit}
                                disableElevation
                                onClick={updateAccount}
                            >
                                Cập nhật
                            </LoadingButton>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <CustomDialog
                open={dialogOpen}
                type={dialogType}
                showIcon
                content={
                    <Typography variant='subtitle1' textAlign='center'>
                        {dialogText}
                    </Typography>
                }
                actions={
                    <Box
                        width='100%'
                        sx={{ display: "flex", justifyContent: "center" }}
                    >
                        <Button
                            variant='contained'
                            onClick={() => setDialogOpen(false)}
                        >
                            OK
                        </Button>
                    </Box>
                }
            />
        </>
    );
};

export default AccountProfile;
