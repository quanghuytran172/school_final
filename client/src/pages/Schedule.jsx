import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import diseaseApi from "../api/diseaseApi";
import { PageHeader, CustomDialog, CustomDialogConfirm } from "../components";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import scheduleApi from "../api/scheduleApi";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import vaccineApi from "../api/vaccineApi";
const Schedule = () => {
    const [scheduleList, setScheduleList] = useState([]);
    const [pageSzie, setPageSzie] = useState(9);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [onDelete, setOnDelete] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState("");

    const [dialogOpenConfirm, setDialogOpenConfirm] = useState({
        status: false,
        params: "",
    });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const getSchedule = async () => {
        try {
            const res = await scheduleApi.getAllSystem();
            setScheduleList(res);
        } catch (err) {
            console.log(err);
        }
    };
    const selectDisease = (schedule) => {
        setSelectedSchedule(schedule);
    };
    useEffect(() => {
        getSchedule();
    }, []);

    const tableHeader = [
        {
            field: "fullname",
            headerName: "Người tạo",
            width: 180,
            renderCell: (params) => {
                return params.row.account.fullname;
            },
        },
        {
            field: "title",
            headerName: "Tiêu đề",
            maxWidth: 500,
            minWidth: 250,
            renderCell: (params) => params.value,
        },
        {
            field: "time",
            headerName: "Thời gian",
            width: 150,
            renderCell: (params) =>
                moment(params.row.time).format("DD-MM-YYYY"),
        },
        {
            field: "maxQuantity",
            headerName: "Số lượng tối đa",
            width: 150,
            renderCell: (params) => params.value,
        },
        {
            field: "totalUsersBooking",
            headerName: "Số người đăng ký",
            width: 150,
            renderCell: (params) => params.value,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 120,
            renderCell: (params) => {
                if (Number(params.value) === 0) {
                    return "Đã đóng";
                } else if (Number(params.value) === 1) {
                    return "Đang mở";
                } else {
                    return "Hoàn thành";
                }
            },
        },
        {
            field: "createdAt",
            headerName: "Thời Gian Tạo",
            minWidth: 170,

            renderCell: (params) =>
                moment(params.value).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            field: "_id",
            headerName: "Hành Động",
            minWidth: 300,

            flex: 1,
            renderCell: (params) => (
                <>
                    <LoadingButton
                        color='error'
                        disableElevation
                        startIcon={<DeleteOutlineOutlinedIcon />}
                        loading={onDelete}
                        onClick={() =>
                            setDialogOpenConfirm({
                                status: true,
                                params: params.value,
                            })
                        }
                    >
                        Xóa
                    </LoadingButton>

                    <Button
                        disableElevation
                        startIcon={<ModeEditOutlineOutlinedIcon />}
                        onClick={() => {
                            selectDisease(params.row);
                            setShowUpdateModal(true);
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        variant='text'
                        component={Link}
                        to={`/system/schedule/${params.value}`}
                        startIcon={<OpenInNewOutlinedIcon />}
                    >
                        Chi tiết
                    </Button>
                </>
            ),
        },
    ];
    const deleteSchedule = async (scheduleId) => {
        if (onDelete) return;
        setOnDelete(true);
        try {
            await scheduleApi.delete(scheduleId);
            getSchedule();
            setOnDelete(false);
        } catch (err) {
            setDialogText(err.response.data || "Xóa thất bại");
            setDialogType("error");
            setDialogOpen(true);
        } finally {
            setOnDelete(false);
        }
    };

    return (
        <>
            <PageHeader
                title='Danh sách lịch tiêm chủng'
                rightContent={
                    <Button
                        variant='contained'
                        disableElevation
                        onClick={() => setShowCreateModal(true)}
                    >
                        Tạo lịch tiêm
                    </Button>
                }
            />
            <Paper elevation={0}>
                <DataGrid
                    autoHeight
                    rows={scheduleList}
                    columns={tableHeader}
                    pageSize={pageSzie}
                    rowsPerPageOptions={[9, 50, 100]}
                    onPageSizeChange={(size) => setPageSzie(size)}
                    density='comfortable'
                    showColumnRightBorder
                    showCellRightBorder
                    disableSelectionOnClick
                />
            </Paper>
            <ScheduleCreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                getSchedule={getSchedule}
            />
            <ScheduleUpdateModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                schedule={selectedSchedule}
                getSchedule={getSchedule}
            />

            <CustomDialogConfirm
                open={dialogOpenConfirm.status}
                title={"Xác nhận xóa"}
                content={"Bạn có muốn xóa lịch tiêm chủng này hay không ?"}
                handleClose={() => {
                    setDialogOpenConfirm({ status: false, params: "" });
                }}
                handleOk={() => {
                    deleteSchedule(dialogOpenConfirm.params);
                    setDialogOpenConfirm({ status: false, params: "" });
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

export default Schedule;

const ScheduleCreateModal = ({ show, onClose, getSchedule }) => {
    const [title, setTitle] = useState("");
    const [titleErr, setTitleErr] = useState(false);
    const [time, setTime] = useState(new Date());
    const [timeErr, setTimeErr] = useState(false);
    const [maxQuantity, setMaxQuantity] = useState("");
    const [maxQuantityErr, setMaxQuantityErr] = useState(false);
    const [statusList, setStatusList] = useState([
        { statusCode: 0, statusName: "Đã đóng" },
        { statusCode: 1, statusName: "Đang mở" },
        { statusCode: 2, statusName: "Hoàn thành" },
    ]);
    const [statusErr, setStatusErr] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");

    const [listVaccine, setListVaccine] = useState([]);
    const [listVaccineErr, setListVaccineErr] = useState(false);

    const [allVaccine, setAllVaccine] = useState([]);
    const [onUpdate, setOnUpdate] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");

    const resetInput = () => {
        setTitle("");
        setTime(new Date());
        setMaxQuantity("");
        setSelectedStatus("");
        setListVaccine([]);
    };

    const createSchedule = async () => {
        if (onUpdate) return;
        const err = [
            !title,
            !time,
            !selectedStatus,
            !maxQuantity,
            !listVaccine.length,
        ];
        setTitleErr(!title);
        setTimeErr(!time);
        setStatusErr(!selectedStatus);
        setMaxQuantityErr(!maxQuantity);
        setListVaccineErr(!listVaccine.length);
        if (!err.every((e) => !e)) return;
        const params = {
            title,
            time,
            status: String(selectedStatus.statusCode),
            maxQuantity,
            listVaccine,
        };
        try {
            await scheduleApi.create(params);
            setDialogText("Tạo lịch thành công");
            setDialogType("success");
            setDialogOpen(true);
            resetInput();
            getSchedule();
            resetInput();
            onClose();
        } catch (err) {
            setDialogText("Tạo lịch thất bại");
            setDialogType("error");
            setDialogOpen(true);
            console.log(err);
        } finally {
            setOnUpdate(false);
        }
    };

    const handleChange = (event) => {
        if (event.target.checked) {
            setListVaccine([...listVaccine, event.target.id]);
        } else {
            setListVaccine(
                listVaccine.filter((vaccineId) => vaccineId !== event.target.id)
            );
        }
    };

    useEffect(() => {
        const getAllVaccine = async () => {
            const allVaccine = await vaccineApi.getAll();

            setAllVaccine(allVaccine);
        };
        getAllVaccine();
    }, []);
    return (
        <>
            <CustomDialog
                open={show}
                title='Tạo lịch tiêm chủng'
                content={
                    <Box padding='20px 0' width='600px'>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Tiêu đề'
                                        variant='outlined'
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        error={titleErr}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl margin='normal' fullWidth>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                    >
                                        <DatePicker
                                            label='Thời gian'
                                            value={time}
                                            onChange={(newValue) => {
                                                setTime(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} />
                                            )}
                                            error={timeErr}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl margin='normal' fullWidth>
                                    <TextField
                                        label='Số lượng người đăng ký tối đa'
                                        variant='outlined'
                                        type='number'
                                        value={maxQuantity}
                                        onChange={(e) =>
                                            setMaxQuantity(e.target.value)
                                        }
                                        error={maxQuantityErr}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        options={statusList}
                                        getOptionLabel={(option) =>
                                            option.statusName
                                        }
                                        renderOption={(props, option) => (
                                            <Box {...props} component='li'>
                                                {option.statusName}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Trạng thái'
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete:
                                                        "new-password",
                                                }}
                                                error={statusErr}
                                            />
                                        )}
                                        onChange={(event, value) => {
                                            setSelectedStatus(value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    component='fieldset'
                                    variant='standard'
                                    error={listVaccineErr}
                                >
                                    <FormLabel component='legend'>
                                        Chọn vắc xin đăng ký
                                    </FormLabel>
                                    <FormGroup>
                                        {allVaccine.map((vaccine, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            listVaccine &&
                                                            listVaccine.indexOf(
                                                                vaccine.id
                                                            ) >= 0
                                                                ? true
                                                                : false
                                                        }
                                                        onChange={handleChange}
                                                        name={vaccine.name}
                                                        id={vaccine.id}
                                                    />
                                                }
                                                label={vaccine.name}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                }
                actions={
                    <Box
                        width='100%'
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant='text'
                            onClick={() => {
                                resetInput();
                                onClose();
                            }}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            onClick={createSchedule}
                            loading={onUpdate}
                        >
                            Tạo
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

const ScheduleUpdateModal = ({ schedule, show, onClose, getSchedule }) => {
    const [title, setTitle] = useState(schedule.title);
    const [titleErr, setTitleErr] = useState(false);
    const [time, setTime] = useState(schedule.time);
    const [timeErr, setTimeErr] = useState(false);
    const [maxQuantity, setMaxQuantity] = useState(schedule.maxQuantity);
    const [maxQuantityErr, setMaxQuantityErr] = useState(false);
    const [statusList, setStatusList] = useState([
        { statusCode: 0, statusName: "Đã đóng" },
        { statusCode: 1, statusName: "Đang mở" },
        { statusCode: 2, statusName: "Hoàn thành" },
    ]);
    const [statusErr, setStatusErr] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [listVaccine, setListVaccine] = useState(schedule.listVaccine);
    const [listVaccineErr, setListVaccineErr] = useState(false);

    const [allVaccine, setAllVaccine] = useState([]);
    const [onUpdate, setOnUpdate] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");

    const resetInput = () => {
        setTitle(schedule.title);
        setTime(schedule.time);
        setMaxQuantity(schedule.maxQuantity);
        setSelectedStatus(
            statusList.find((status) => status.statusCode == schedule.status)
        );
        setListVaccine(schedule.listVaccine);
    };

    const updateSchedule = async () => {
        if (onUpdate) return;
        const err = [
            !title,
            !time,
            !selectedStatus,
            !maxQuantity,
            !listVaccine.length,
        ];
        setTitleErr(!title);
        setTimeErr(!time);
        setStatusErr(!selectedStatus);
        setMaxQuantityErr(!maxQuantity);
        setListVaccineErr(!listVaccine.length);
        if (!err.every((e) => !e)) return;
        const params = {
            title,
            time,
            status: String(selectedStatus.statusCode),
            maxQuantity,
            listVaccine,
        };
        try {
            await scheduleApi.update(schedule.id, params);
            setDialogText("Cập nhật thành công");
            setDialogType("success");
            setDialogOpen(true);
            getSchedule();
            onClose();
        } catch (err) {
            setDialogText(err.message);
            setDialogType("error");
            setDialogOpen(true);
            console.log(err);
        } finally {
            setOnUpdate(false);
        }
    };

    const handleChange = (event) => {
        if (event.target.checked) {
            setListVaccine([...listVaccine, event.target.id]);
        } else {
            setListVaccine(
                listVaccine.filter((vaccineId) => vaccineId !== event.target.id)
            );
        }
    };

    useEffect(() => {
        const getAllVaccine = async () => {
            const allVaccine = await vaccineApi.getAll();

            setAllVaccine(allVaccine);
        };
        getAllVaccine();
        setListVaccine(schedule.listVaccine);
        setTitle(schedule.title);
        setTime(schedule.time);
        setMaxQuantity(schedule.maxQuantity);
        setSelectedStatus(
            statusList.find((status) => status.statusCode == schedule.status)
        );
    }, [schedule]);

    return (
        <>
            <CustomDialog
                open={show}
                title='Cập nhật thông tin lịch tiêm chủng'
                content={
                    <Box padding='20px 0' width='600px'>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Tiêu đề'
                                        variant='outlined'
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        error={titleErr}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl margin='normal' fullWidth>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                    >
                                        <DatePicker
                                            label='Thời gian'
                                            value={time}
                                            onChange={(newValue) => {
                                                setTime(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} />
                                            )}
                                            error={timeErr}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl margin='normal' fullWidth>
                                    <TextField
                                        label='Số lượng người đăng ký tối đa'
                                        variant='outlined'
                                        type='number'
                                        value={maxQuantity}
                                        onChange={(e) =>
                                            setMaxQuantity(e.target.value)
                                        }
                                        error={maxQuantityErr}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        options={statusList}
                                        getOptionLabel={(option) =>
                                            option.statusName
                                        }
                                        renderOption={(props, option) => (
                                            <Box {...props} component='li'>
                                                {option.statusName}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Trạng thái'
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete:
                                                        "new-password",
                                                }}
                                                error={statusErr}
                                            />
                                        )}
                                        value={selectedStatus}
                                        onChange={(event, value) => {
                                            setSelectedStatus(value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    component='fieldset'
                                    variant='standard'
                                    error={listVaccineErr}
                                >
                                    <FormLabel component='legend'>
                                        Chọn vắc xin đăng ký
                                    </FormLabel>
                                    <FormGroup>
                                        {allVaccine.map((vaccine, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                    <Checkbox
                                                        checked={
                                                            listVaccine &&
                                                            listVaccine.indexOf(
                                                                vaccine.id
                                                            ) >= 0
                                                                ? true
                                                                : false
                                                        }
                                                        onChange={handleChange}
                                                        name={vaccine.name}
                                                        id={vaccine.id}
                                                    />
                                                }
                                                label={vaccine.name}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                }
                actions={
                    <Box
                        width='100%'
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant='text'
                            onClick={() => {
                                resetInput();
                                onClose();
                            }}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            onClick={updateSchedule}
                            loading={onUpdate}
                        >
                            Cập nhật
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
