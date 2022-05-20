import { useEffect, useState } from "react";
import vaccineApi from "../api/vaccineApi";
import {
    PageHeader,
    CustomDialog,
    VaccineLots,
    CustomDialogConfirm,
} from "../components";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
    Card,
    CardContent,
    Grid,
    FormControl,
    TextField,
    CardActions,
    Typography,
    Box,
    Button,
    Autocomplete,
} from "@mui/material";
import diseaseApi from "../api/diseaseApi";

const VaccineDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [vaccine, setVaccine] = useState();
    const [name, setName] = useState("");
    const [nameErr, setNameErr] = useState(false);
    const [description, setDescription] = useState("");
    const [descriptionErr, setDescriptionErr] = useState(false);
    const [price, setPrice] = useState("");
    const [priceErr, setPriceErr] = useState(false);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [diseaseErr, setDiseaseErr] = useState(false);

    const [onSubmit, setOnSubmit] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const [onDelete, setOnDelete] = useState(false);
    const [diseaseList, setDiseaseList] = useState([]);

    const [dialogOpenConfirm, setDialogOpenConfirm] = useState(false);

    useEffect(() => {
        const getVaccine = async () => {
            try {
                const vaccine = await vaccineApi.getOne(id);
                const diseases = await diseaseApi.getAll();
                setDiseaseList(diseases);
                setVaccine(vaccine);
                setName(vaccine.name);
                setPrice(vaccine.price);
                setDescription(vaccine.description);
                setSelectedDisease(
                    diseases.find((disease) => disease.id == vaccine.diseaseId)
                );
            } catch (err) {
                console.log(err);
            }
        };

        getVaccine();
    }, []);

    const updateVaccine = async () => {
        if (onSubmit) return;
        const err = [!selectedDisease, !name, !price, !description];
        setDiseaseErr(!selectedDisease);
        setNameErr(!name);
        setDescriptionErr(!description);
        setPriceErr(!price);
        if (!err.every((e) => !e)) return;
        setOnSubmit(true);

        try {
            const res = await vaccineApi.update(id, {
                name,
                price,
                description,
                diseaseId: selectedDisease.id,
            });
            console.log(res);
            setDialogText("Cập nhật thông tin Vaccine thành công");
            setDialogType("success");
        } catch (err) {
            console.log(err);
            setDialogText("Cập nhật thông tin Vaccine thất bại");
            setDialogType("error");
        } finally {
            setOnSubmit(false);
            setDialogOpen(true);
        }
    };

    const deleteVaccine = async () => {
        if (onDelete) return;
        setOnDelete(true);
        try {
            await vaccineApi.delete(id);
            setOnDelete(false);
            navigate("/vaccine");
        } catch (err) {
            console.log(err);
            setOnDelete(false);
            setDialogText("Delete fail");
            setDialogType("error");
            setDialogOpen(true);
        }
    };

    const resetPage = async () => {
        try {
            const res = await vaccineApi.getOne(id);
            setVaccine(res);
            setName(res.name);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <PageHeader
                title='Thông tin chi tiết Vaccine'
                rightContent={
                    <LoadingButton
                        variant='text'
                        disableElevation
                        color='error'
                        loading={onDelete}
                        onClick={() => setDialogOpenConfirm(true)}
                    >
                        Xóa Vaccine
                    </LoadingButton>
                }
            />
            <CustomDialogConfirm
                open={dialogOpenConfirm}
                title={"Xác nhận xóa vaccine"}
                content={
                    "Lưu ý: Mọi thông tin liên quan đến như lô vắc xin, thông tin tiêm chủng của người dùng sẽ bị mất "
                }
                handleClose={() => {
                    setDialogOpenConfirm(false);
                }}
                handleOk={() => {
                    deleteVaccine();
                    setDialogOpenConfirm(false);
                }}
                delete={true}
            />
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <Card elevation={0}>
                        <CardContent>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Tên vaccine'
                                    variant='outlined'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={nameErr}
                                />
                            </FormControl>
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
                                                autoComplete: "new-password",
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
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Giá tiền'
                                    variant='outlined'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    error={priceErr}
                                />
                            </FormControl>
                            <FormControl fullWidth margin='normal'>
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
                            {vaccine && (
                                <>
                                    <FormControl fullWidth margin='normal'>
                                        <TextField
                                            label='Tổng số vắc xin hiện có'
                                            variant='outlined'
                                            value={
                                                vaccine.quantity -
                                                vaccine.vaccinated
                                            }
                                            InputProps={{ readOnly: true }}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin='normal'>
                                        <TextField
                                            label='Tổng số lượng nhập'
                                            variant='outlined'
                                            value={vaccine.quantity}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin='normal'>
                                        <TextField
                                            label='Tổng số vaccine đã tiêm'
                                            variant='outlined'
                                            value={vaccine.vaccinated}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </FormControl>
                                </>
                            )}
                        </CardContent>
                        <CardActions>
                            <LoadingButton
                                variant='contained'
                                loading={onSubmit}
                                disableElevation
                                onClick={updateVaccine}
                            >
                                Cập nhật
                            </LoadingButton>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={9}>
                    {vaccine && (
                        <VaccineLots
                            vaccine={vaccine}
                            onLotAdded={resetPage}
                            onLotDeleted={resetPage}
                            onLotUpdated={resetPage}
                        />
                    )}
                </Grid>
            </Grid>
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

export default VaccineDetail;
