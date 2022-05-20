import {
    Autocomplete,
    Box,
    Button,
    FormControl,
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
const Disease = () => {
    const [diseaseList, setDiseaseList] = useState([]);
    const [pageSzie, setPageSzie] = useState(9);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [onDelete, setOnDelete] = useState(false);
    const [onUpdate, setOnUpdate] = useState(false);
    const [diseaseName, setDiseaseName] = useState("");
    const [diseaseNameErr, setDiseaseNameErr] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [dialogOpenConfirm, setDialogOpenConfirm] = useState({
        status: false,
        params: "",
    });
    const [selectedDisease, setSelectedDisease] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const getDisease = async () => {
        try {
            const res = await diseaseApi.getAll();
            setDiseaseList(res);
        } catch (err) {
            console.log(err);
        }
    };
    const selectDisease = (disease) => {
        setDiseaseName(disease.name);
        setSelectedDisease(disease);
        setShowUpdateDialog(true);
    };
    useEffect(() => {
        getDisease();
    }, []);

    const tableHeader = [
        {
            field: "name",
            headerName: "Tên bệnh",
            width: 400,
            renderCell: (params) => params.value,
        },
        {
            field: "createdAt",
            headerName: "Thời Gian Tạo",
            flex: 1,
            minWidth: 170,

            width: 400,
            renderCell: (params) =>
                moment(params.value).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            field: "_id",
            headerName: "Hành Động",
            minWidth: 170,

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
                        onClick={() => selectDisease(params.row)}
                    >
                        Chỉnh sửa
                    </Button>
                </>
            ),
        },
    ];
    const deleteDisease = async (diseaseId) => {
        if (onDelete) return;
        setOnDelete(true);
        try {
            await diseaseApi.delete(diseaseId);
            getDisease();
        } catch (err) {
            console.log(err);
        } finally {
            setOnDelete(false);
        }
    };
    const updateDisease = async () => {
        if (onUpdate) return;
        const err = [!diseaseName];
        setDiseaseNameErr(!diseaseName);
        if (!err.every((e) => !e)) return;
        const params = {
            name: diseaseName,
        };
        try {
            await diseaseApi.update(selectedDisease.id, params);
            setDiseaseName("");
            setDialogText("Cập nhật thành công");
            setDialogType("success");
            setDialogOpen(true);
            setShowUpdateDialog(false);
            getDisease();
        } catch (err) {
            setDialogText("Cập nhật thất bại");
            setDialogType("error");
            setDialogOpen(true);
            console.log(err);
        } finally {
            setOnUpdate(false);
        }
    };
    const onCreateSuccess = (newVaccine) => {
        setDiseaseList([newVaccine, ...diseaseList]);
        setShowCreateModal(false);
    };

    return (
        <>
            <PageHeader
                title='Danh sách danh mục bệnh'
                rightContent={
                    <Button
                        variant='contained'
                        disableElevation
                        onClick={() => setShowCreateModal(true)}
                    >
                        Thêm
                    </Button>
                }
            />
            <Paper elevation={0}>
                <DataGrid
                    autoHeight
                    rows={diseaseList}
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
            <DiseaseCreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={onCreateSuccess}
            />
            <CustomDialog
                open={showUpdateDialog}
                title='Cập nhật danh mục bệnh'
                content={
                    <Box sx={{ width: "400px" }}>
                        <FormControl fullWidth margin='normal'>
                            <TextField
                                label='Tên bệnh'
                                variant='outlined'
                                value={diseaseName}
                                onChange={(e) => setDiseaseName(e.target.value)}
                                error={diseaseNameErr}
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
                            onClick={() => {
                                setDiseaseName("");
                                setShowUpdateDialog(false);
                            }}
                            // disable={onUpdate}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            disableElevation
                            loading={onUpdate}
                            onClick={updateDisease}
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
                title={"Xác nhận xóa"}
                content={"Bạn có muốn xóa danh mục bệnh không ?"}
                handleClose={() => {
                    setDialogOpenConfirm({ status: false, params: "" });
                }}
                handleOk={() => {
                    deleteDisease(dialogOpenConfirm.params);
                    setDialogOpenConfirm({ status: false, params: "" });
                }}
                delete={true}
            />
        </>
    );
};

export default Disease;

const DiseaseCreateModal = ({ show, onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [nameErr, setNameErr] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const createDisease = async () => {
        if (onSubmit) return;
        const err = [!name];
        setNameErr(!name);
        if (!err.every((e) => !e)) return;
        setOnSubmit(true);
        try {
            const res = await diseaseApi.create({
                name,
            });
            setName("");
            setDialogText("Thêm thành công");
            setDialogType("success");
            setDialogOpen(true);
            onSuccess(res);
        } catch (err) {
            console.log(err);
            setDialogText("Thêm thất bại");
            setDialogType("error");
            setDialogOpen(true);
        } finally {
            setOnSubmit(false);
        }
    };

    return (
        <>
            <CustomDialog
                open={show}
                title='Thêm danh mục bệnh'
                content={
                    <Box padding='5px 0'>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Tên bệnh'
                                        variant='outlined'
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        error={nameErr}
                                    />
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
                                setName("");
                                onClose();
                            }}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            onClick={createDisease}
                            loading={onSubmit}
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
