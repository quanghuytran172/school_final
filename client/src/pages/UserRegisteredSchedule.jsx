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
    CardHeader,
    Collapse,
} from "@mui/material";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import { PageHeader, CustomDialogConfirm } from "../components";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { styled } from "@mui/material/styles";
import bookingApi from "../api/bookingApi";
import moment from "moment";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand, index }) => ({
    transform: !expand[index] ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));
const UserRegisteredSchedule = () => {
    const [listBooking, setListBooking] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const [expanded, setExpanded] = useState({});
    const [dialogOpenConfirm, setDialogOpenConfirm] = useState({
        status: false,
        params: "",
    });
    const handleExpandClick = (id) => {
        setExpanded({
            ...expanded,
            [id]: !expanded[id],
        });
    };
    const convertStatus = (status) => {
        if (Number(status) === 0) {
            return "Đã đóng";
        } else if (Number(status) === 1) {
            return "Đang mở";
        } else {
            return "Hoàn thành";
        }
    };
    const handleCancelBooking = async (bookingId) => {
        try {
            await bookingApi.cancel(bookingId);
            getUser();
        } catch (err) {
            console.log(err);
        }
    };
    const getUser = async () => {
        try {
            const res = await bookingApi.getAll();
            setListBooking(res);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <PageHeader title='Lịch tiêm đã đăng ký' />
            {listBooking.map((booking, index) => (
                <Card style={{ marginBottom: 1 + "em" }} key={index}>
                    <CardHeader
                        title={booking.schedule.title}
                        subheader={`Thời gian: ${moment(
                            booking.schedule.time
                        ).format("DD/MM/YYYY")}`}
                        action={
                            booking.status === "1" ? (
                                <Button
                                    variant='outlined'
                                    onClick={() =>
                                        setDialogOpenConfirm({
                                            status: true,
                                            params: booking.id,
                                        })
                                    }
                                >
                                    Hủy đăng ký
                                </Button>
                            ) : booking.status === "2" ? (
                                <Button variant='contained' color='primary'>
                                    Đã xác nhận
                                </Button>
                            ) : booking.status === "3" ? (
                                <Button variant='contained' color='success'>
                                    Đã tiêm
                                </Button>
                            ) : (
                                <Button variant='outlined' color='error'>
                                    Vắng mặt
                                </Button>
                            )
                        }
                    />
                    <CardContent>
                        <Typography variant='body1' gutterBottom>
                            Trạng thái: {convertStatus(booking.schedule.status)}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <ExpandMore
                            expand={expanded}
                            onClick={() => handleExpandClick(index)}
                            aria-expanded={expanded}
                            aria-label='show more'
                            index={index}
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expanded[index]} timeout='auto' unmountOnExit>
                        <CardContent>
                            <Typography
                                variant='h5'
                                gutterBottom
                                component='div'
                                mb={3}
                            >
                                Thông tin đăng ký:
                            </Typography>

                            <Grid container spacing={2}>
                            
                                <Grid item xs={4}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Số thẻ bảo hiểm:</b>{" "}
                                        {booking.insuranceNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Họ và tên:</b> {booking.fullname}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Giới tính:</b> {booking.gender}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Ngày sinh:</b>{" "}
                                        {moment(booking.dateOfBirth).format(
                                            "DD/MM/YYYY"
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Số điện thoại:</b>{" "}
                                        {booking.phoneNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Nghề nghiệp:</b> {booking.job}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Địa chỉ:</b> {booking.address}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Email:</b> {booking.email}
                                    </Typography>
                                </Grid>

                                
                                <Grid item xs={12}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Loại đăng ký:</b> {booking.bookingType}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant='body1' gutterBottom>
                                        <b>Vắc xin đăng ký:</b>{" "}
                                        {booking.vaccine.name}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Collapse>
                </Card>
            ))}
            <CustomDialogConfirm
                open={dialogOpenConfirm.status}
                title={"Xác nhận hủy đăng ký"}
                content={"Bạn có chắc chắn hủy đăng ký hay không ?"}
                handleClose={() => {
                    setDialogOpenConfirm({ status: false, params: "" });
                }}
                handleOk={() => {
                    handleCancelBooking(dialogOpenConfirm.params);
                    setDialogOpenConfirm({ status: false, params: "" });
                }}
                delete={true}
            />
        </>
    );
};

export default UserRegisteredSchedule;

// const UserInfo = ({ user, onUpdateFalse, onUpdateSuccess }) => {
//     const [onUpdate, setOnUpdate] = useState(false);

//     const [insuranceNumber, setInsuranceNumber] = useState(
//         user.insuranceNumber
//     );
//     const [insuranceNumberErr, setInsuranceNumberErr] = useState(false);

//     const [name, setName] = useState(user.fullname);
//     const [nameErr, setNameErr] = useState(false);

//     const [gender, setGender] = useState(user.gender);
//     const [genderErr, setGenderErr] = useState(false);

//     const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
//     const [dateOfBirthErr, setDateOfBirthErr] = useState(false);

//     const [phone, setPhone] = useState(user.phoneNumber);
//     const [phoneErr, setPhoneErr] = useState(false);

//     const [identify, setIdentify] = useState(user.identify);
//     const [identifyErr, setIdentifyErr] = useState(false);

//     const [email, setEmail] = useState(user.email);
//     const [emailErr, setEmailErr] = useState(false);

//     const [address, setAddress] = useState(user.address);
//     const [addressErr, setAddressErr] = useState(false);

//     const [job, setJob] = useState(user.job);
//     const [jobErr, setJobErr] = useState(false);
//     function isVietnamesePhoneNumberValid(number) {
//         return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
//     }
//     const updateUser = async () => {
//         if (onUpdate) return;

//         const err = [
//             !phone,
//             !name,
//             !address,
//             !insuranceNumber,
//             !gender,
//             !dateOfBirth,
//             !identify,
//             !job,
//             !email,
//         ];

//         setInsuranceNumberErr(!insuranceNumber);
//         setPhoneErr(!phone);
//         setNameErr(!name);
//         setAddressErr(!address);
//         setEmailErr(!email);
//         setDateOfBirthErr(!dateOfBirth);
//         setGenderErr(!gender);
//         setIdentifyErr(!identify);
//         setJobErr(!job);
//         if (!err.every((e) => !e)) return;

//         if (!isVietnamesePhoneNumberValid(phone)) {
//             onUpdateFalse("Số điện thoại không đúng định dạng");
//             setOnUpdate(false);
//             return;
//         }

//         setOnUpdate(true);

//         const params = {
//             insuranceNumber: insuranceNumber,
//             fullname: name,
//             dateOfBirth: dateOfBirth,
//             phoneNumber: phone,
//             address: address,
//             gender: gender,
//             identify: identify,
//             email: email,
//             job: job,
//         };

//         try {
//             const res = await userApi.updateInfo(params);
//             console.log(res);
//             setOnUpdate(false);
//             onUpdateSuccess();
//         } catch (err) {
//             setOnUpdate(false);
//             console.log(err.response);
//             onUpdateFalse(err.response.data);
//         }
//     };

//     return (
//         <Card elevation={0}>
//             <CardContent>
//                 <Grid container spacing={4}>
//                     <Grid item xs={4}>
//                         <FormControl fullWidth margin='normal'>
//                             <TextField
//                                 label='Số thẻ bảo hiểm'
//                                 variant='outlined'
//                                 value={insuranceNumber}
//                                 onChange={(e) =>
//                                     setInsuranceNumber(e.target.value)
//                                 }
//                                 error={insuranceNumberErr}
//                             />
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={4}>
//                         <FormControl fullWidth margin='normal'>
//                             <TextField
//                                 label='Họ và tên'
//                                 variant='outlined'
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 error={nameErr}
//                             />
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={4}>
//                         <FormControl fullWidth margin='normal'>
//                             <TextField
//                                 label='Giới tính'
//                                 variant='outlined'
//                                 value={gender}
//                                 onChange={(e) => setGender(e.target.value)}
//                                 error={genderErr}
//                             />
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={4}>
//                         <FormControl fullWidth margin='normal'>
//                             <LocalizationProvider dateAdapter={AdapterDateFns}>
//                                 <DatePicker
//                                     label='Ngày sinh'
//                                     value={dateOfBirth}
//                                     onChange={(newValue) => {
//                                         setDateOfBirth(newValue);
//                                     }}
//                                     renderInput={(params) => (
//                                         <TextField {...params} />
//                                     )}
//                                     error={dateOfBirthErr}
//                                 />
//                             </LocalizationProvider>
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={4}>
//                         <FormControl fullWidth margin='normal'>
//                             <TextField
//                                 label='Số điện thoại'
//                                 variant='outlined'
//                                 type='number'
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                                 error={phoneErr}
//                             />
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={4}>
//                         <FormControl fullWidth margin='normal'>
//                             <TextField
//                                 label='Nghề nghiệp'
//                                 variant='outlined'
//                                 value={job}
//                                 onChange={(e) => setJob(e.target.value)}
//                                 error={jobErr}
//                             />
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={6}>
//                         <FormControl fullWidth margin='normal'>
//                             <TextField
//                                 label='CCCD/CMND'
//                                 variant='outlined'
//                                 type='number'
//                                 value={identify}
//                                 onChange={(e) => setIdentify(e.target.value)}
//                                 error={identifyErr}
//                             />
//                         </FormControl>
//                     </Grid>

//                     <Grid item xs={6}>
//                         <FormControl fullWidth margin='normal'>
//                             <TextField
//                                 label='Email'
//                                 variant='outlined'
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 error={emailErr}
//                             />
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={12}>
//                         <FormControl fullWidth margin='normal'>
//                             <TextField
//                                 label='Địa chỉ'
//                                 variant='outlined'
//                                 value={address}
//                                 onChange={(e) => setAddress(e.target.value)}
//                                 error={addressErr}
//                             />
//                         </FormControl>
//                     </Grid>
//                 </Grid>
//             </CardContent>
//             <CardActions>
//                 <LoadingButton
//                     variant='contained'
//                     disableElevation
//                     onClick={updateUser}
//                     loading={onUpdate}
//                 >
//                     Cập nhật
//                 </LoadingButton>
//             </CardActions>
//         </Card>
//     );
// };
