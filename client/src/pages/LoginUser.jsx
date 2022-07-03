import { useEffect, useState } from "react";
import { isAuthenticatedUser } from "../handlers/authHandler";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/images/loginUserBg.png";
import {
    Box,
    Button,
    Card,
    CardContent,
    colors,
    FormControl,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import authApi from "../api/authApi";
import { CustomDialog, PageHeader } from "../components";
import userApi from "../api/userApi";

const UserCreate = ({ number }) => {
    const navigate = useNavigate();
    const [onSubmit, setOnSubmit] = useState(false);

    const [insuranceNumber, setInsuranceNumber] = useState("");
    const [insuranceNumberErr, setInsuranceNumberErr] = useState(false);

    const [name, setName] = useState("");
    const [nameErr, setNameErr] = useState(false);

    const [gender, setGender] = useState("");
    const [genderErr, setGenderErr] = useState(false);

    const [dateOfBirth, setDateOfBirth] = useState("01/01/1990");
    const [dateOfBirthErr, setDateOfBirthErr] = useState(true);

    const [phone, setPhone] = useState(number);
    const [phoneErr, setPhoneErr] = useState(false);

    const [identify, setIdentify] = useState("");
    const [identifyErr, setIdentifyErr] = useState(false);

    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState(false);

    const [address, setAddress] = useState("");
    const [addressErr, setAddressErr] = useState(false);

    const [job, setJob] = useState("");
    const [jobErr, setJobErr] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");

    const createUser = async () => {
        if (onSubmit) return;

        const err = [
            !phone,
            !name,
            !address,
            !insuranceNumber,
            !gender,
            !dateOfBirth,
            !identify,
            !job,
            !email,
        ];

        setInsuranceNumberErr(!insuranceNumber);
        setPhoneErr(!phone);
        setNameErr(!name);
        setAddressErr(!address);
        setEmailErr(!email);
        setDateOfBirthErr(!dateOfBirth);
        setGenderErr(!gender);
        setIdentifyErr(!identify);
        setJobErr(!job);
        if (!err.every((e) => !e)) return;

        setOnSubmit(true);

        const params = {
            insuranceNumber: insuranceNumber,
            fullname: name,
            dateOfBirth: dateOfBirth,
            phoneNumber: phone,
            address: address,
            gender: gender,
            identify: identify,
            email: email,
            job: job,
        };

        try {
            const res = await userApi.create(params);
            setOnSubmit(false);
            navigate("/");
        } catch (err) {
            setOnSubmit(false);
            setDialogText(err.response.data);
            setDialogType("error");
            setDialogOpen(true);
        }
    };

    return (
        <>
            <Box width='100%'>
                <PageHeader title='Điền thông tin cá nhân' />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card elevation={0}>
                            <CardContent>
                                <Grid container spacing={4}>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin='normal'>
                                            <TextField
                                                label='Số thẻ bảo hiểm'
                                                variant='outlined'
                                                value={insuranceNumber}
                                                onChange={(e) =>
                                                    setInsuranceNumber(
                                                        e.target.value
                                                    )
                                                }
                                                error={insuranceNumberErr}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin='normal'>
                                            <TextField
                                                label='Họ và tên'
                                                variant='outlined'
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                error={nameErr}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin='normal'>
                                            <TextField
                                                label='Giới tính'
                                                variant='outlined'
                                                value={gender}
                                                onChange={(e) =>
                                                    setGender(e.target.value)
                                                }
                                                error={genderErr}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin='normal'>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}
                                            >
                                                <DatePicker
                                                    label='Ngày sinh'
                                                    value={dateOfBirth}
                                                    onChange={(newValue) => {
                                                        setDateOfBirth(
                                                            newValue
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                        />
                                                    )}
                                                    error={dateOfBirthErr}
                                                />
                                            </LocalizationProvider>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin='normal'>
                                            <TextField
                                                label='Số điện thoại'
                                                variant='outlined'
                                                type='number'
                                                value={phone}
                                                disabled={true}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                                error={phoneErr}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth margin='normal'>
                                            <TextField
                                                label='Nghề nghiệp'
                                                variant='outlined'
                                                value={job}
                                                onChange={(e) =>
                                                    setJob(e.target.value)
                                                }
                                                error={jobErr}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth margin='normal'>
                                            <TextField
                                                label='CCCD/CMND'
                                                variant='outlined'
                                                type='number'
                                                value={identify}
                                                onChange={(e) =>
                                                    setIdentify(e.target.value)
                                                }
                                                error={identifyErr}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <FormControl fullWidth margin='normal'>
                                            <TextField
                                                label='Email'
                                                variant='outlined'
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                error={emailErr}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth margin='normal'>
                                            <TextField
                                                label='Địa chỉ'
                                                variant='outlined'
                                                value={address}
                                                multiline
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                                error={addressErr}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Stack
                                    direction='row'
                                    spacing={2}
                                    marginTop='2rem'
                                    justifyContent='flex-end'
                                >
                                    <Button
                                        variant='text'
                                        onClick={() => navigate("/user")}
                                    >
                                        Hủy
                                    </Button>
                                    <LoadingButton
                                        variant='contained'
                                        onClick={createUser}
                                        loading={onSubmit}
                                    >
                                        Xác nhận
                                    </LoadingButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
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

const LoginUser = () => {
    const navigate = useNavigate();
    const [logErr, setLogErr] = useState(undefined);
    const [otpNumber, setOtpNumber] = useState("");
    const [otpNumberErr, setOtpNumberErr] = useState(false);

    const [number, setNumber] = useState("84");
    const [numberErr, setNumberErr] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);
    const [isCreateOtp, setIsCreateOtp] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const res = await isAuthenticatedUser();
            if (res) return navigate("/");
        };
        checkToken();
    }, []);

    const sendOTP = async () => {
        if (onSubmit) return;

        setNumberErr(!number);

        if (!number) return;

        if (!isVietnamesePhoneNumberValid(number)) {
            setLogErr("Số điện thoại không đúng định dạng");
            setOnSubmit(false);
            return;
        }
        const params = {
            phoneNumber: number,
        };
        try {
            await authApi.sendOtpUser(params);
            // localStorage.setItem("token", res.token);
            setOnSubmit(false);
            setIsCreateOtp(true);
            setLogErr("");
        } catch (err) {
            setLogErr("Số điện thoại không đúng định dạng");
            setOnSubmit(false);
        }
    };

    const verifyOtp = async () => {
        if (onSubmit) return;

        setOtpNumberErr(!otpNumber);

        if (!otpNumber) return;

        const params = {
            phoneNumber: number,
            token: otpNumber,
        };
        try {
            const res = await authApi.loginUser(params);
            setOnSubmit(false);
            if (res.isNewUser) {
                setIsNewUser(true);
                return;
            }
            localStorage.setItem("token", res.token);
            navigate("/");
        } catch (err) {
            setLogErr("Mã xác thực không đúng");
            setOnSubmit(false);
        }
    };

    function isVietnamesePhoneNumberValid(number) {
        return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
    }
    return (
        <>
            {isNewUser ? (
                <Box
                    component='main'
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        backgroundColor: colors.grey["100"],
                        width: "100%",
                        height: "100vh",
                    }}
                >
                    <UserCreate number={number} />
                </Box>
            ) : (
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
                        {!isCreateOtp ? (
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
                                    marginTop: "15rem",
                                }}
                            >
                                <Typography
                                    variant='h5'
                                    textAlign='center'
                                    mb='4rem'
                                    fontWeight='700'
                                >
                                    Đăng nhập dành cho người dân
                                </Typography>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Số điện thoại'
                                        variant='outlined'
                                        type='number'
                                        value={number}
                                        onChange={(e) => {
                                            setNumber(e.target.value);
                                        }}
                                        error={numberErr}
                                    />
                                </FormControl>

                                {logErr && (
                                    <FormControl>
                                        <Typography color='error'>
                                            {logErr}
                                        </Typography>
                                    </FormControl>
                                )}

                                <LoadingButton
                                    variant='contained'
                                    fullWidth
                                    size='large'
                                    sx={{ marginTop: "2rem" }}
                                    onClick={sendOTP}
                                >
                                    Gửi mã OTP
                                </LoadingButton>
                            </Box>
                        ) : (
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
                                    marginTop: "15rem",
                                }}
                            >
                                <Typography
                                    variant='h5'
                                    textAlign='center'
                                    mb='2rem'
                                    fontWeight='700'
                                >
                                    Xác thực mã OTP
                                </Typography>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Mã OTP'
                                        variant='outlined'
                                        type='number'
                                        value={otpNumber}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 6) {
                                                setOtpNumber(e.target.value);
                                            }
                                        }}
                                        error={otpNumberErr}
                                    />
                                </FormControl>

                                {logErr && (
                                    <FormControl>
                                        <Typography color='error'>
                                            {logErr}
                                        </Typography>
                                    </FormControl>
                                )}

                                <LoadingButton
                                    variant='contained'
                                    fullWidth
                                    size='large'
                                    sx={{ marginTop: "2rem" }}
                                    onClick={verifyOtp}
                                >
                                    Xác thực
                                </LoadingButton>
                            </Box>
                        )}
                    </Card>
                </Box>
            )}
        </>
    );
};

export default LoginUser;
