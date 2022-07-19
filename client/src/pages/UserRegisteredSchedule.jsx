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
            {listBooking.length === 0 && (
                <Typography
                    align='center'
                    marginBottom={5}
                    variant='subtitle1'
                    gutterBottom
                    component='div'
                >
                    Bạn không có lịch tiêm đã đăng ký nào!
                </Typography>
            )}
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
                                        <b>Hình thức đăng ký:</b>{" "}
                                        {booking.bookingType}
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
