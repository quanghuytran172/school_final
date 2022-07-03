import { Button, Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { PageHeader } from "../components";
import { Link } from "react-router-dom";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import userApi from "../api/userApi";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { DataGrid } from "@mui/x-data-grid";

const User = () => {
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(9);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await userApi.getAll();
                setUserList(res);
            } catch (err) {
                console.log(err);
            }
        };
        getUsers();
    }, []);

    const tableHeader = [
        {
            field: "insuranceNumber",
            headerName: "Số Thẻ Bảo Hiểm",
            renderCell: (params) => (
                <Button
                    variant='text'
                    component={Link}
                    to={`/system/user/${params.row.id}`}
                >
                    {params.value}
                </Button>
            ),
            width: 170,
        },
        { field: "fullname", headerName: "Họ Và Tên", width: 220 },
        { field: "phoneNumber", headerName: "Số Điện Thoại", width: 170 },
        { field: "identify", headerName: "Căn Cước Công Dân", width: 170 },
        { field: "address", headerName: "Địa Chỉ", flex: 1, minWidth: 170 },

        {
            field: "id",
            headerName: "Hành động",
            width: 170,
            renderCell: (params) => (
                <Button
                    variant='text'
                    component={Link}
                    to={`/system/user/${params.value}`}
                    startIcon={<OpenInNewOutlinedIcon />}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <>
            <PageHeader
                title='Danh sách người dân'
                rightContent={
                    <Button
                        variant='contained'
                        component={Link}
                        to='/system/user/create'
                        startIcon={<PersonAddOutlinedIcon />}
                    >
                        Thêm
                    </Button>
                }
            />
            <Paper elevation={0}>
                <DataGrid
                    autoHeight
                    rows={userList}
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
        </>
    );
};

export default User;
