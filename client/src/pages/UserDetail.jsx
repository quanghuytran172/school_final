import {
    Card,
    CardContent,
    FormControl,
    Grid,
    Stack,
    TextField,
    Box,
    CardActions,
    Typography,
    Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userApi from "../api/userApi";
import {
    PageHeader,
    CustomDialog,
    UserVaccine,
    CustomDialogConfirm,
} from "../components";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const [onDelete, setOnDelete] = useState(false);

    const [dialogOpenConfirm, setDialogOpenConfirm] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await userApi.getOne(id);
                setUser(res);
            } catch (err) {
                console.log(err);
            }
        };
        getUser();
    }, []);

    const onUpdateSuccess = () => {
        setDialogType("success");
        setDialogText("Cập nhật thông tin người dân thành công");
        setDialogOpen(true);
    };

    const onUpdateFalse = (message) => {
        setDialogType("error");
        setDialogText(message || "Cập nhật thất bại");
        setDialogOpen(true);
    };
    const deleteUser = async () => {
        if (onDelete) return;
        setOnDelete(true);
        try {
            await userApi.delete(id);
            setOnDelete(false);
            navigate("/system/user");
        } catch (err) {
            console.log(err);
            setOnDelete(false);
            setDialogText("Xóa thất bại");
            setDialogType("error");
            setDialogOpen(true);
        }
    };

    return (
        <>
            <PageHeader
                title='Thông tin chi tiết người dân'
                rightContent={
                    <LoadingButton
                        variant='text'
                        disableElevation
                        color='error'
                        loading={onDelete}
                        onClick={() => setDialogOpenConfirm(true)}
                    >
                        XÓA NGƯỜI DÂN
                    </LoadingButton>
                }
            />
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Stack spacing={4}>
                        {user && (
                            <UserInfo
                                user={user}
                                onUpdateFalse={onUpdateFalse}
                                onUpdateSuccess={onUpdateSuccess}
                            />
                        )}
                        {user && <UserVaccine user={user} />}
                    </Stack>
                </Grid>
            </Grid>
            <CustomDialogConfirm
                open={dialogOpenConfirm}
                title={"Xác nhận xóa"}
                content={"Bạn có muốn xóa người dân này không ?"}
                handleClose={() => {
                    setDialogOpenConfirm(false);
                }}
                handleOk={() => {
                    deleteUser();
                    setDialogOpenConfirm(false);
                }}
                delete={true}
            />
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

export default UserDetail;

const UserInfo = ({ user, onUpdateFalse, onUpdateSuccess }) => {
    const [onUpdate, setOnUpdate] = useState(false);

    const [insuranceNumber, setInsuranceNumber] = useState(
        user.insuranceNumber
    );
    const [insuranceNumberErr, setInsuranceNumberErr] = useState(false);

    const [name, setName] = useState(user.fullname);
    const [nameErr, setNameErr] = useState(false);

    const [gender, setGender] = useState(user.gender);
    const [genderErr, setGenderErr] = useState(false);

    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
    const [dateOfBirthErr, setDateOfBirthErr] = useState(false);

    const [phone, setPhone] = useState(user.phoneNumber);
    const [phoneErr, setPhoneErr] = useState(false);

    const [identify, setIdentify] = useState(user.identify);
    const [identifyErr, setIdentifyErr] = useState(false);

    const [email, setEmail] = useState(user.email);
    const [emailErr, setEmailErr] = useState(false);

    const [address, setAddress] = useState(user.address);
    const [addressErr, setAddressErr] = useState(false);

    const [job, setJob] = useState(user.job);
    const [jobErr, setJobErr] = useState(false);

    const updateUser = async () => {
        if (onUpdate) return;

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

        setOnUpdate(true);

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
            const res = await userApi.update(user.id, params);
            console.log(res);
            setOnUpdate(false);
            onUpdateSuccess();
        } catch (err) {
            setOnUpdate(false);
            console.log(err.response);
            onUpdateFalse(err.response.data);
        }
    };

    return (
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
                                    setInsuranceNumber(e.target.value)
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
                                onChange={(e) => setName(e.target.value)}
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
                                onChange={(e) => setGender(e.target.value)}
                                error={genderErr}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth margin='normal'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label='Ngày sinh'
                                    value={dateOfBirth}
                                    onChange={(newValue) => {
                                        setDateOfBirth(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
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
                                onChange={(e) => setPhone(e.target.value)}
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
                                onChange={(e) => setJob(e.target.value)}
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
                                onChange={(e) => setIdentify(e.target.value)}
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
                                onChange={(e) => setEmail(e.target.value)}
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
                                onChange={(e) => setAddress(e.target.value)}
                                error={addressErr}
                            />
                        </FormControl>
                    </Grid>

                    {/* <Grid item xs={6}>
                        <FormControl fullWidth margin='normal'>
                            <Autocomplete
                                options={addressList.data}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => (
                                    <Box {...props} component='li'>
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Address'
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password",
                                        }}
                                        error={addressErr}
                                    />
                                )}
                                value={address}
                                onChange={(event, newValue) =>
                                    setAddress(newValue)
                                }
                            />
                        </FormControl>
                    </Grid> */}
                </Grid>
            </CardContent>
            <CardActions>
                <LoadingButton
                    variant='contained'
                    disableElevation
                    onClick={updateUser}
                    loading={onUpdate}
                >
                    Cập nhật
                </LoadingButton>
            </CardActions>
        </Card>
    );
};
