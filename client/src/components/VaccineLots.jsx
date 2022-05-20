import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Typography,
    TextField,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { CustomDialog, CustomDialogConfirm } from ".";
import vaccineLotApi from "../api/vaccineLotApi";

const VaccineLots = ({ vaccine, onLotAdded, onLotDeleted, onLotUpdated }) => {
    const [pageSize, setPageSize] = useState(5);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);
    const [lotNumber, setLotNumber] = useState("");
    const [lotNumberErr, setLotNumberErr] = useState(false);
    const [quantity, setQuantity] = useState("");
    const [quantityErr, setQuantityErr] = useState(false);
    const [onDelete, setOnDelete] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [onUpdate, setOnUpdate] = useState(false);
    const [selectedLot, setSelectedLot] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const [dialogOpenConfirm, setDialogOpenConfirm] = useState({
        status: false,
        params: "",
    });

    const tableHeader = [
        {
            field: "name",
            headerName: "Số Lô",
            width: 200,
        },
        {
            field: "quantity",
            headerName: "Số Lượng Nhập",
            width: 150,
            align: "right",
            renderCell: (params) => params.value.toLocaleString("de-dE"),
        },
        {
            field: "vaccinated",
            headerName: "Số Vaccine Đã Tiêm",
            width: 200,
            align: "right",
            renderCell: (params) => params.value.toLocaleString("de-dE"),
        },
        {
            field: "id",
            headerName: "Số Vaccine Hiện Có",
            width: 200,
            align: "right",
            renderCell: (params) =>
                (params.row.quantity - params.row.vaccinated).toLocaleString(
                    "de-dE"
                ),
        },
        {
            field: "createdAt",
            headerName: "Thời Gian Tạo",
            flex: 1,
            renderCell: (params) =>
                moment(params.value).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            field: "_id",
            headerName: "Hành Động",
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
                        onClick={() => selectLot(params.row)}
                    >
                        Chỉnh sửa
                    </Button>
                </>
            ),
        },
    ];

    const createLot = async () => {
        if (onSubmit) return;
        const err = [!lotNumber, !quantity];
        setLotNumberErr(!lotNumber);
        setQuantityErr(!quantity);
        if (!err.every((e) => !e)) return;
        setOnSubmit(true);
        const params = {
            vaccineId: vaccine.id,
            name: lotNumber,
            quantity,
        };
        try {
            await vaccineLotApi.create(params);
            setQuantity("");
            setLotNumber("");
            setShowAddDialog(false);
            onLotAdded();
        } catch (err) {
            setOnSubmit(false);
            console.log(err);
        } finally {
            setOnSubmit(false);
        }
    };

    const deleteLot = async (lotId) => {
        if (onDelete) return;
        setOnDelete(true);
        try {
            await vaccineLotApi.delete(lotId);
            onLotDeleted();
        } catch (err) {
            console.log(err);
        } finally {
            setOnDelete(false);
        }
    };

    const selectLot = (lot) => {
        setLotNumber(lot.name);
        setQuantity(lot.quantity);
        setSelectedLot(lot);
        setShowUpdateDialog(true);
    };

    const hideUpdateDialog = () => {
        setLotNumber("");
        setQuantity("");
        setSelectedLot(undefined);
        setShowUpdateDialog(false);
    };

    const updateLot = async () => {
        if (onUpdate) return;
        const err = [!lotNumber, !quantity];
        setLotNumberErr(!lotNumber);
        setQuantityErr(!quantity);
        if (!err.every((e) => !e)) return;
        setOnUpdate(true);
        const params = {
            name: lotNumber,
            quantity,
        };
        try {
            await vaccineLotApi.update(selectedLot.id, params);
            setQuantity("");
            setLotNumber("");
            setDialogText("Cập nhật thành công");
            setDialogType("success");
            setDialogOpen(true);
            setShowUpdateDialog(false);
            onLotUpdated();
        } catch (err) {
            setDialogText("Cập nhật thất bại");
            setDialogType("error");
            setDialogOpen(true);
            console.log(err);
        } finally {
            setOnUpdate(false);
        }
    };

    return (
        <>
            <Card elevation={0}>
                <CardHeader
                    title={
                        <Typography variant='h6'>
                            Thông tin lô Vaccine
                        </Typography>
                    }
                    action={
                        <Button
                            variant='contained'
                            disableElevation
                            onClick={() => setShowAddDialog(true)}
                        >
                            Thêm lô vaccine
                        </Button>
                    }
                />
                <CardContent>
                    <DataGrid
                        autoHeight
                        rows={vaccine.vaccineLots}
                        columns={tableHeader}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 50]}
                        onPageSizeChange={(size) => setPageSize(size)}
                        density='comfortable'
                        showCellRightBorder
                        showColumnRightBorder
                        disableSelectionOnClick
                    />
                </CardContent>
            </Card>
            <CustomDialog
                open={showAddDialog}
                title='Thêm lô vaccine'
                content={
                    <Box sx={{ width: "400px" }}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Số Lô'
                                variant='outlined'
                                value={lotNumber}
                                onChange={(e) => setLotNumber(e.target.value)}
                                error={lotNumberErr}
                            />
                        </FormControl>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Số Lượng'
                                variant='outlined'
                                type='number'
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                error={quantityErr}
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
                            onClick={() => setShowAddDialog(false)}
                            // disable={onSubmit}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            disableElevation
                            loading={onSubmit}
                            onClick={createLot}
                        >
                            Thêm
                        </LoadingButton>
                    </Box>
                }
            />
            <CustomDialog
                open={showUpdateDialog}
                title='Cập nhật lô vaccine'
                content={
                    <Box sx={{ width: "400px" }}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Số Lô'
                                variant='outlined'
                                value={lotNumber}
                                onChange={(e) => setLotNumber(e.target.value)}
                                error={lotNumberErr}
                            />
                        </FormControl>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Số Lượng Nhập'
                                variant='outlined'
                                type='number'
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                error={quantityErr}
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
                            onClick={hideUpdateDialog}
                            // disable={onUpdate}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            disableElevation
                            loading={onUpdate}
                            onClick={updateLot}
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
            <CustomDialogConfirm
                open={dialogOpenConfirm.status}
                title={"Xác nhận xóa lô vaccine"}
                content={"Bạn có muốn xóa lô vaccine này không ?"}
                handleClose={() => {
                    setDialogOpenConfirm({ status: false, params: "" });
                }}
                handleOk={() => {
                    deleteLot(dialogOpenConfirm.params);
                    setDialogOpenConfirm({ status: false, params: "" });
                }}
                delete={true}
            />
        </>
    );
};

export default VaccineLots;
