import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import userApi from "../api/userApi";

const UserVaccinatedInfo = () => {
    const [userVaccines, setUserVaccines] = useState([]);
    const [pageSzie, setPageSzie] = useState(9);

    useEffect(() => {
        const getMyVaccinated = async () => {
            try {
                const res = await userApi.getMyVaccinated();
                setUserVaccines(res);
            } catch (err) {
                console.log(err);
            }
        };
        getMyVaccinated();
    }, []);

    const tableHeader = [
        {
            field: "name",
            headerName: "Tên Vaccine",
            flex: 1,
            renderCell: (params) => params.value,
        },
        {
            field: "vaccineLotName",
            headerName: "Lô Vaccine",
            flex: 1,
            renderCell: (params) => params.value,
        },

        {
            field: "createAtDay",
            headerName: "Ngày tiêm",
            flex: 1,
            renderCell: (params) => moment(params.value).format("DD/MM/YYYY"),
        },
        {
            field: "createAtTime",
            headerName: "Thời gian tiêm",
            flex: 1,
            renderCell: (params) => moment(params.value).format("HH:mm:ss"),
        },
        {
            field: "price",
            headerName: "Giá tiền",
            flex: 1,
            renderCell: (params) => params.value,
        },
    ];

    return (
        <>
            <Card elevation={0}>
                <CardHeader
                    title={
                        <Typography variant='h6'>
                            Thông tin tiêm chủng
                        </Typography>
                    }
                />
                <CardContent>
                    <DataGrid
                        autoHeight
                        rows={userVaccines}
                        columns={tableHeader}
                        pageSize={pageSzie}
                        rowsPerPageOptions={[9, 50, 100]}
                        onPageSizeChange={(size) => setPageSzie(size)}
                        density='comfortable'
                        showCellRightBorder
                        showColumnRightBorder
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default UserVaccinatedInfo;
