import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { CustomDialog, PageHeader } from "../components";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import userApi from "../api/userApi";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const UserCreate = () => {
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

    const [phone, setPhone] = useState("");
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
            navigate(`/system/user/${res.user.id}`);
        } catch (err) {
            setOnSubmit(false);
            setDialogText(err.response.data);
            setDialogType("error");
            setDialogOpen(true);
            console.log(err.response);
        }
    };

    return (
        <>
            <Box width='100%'>
                <PageHeader
                    title='Thêm người dân'
                    rightContent={
                        <Stack direction='row' spacing={2}>
                            <Button
                                variant='text'
                                onClick={() => navigate("/system/user")}
                            >
                                Hủy
                            </Button>
                            <LoadingButton
                                variant='contained'
                                onClick={createUser}
                                loading={onSubmit}
                            >
                                Thêm
                            </LoadingButton>
                        </Stack>
                    }
                />
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

export default UserCreate;
