import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import vaccineApi from "../api/vaccineApi";
import { CustomDialog, CustomDialogConfirm } from "../components";
import { LoadingButton } from "@mui/lab";
import userApi from "../api/userApi";
import scheduleApi from "../api/scheduleApi";
import bookingApi from "../api/bookingApi";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import BookingForm from "../components/BookingForm";

const ScheduleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pageSize, setPageSize] = useState(9);
    const [paramsToAddVaccine, setParamsToAddVaccine] = useState({});

    const [scheduleInfo, setScheduleInfo] = useState(null);
    const [userList, setUserList] = useState([]);
    const [vaccineList, setVaccineList] = useState([]);
    const [vaccineLots, setVaccineLots] = useState([]);
    const [selectedVaccine, setSelectedVaccine] = useState(null);
    const [selectedVaccineBooking, setSelectedVaccineBooking] = useState(null);

    const [selectedLot, setSelectedLot] = useState(null);
    const [showAddDialogVaccine, setShowAddDialogVaccine] = useState(false);
    const [showAddDialogBooking, setShowAddDialogBooking] = useState(false);

    const [onAddVaccinated, setOnAddVaccinated] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const [dialogOpenConfirm, setDialogOpenConfirm] = useState({
        status: false,
        params: "",
    });
    const [formBooking, setFormBooking] = useState({
        insuranceNumber: "",
        fullname: "",
        dateOfBirth: "01/01/1990",
        phoneNumber: "",
        address: "",
        gender: "",
        identify: "",
        email: "",
        job: "",
    });
    useEffect(() => {
        const getSchedule = async () => {
            try {
                const res = await scheduleApi.getOne(id);
                setScheduleInfo(res);
                setUserList(res.userList);
            } catch (err) {
                console.log(err);
            }
        };
        const getVaccines = async () => {
            try {
                const res = await vaccineApi.getAll();
                setVaccineList(res);
            } catch (err) {
                console.log(err);
            }
        };
        getVaccines();
        getSchedule();
    }, []);
    useEffect(() => {
        if (!selectedVaccine) {
            setVaccineLots([]);
            setSelectedLot(null);
            return;
        }
        setVaccineLots(selectedVaccine.vaccineLots);
    }, [selectedVaccine]);
    const tableHeader = [
        {
            field: "insuranceNumber",
            headerName: "Số thẻ bảo hiểm",
            width: 170,
            renderCell: (params) => (
                <Button
                    component={Link}
                    to={`/system/user/${
                        params.row.relativeUser
                            ? params.row.relativeUser
                            : params.row.user
                    }`}
                    sx={{ textTransform: "none" }}
                >
                    {params.value}
                </Button>
            ),
        },
        {
            field: "fullname",
            headerName: "Họ và tên",
            width: 170,
            renderCell: (params) => params.value,
        },
        {
            field: "phoneNumber",
            headerName: "Số điện thoại",
            width: 170,
            renderCell: (params) => params.value,
        },
        {
            field: "identify",
            headerName: "Căn cước công dân",
            width: 170,
            renderCell: (params) => params.value,
        },
        {
            field: "bookingType",
            headerName: "Loại đăng ký",
            width: 170,
            renderCell: (params) => params.value,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 170,
            renderCell: (params) => {
                if (params.value === "1") {
                    return "Chưa xác nhận";
                } else if (params.value === "2") {
                    return "Đã xác nhận";
                } else if (params.value === "3") {
                    return "Đã tiêm";
                } else {
                    return "Đã hủy";
                }
            },
        },
        {
            field: "vaccine",
            headerName: "Vaccine đăng ký",
            width: 170,
            renderCell: (params) => params.value.name,
        },
        {
            field: "_id",
            headerName: "Hành Động",
            minWidth: 700,

            renderCell: (params) => (
                <>
                    <LoadingButton
                        color='primary'
                        disableElevation
                        startIcon={<DoneOutlinedIcon />}
                        // loading={onDelete}
                        onClick={() => {
                            confirmCheckin(params.row.id, params.row.status);
                        }}
                    >
                        Xác nhận
                    </LoadingButton>

                    <Button
                        disableElevation
                        startIcon={<LocalPrintshopOutlinedIcon />}
                        color='info'
                        onClick={() => {
                            navigate(
                                `/system/schedule/screening-test/${params.row._id}`
                            );
                        }}
                    >
                        In giấy khám sàng lọc
                    </Button>
                    <Button
                        disableElevation
                        startIcon={<VaccinesOutlinedIcon />}
                        color='info'
                        onClick={() => {
                            setParamsToAddVaccine({
                                userId: params.row.relativeUser
                                    ? params.row.relativeUser
                                    : params.row.user,
                                userBookingId: params.id,
                            });
                            setShowAddDialogVaccine(true);
                        }}
                    >
                        Tiêm vaccine
                    </Button>
                    <Button
                        disableElevation
                        startIcon={<LocalPrintshopOutlinedIcon />}
                        color='info'
                        onClick={() => {
                            navigate(
                                `/system/schedule/certificate/${
                                    params.row._id
                                }/${
                                    params.row.relativeUser
                                        ? params.row.relativeUser
                                        : params.row.user
                                }`
                            );
                        }}
                    >
                        In giấy chứng nhận
                    </Button>
                </>
            ),
        },
    ];

    const closeAddDialogVaccine = () => {
        setSelectedVaccine(null);
        setShowAddDialogVaccine(false);
        setParamsToAddVaccine({});
    };
    const closeAddDialogBooking = () => {
        setFormBooking({
            insuranceNumber: "",
            fullname: "",
            dateOfBirth: "01/01/1990",
            phoneNumber: "",
            address: "",
            gender: "",
            identify: "",
            email: "",
            job: "",
        });
        setSelectedVaccineBooking(null);
        setShowAddDialogBooking(false);
    };

    const addVaccinated = async () => {
        if (onAddVaccinated) return;
        const err = [!selectedVaccine, !selectedLot];

        if (!err.every((e) => !e)) return;
        setOnAddVaccinated(true);

        const params = {
            userId: paramsToAddVaccine.userId,
            vaccineId: selectedVaccine.id,
            vaccineLotId: selectedLot.id,
            userBookingId: paramsToAddVaccine.userBookingId,
        };

        try {
            await userApi.vaccinated(params);
            await bookingApi.update(paramsToAddVaccine.userBookingId, {
                status: "3",
            });
            setUserList(
                userList.map((userBooking) => {
                    if (userBooking.id === paramsToAddVaccine.userBookingId) {
                        userBooking.status = "3";
                    }
                    return userBooking;
                })
            );
            setDialogText("Thêm thành công");
            setDialogType("success");
            setDialogOpen(true);
        } catch (err) {
            console.log(err);
            setDialogText("Thêm thất bại");
            setDialogType("error");
            setDialogOpen(true);
        } finally {
            closeAddDialogVaccine();

            setOnAddVaccinated(false);
        }
    };

    const handleBookingDirectly = async () => {
        try {
            if (
                !formBooking.insuranceNumber ||
                !formBooking.fullname ||
                !formBooking.dateOfBirth ||
                !formBooking.phoneNumber ||
                !formBooking.gender ||
                !formBooking.identify ||
                !formBooking.job ||
                !formBooking.email ||
                !formBooking.address ||
                !selectedVaccineBooking
            ) {
                setDialogText("Vui lòng điền đầy đủ thông tin");
                setDialogType("error");
                setDialogOpen(true);
                return;
            }

            const userBooking = await scheduleApi.directBooking({
                scheduleId: scheduleInfo.id,
                ...formBooking,
                vaccineId: selectedVaccineBooking._id,
            });
            setDialogText("Đăng ký thành công");
            setDialogType("success");
            setDialogOpen(true);
            setUserList([
                ...userList,
                { ...userBooking, vaccine: selectedVaccineBooking.name },
            ]);
            closeAddDialogBooking();
        } catch (error) {
            setDialogText(error.response.data || "Đăng ký thất bại");
            setDialogType("error");
            setDialogOpen(true);
        }
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

    const confirmCheckin = async (id, currentStatus) => {
        try {
            if (currentStatus === "2") {
                setDialogText("Trạng thái đã xác nhận");
                setDialogType("error");
                setDialogOpen(true);
                return;
            }
            await bookingApi.update(id, {
                status: "2",
            });
            setUserList(
                userList.map((userBooking) => {
                    if (userBooking.id === id) {
                        userBooking.status = "2";
                    }
                    return userBooking;
                })
            );
            setDialogText("Xác nhận thành công");
            setDialogType("success");
            setDialogOpen(true);
        } catch (error) {
            setDialogText(error.response.data);
            setDialogType("error");
            setDialogOpen(true);
        }
    };

    return (
        <>
            <Card elevation={0}>
                <Grid container spacing={4} padding={"32px 16px"}>
                    <Grid item xs={4}>
                        <b>Tiêu đề:</b> {scheduleInfo && scheduleInfo.title}
                    </Grid>
                    <Grid item xs={4}>
                        <b>Số lượng:</b>{" "}
                        {scheduleInfo && scheduleInfo.totalUsersBooking}/
                        {scheduleInfo && scheduleInfo.maxQuantity}
                    </Grid>
                    <Grid item xs={4}>
                        <b>Trạng thái:</b>{" "}
                        {scheduleInfo && convertStatus(scheduleInfo.status)}
                    </Grid>
                    <Grid item xs={4}>
                        <b>Người tạo:</b>{" "}
                        {scheduleInfo && scheduleInfo.account.fullname}
                    </Grid>
                    <Grid item xs={4}>
                        <b>Thời gian: </b>
                        {scheduleInfo &&
                            moment(scheduleInfo.time).format("DD-MM-YYYY")}
                    </Grid>
                </Grid>
                <CardHeader
                    title={
                        <Typography variant='h6' align='center'>
                            Danh sách người đăng ký
                        </Typography>
                    }
                    action={
                        <Button
                            variant='contained'
                            disableElevation
                            onClick={() => setShowAddDialogBooking(true)}
                        >
                            Đăng ký trực tiếp
                        </Button>
                    }
                />
                <CardContent>
                    <DataGrid
                        autoHeight
                        rows={userList}
                        columns={tableHeader}
                        pageSize={pageSize}
                        rowsPerPageOptions={[9, 50, 100]}
                        onPageSizeChange={(size) => setPageSize(size)}
                        density='comfortable'
                        showCellRightBorder
                        showColumnRightBorder
                    />
                </CardContent>
            </Card>
            <CustomDialog
                open={showAddDialogVaccine}
                title='Chọn Vaccine'
                content={
                    <Box sx={{ width: "400px" }}>
                        <FormControl fullWidth margin='normal'>
                            <Autocomplete
                                options={vaccineList}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => (
                                    <Box {...props} component='li'>
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Chọn vaccine'
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password",
                                        }}
                                    />
                                )}
                                value={selectedVaccine}
                                onChange={(event, value) =>
                                    setSelectedVaccine(value)
                                }
                            />
                        </FormControl>
                        <FormControl fullWidth margin='normal'>
                            <Autocomplete
                                options={vaccineLots}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => (
                                    <Box {...props} component='li'>
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Lô vaccine'
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: "new-password",
                                        }}
                                    />
                                )}
                                value={selectedLot}
                                onChange={(event, value) =>
                                    setSelectedLot(value)
                                }
                            />
                        </FormControl>
                    </Box>
                }
                actions={
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                        width='100%'
                    >
                        <Button
                            variant='text'
                            onClick={closeAddDialogVaccine}
                            disabled={onAddVaccinated}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            onClick={addVaccinated}
                            loading={onAddVaccinated}
                        >
                            Thêm
                        </LoadingButton>
                    </Box>
                }
            />
            <CustomDialog
                open={showAddDialogBooking}
                title='Nhập thông tin tiêm chủng'
                content={
                    <Box sx={{ width: "1000px" }}>
                        <BookingForm
                            formBooking={formBooking}
                            setFormBooking={setFormBooking}
                            vaccineList={vaccineList}
                            setSelectedVaccineBooking={
                                setSelectedVaccineBooking
                            }
                        />
                    </Box>
                }
                actions={
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                        width='100%'
                    >
                        <Button variant='text' onClick={closeAddDialogBooking}>
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            onClick={handleBookingDirectly}
                        >
                            Thêm
                        </LoadingButton>
                    </Box>
                }
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

export default ScheduleDetails;
