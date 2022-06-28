import {
    Button,
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    Autocomplete,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CustomDialog, PageHeader } from "../components";
import { Link } from "react-router-dom";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import accountApi from "../api/accountApi";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { LoadingButton } from "@mui/lab";

const Account = () => {
    const [userList, setUserList] = useState([]);
    const [pageSize, setPageSize] = useState(9);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const getAccounts = async () => {
            try {
                const res = await accountApi.getAll();
                console.log(res);
                setUserList(res);
            } catch (err) {
                console.log(err);
            }
        };
        getAccounts();
    }, []);

    const tableHeader = [
        {
            field: "username",
            headerName: "Tên tài khoản",
            renderCell: (params) => (
                <Button
                    variant='text'
                    component={Link}
                    to={`/system/account/${params.row.id}`}
                >
                    {params.value}
                </Button>
            ),
            width: 150,
        },
        { field: "roleName", headerName: "Vai Trò", width: 170 },
        { field: "fullname", headerName: "Họ Và Tên", width: 170 },
        { field: "phoneNumber", headerName: "Số Điện Thoại", width: 170 },
        { field: "email", headerName: "Email", width: 170 },
        {
            field: "createdAt",
            headerName: "Thời Gian Tạo",
            flex: 1,
            minWidth: 170,
            renderCell: (params) =>
                moment(params.value).format("DD-MM-YYYY HH:mm:ss"),
        },
        {
            field: "id",
            headerName: "Hành động",
            flex: 1,
            minWidth: 170,
            renderCell: (params) => (
                <Button
                    variant='text'
                    component={Link}
                    to={`/system/account/${params.value}`}
                    startIcon={<OpenInNewOutlinedIcon />}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];
    const onCreateSuccess = (newAccount) => {
        setUserList([newAccount, ...userList]);
        setShowCreateModal(false);
    };

    return (
        <>
            <PageHeader
                title='Danh sách tài khoản'
                rightContent={
                    <Button
                        variant='contained'
                        startIcon={<PersonAddOutlinedIcon />}
                        onClick={() => setShowCreateModal(true)}
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
            <AccountCreateModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={onCreateSuccess}
            />
        </>
    );
};

export default Account;

const AccountCreateModal = ({ show, onClose, onSuccess }) => {
    const [username, setUsername] = useState("");
    const [usernameErr, setUsernameErr] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState(false);
    const [fullname, setFullname] = useState("");
    const [fullnameErr, setFullnameErr] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleErr, setRoleErr] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberErr, setPhoneNumberErr] = useState(false);
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState(false);

    const [onSubmit, setOnSubmit] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const [roleList, setRoleList] = useState([]);
    const createAccount = async () => {
        if (onSubmit) return;
        const err = [
            !selectedRole,
            !username,
            !fullname,
            !password,
            !phoneNumber,
            !email,
        ];
        setRoleErr(!selectedRole);
        setUsernameErr(!username);
        setPasswordErr(!password);
        setFullnameErr(!fullname);
        setPhoneNumberErr(!phoneNumber);
        setEmailErr(!email);
        if (!err.every((e) => !e)) return;
        setOnSubmit(true);
        try {
            const res = await accountApi.create({
                username,
                password,
                fullname,
                email,
                phoneNumber,
                roleId: selectedRole.id,
            });
            res.roleName = selectedRole.roleName;
            setUsername("");
            setSelectedRole(null);
            setEmail("");
            setPassword("");
            setPhoneNumber("");
            setFullname("");
            setDialogText("Thêm thành công");
            setDialogType("success");
            setDialogOpen(true);
            onSuccess(res);
        } catch (err) {
            if (err.response.status === 403) {
                setDialogText(err.response.data);
                setDialogType("error");
                setDialogOpen(true);
            }
        } finally {
            setOnSubmit(false);
        }
    };
    useEffect(() => {
        const getAllRole = async () => {
            try {
                const res = await accountApi.getRole();
                setRoleList(res);
            } catch (err) {
                console.log(err);
            }
        };
        getAllRole();
    }, []);
    return (
        <>
            <CustomDialog
                open={show}
                title='Thêm tài khoản'
                content={
                    <Box padding='5px 0' component='form'>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Tên tài khoản'
                                        variant='outlined'
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        error={usernameErr}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Mật khẩu'
                                        type={"password"}
                                        variant='outlined'
                                        autoComplete='current-password'
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        error={passwordErr}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin='normal'>
                                    <Autocomplete
                                        options={roleList}
                                        getOptionLabel={(option) =>
                                            option.roleName
                                        }
                                        renderOption={(props, option) => (
                                            <Box {...props} component='li'>
                                                {option.roleName}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Vai trò'
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete:
                                                        "new-password",
                                                }}
                                                error={roleErr}
                                            />
                                        )}
                                        value={selectedRole}
                                        onChange={(event, value) => {
                                            setSelectedRole(value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Họ và tên'
                                        variant='outlined'
                                        value={fullname}
                                        onChange={(e) =>
                                            setFullname(e.target.value)
                                        }
                                        error={fullnameErr}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Số điện thoại'
                                        variant='outlined'
                                        value={phoneNumber}
                                        type={"number"}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                        error={phoneNumberErr}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Email'
                                        variant='outlined'
                                        value={email}
                                        type='email'
                                        autoComplete={"email"}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        error={emailErr}
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
                                setUsername("");
                                setSelectedRole(null);
                                setEmail("");
                                setPassword("");
                                setPhoneNumber("");
                                setFullname("");

                                setUsernameErr(false);
                                setRoleErr(false);
                                setEmailErr(false);
                                setPasswordErr(false);
                                setPhoneNumberErr(false);
                                setFullnameErr(false);
                                onClose();
                            }}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant='contained'
                            onClick={createAccount}
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
