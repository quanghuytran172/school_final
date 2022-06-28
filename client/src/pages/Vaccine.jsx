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
import { PageHeader, CustomDialog } from "../components";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import { LoadingButton } from "@mui/lab";
import vaccineApi from "../api/vaccineApi";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

const Vaccine = () => {
    const [vaccineList, setVaccineList] = useState([]);
    const [pageSize, setPageSize] = useState(9);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const getVaccines = async () => {
            try {
                const res = await vaccineApi.getAll();
                console.log(res);
                setVaccineList(res);
            } catch (err) {
                console.log(err);
            }
        };
        getVaccines();
    }, []);

    const tableHeader = [
        {
            field: "name",
            headerName: "Tên Vaccine",
            width: 220,
            renderCell: (params) => (
                <Button
                    variant='text'
                    component={Link}
                    to={`/system/vaccine/${params.row.id}`}
                >
                    {params.value}
                </Button>
            ),
        },
        {
            field: "diseaseName",
            headerName: "Danh Mục Bệnh",
            width: 220,
            renderCell: (params) => params.value,
        },
        {
            field: "description",
            headerName: "Mô Tả",
            width: 400,
            renderCell: (params) => params.value,
        },
        {
            field: "price",
            headerName: "Giá Tiền",
            align: "right",

            width: 170,
            renderCell: (params) => params.value,
        },

        {
            field: "id",
            headerName: "Số Vaccine Hiện Có",
            align: "right",
            width: 170,
            renderCell: (params) =>
                (params.row.quantity - params.row.vaccinated).toLocaleString(
                    "de-DE"
                ),
        },

        {
            field: "createdAt",
            headerName: "Thời Gian Tạo",
            flex: 1,
            minWidth: 170,
            renderCell: (params) =>
                moment(params.value).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            field: "_id",
            headerName: "Hành động",
            flex: 1,

            minWidth: 170,
            renderCell: (params) => (
                <Button
                    variant='text'
                    component={Link}
                    to={`/system/vaccine/${params.value}`}
                    startIcon={<OpenInNewOutlinedIcon />}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    const onCreateSuccess = (newVaccine) => {
        setVaccineList([newVaccine, ...vaccineList]);
        setShowCreateModal(false);
    };

    return (
        <>
            <PageHeader
                title='Danh sách Vaccine'
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
                    rows={vaccineList}
                    columns={tableHeader}
                    pageSize={pageSize}
                    rowsPerPageOptions={[9, 50, 100]}
                    onPageSizeChange={(size) => setPageSize(size)}
                    density='comfortable'
                    showColumnRightBorder
                    showCellRightBorder
                    disableSelectionOnClick
                />
            </Paper>
            <VaccineCreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={onCreateSuccess}
            />
        </>
    );
};

export default Vaccine;

const VaccineCreateModal = ({ show, onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [nameErr, setNameErr] = useState(false);
    const [description, setDescription] = useState("");
    const [descriptionErr, setDescriptionErr] = useState(false);
    const [price, setPrice] = useState("");
    const [priceErr, setPriceErr] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [diseaseErr, setDiseaseErr] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const [diseaseList, setDiseaseList] = useState([]);
    const createVaccine = async () => {
        if (onSubmit) return;
        const err = [!selectedDisease, !name, !price, !description];
        setDiseaseErr(!selectedDisease);
        setNameErr(!name);
        setDescriptionErr(!description);
        setPriceErr(!price);
        if (!err.every((e) => !e)) return;
        setOnSubmit(true);
        try {
            const res = await vaccineApi.create({
                name,
                price,
                description,
                diseaseId: selectedDisease.id,
            });
            res.diseaseName = selectedDisease.name;
            setName("");
            setSelectedDisease(null);
            setPrice("");
            setDescription("");
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
    useEffect(() => {
        const getDisease = async () => {
            try {
                const res = await diseaseApi.getAll();
                setDiseaseList(res);
            } catch (err) {
                console.log(err);
            }
        };
        getDisease();
    }, []);
    return (
        <>
            <CustomDialog
                open={show}
                title='Thêm vaccine'
                content={
                    <Box padding='5px 0'>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin='normal'>
                                    <Autocomplete
                                        options={diseaseList}
                                        getOptionLabel={(option) => option.name}
                                        renderOption={(props, option) => (
                                            <Box {...props} component='li'>
                                                {option.name}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Danh mục bệnh'
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete:
                                                        "new-password",
                                                }}
                                                error={diseaseErr}
                                            />
                                        )}
                                        value={selectedDisease}
                                        onChange={(event, value) => {
                                            setSelectedDisease(value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Tên vaccine'
                                        variant='outlined'
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        error={nameErr}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Giá tiền'
                                        variant='outlined'
                                        value={price}
                                        type='number'
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                        error={priceErr}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Mô tả'
                                        variant='outlined'
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        error={descriptionErr}
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
                                setSelectedDisease(null);
                                setPrice("");
                                setDescription("");
                                setDiseaseErr(false);
                                setNameErr(false);
                                setDescriptionErr(false);
                                setPriceErr(false);
                                onClose();
                            }}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            onClick={createVaccine}
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
