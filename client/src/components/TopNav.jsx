import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { logout } from "../handlers/authHandler";
import {
    AppBar,
    Avatar,
    colors,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { useState } from "react";

const TopNav = ({ role }) => {
    const theme = useTheme();
    const [anchorElUser, setAnchorElUser] = useState(null);

    const navigate = useNavigate();

    const settings = [
        {
            name: "Cập nhật thông tin cá nhân",
            roleName: ["Admin", "Vaccinated Helper"],
            funcName: () => {
                navigate("/system/profile");
            },
        },
        {
            name: "Cập nhật thông tin cá nhân",
            roleName: ["User"],
            funcName: () => {
                navigate("/profile");
            },
        },
        {
            name: "Đăng xuất",
            roleName: ["Admin", "Vaccinated Helper", "User"],
            funcName: () => {
                logout(navigate);
            },
        },
    ];
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    return (
        <AppBar
            position='fixed'
            sx={{
                backgroundColor: colors.common.white,
                color: colors.common.black,
                zIndex: theme.zIndex.drawer + 1,
                boxShadow: "0px 1px 4px 1px rgb(0 0 0 / 12%)",
            }}
            elevation={0}
        >
            <Toolbar>
                <LocalHospitalIcon
                    sx={{
                        color: colors.red["800"],
                        marginRight: "10px",
                    }}
                />
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    Cơ sở y tế
                </Typography>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar
                            alt='User image'
                            src='https://banner2.cleanpng.com/20180625/req/kisspng-computer-icons-avatar-business-computer-software-user-avatar-5b3097fcae25c3.3909949015299112927133.jpg'
                            sx={{
                                height: "40px",
                                width: "40px",
                            }}
                        />
                    </IconButton>

                    <Menu
                        sx={{ mt: "45px" }}
                        id='menu-appbar'
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {role &&
                            settings
                                .filter((settingFilter) =>
                                    settingFilter.roleName.includes(
                                        role.roleName
                                    )
                                )
                                .map((setting) => (
                                    <MenuItem
                                        key={setting.name}
                                        onClick={setting.funcName}
                                    >
                                        <Typography textAlign='center'>
                                            {setting.name}
                                        </Typography>
                                    </MenuItem>
                                ))}
                    </Menu>
                    {/* <IconButton
                        aria-label='logout'
                        sx={{ color: colors.blue["800"] }}
                        onClick={() => logout(navigate)}
                    >
                        <ExitToAppOutlinedIcon />
                    </IconButton> */}
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;
