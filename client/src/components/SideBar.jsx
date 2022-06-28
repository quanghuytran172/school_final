import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SickOutlinedIcon from "@mui/icons-material/SickOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import {
    Drawer,
    List,
    Toolbar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    colors,
} from "@mui/material";

const sideBarItems = [
    {
        text: "Dasboard",
        path: "/system",
        icon: <DashboardOutlinedIcon />,
        roleName: ["Admin", "Vaccinated Helper"],
    },
    {
        text: "Người dân",
        path: "/system/user",
        icon: <PersonOutlineOutlinedIcon />,
        roleName: ["Admin", "Vaccinated Helper"],
    },
    {
        text: "Quản lý tài khoản",
        path: "/system/account",
        icon: <ManageAccountsOutlinedIcon />,
        roleName: ["Admin"],
    },
    {
        text: "Danh mục bệnh",
        path: "/system/disease",
        icon: <SickOutlinedIcon />,
        roleName: ["Admin"],
    },
    {
        text: "Vaccine",
        path: "/system/vaccine",
        icon: <HealthAndSafetyOutlinedIcon />,
        roleName: ["Admin"],
    },
    {
        text: "Lịch tiêm chủng",
        path: "/system/schedule",
        icon: <EventNoteOutlinedIcon />,
        roleName: ["Vaccinated Helper"],
    },
    {
        text: "Đăng ký tiêm chủng",
        path: "/",
        icon: <AppRegistrationOutlinedIcon />,
        roleName: ["User"],
    },
    {
        text: "Lịch tiêm đã đăng ký",
        path: "/registered-schedule",
        icon: <InsertInvitationOutlinedIcon />,
        roleName: ["User"],
    },
    {
        text: "Thông tin tiêm chủng",
        path: "/vaccinated-infomation",
        icon: <VaccinesOutlinedIcon />,
        roleName: ["User"],
    },
];

const SideBar = ({ role }) => {
    const location = useLocation();
    const siderBarWidth = 300;
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const activeItem = sideBarItems
            .filter((sideBarFilter) =>
                sideBarFilter.roleName.includes(role.roleName)
            )
            .findIndex((item) => {
                if (
                    item.path.split("/").length === 2 &&
                    window.location.pathname.split("/").length === 2
                ) {
                    return (
                        window.location.pathname.split("/")[1] ===
                        item.path.split("/")[1]
                    );
                }
                return (
                    window.location.pathname.split("/")[2] ===
                    item.path.split("/")[2]
                );
            });
        setActiveIndex(activeItem);
    }, [location]);

    return (
        <Drawer
            container={window.document.body}
            variant='permanent'
            sx={{
                width: siderBarWidth,
                height: "100vh",
                boxShadow: "0px 1px 4px 1px rgb(0 0 0 / 12%)",
                "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: siderBarWidth,
                    borderRight: 0,
                },
            }}
            open={true}
        >
            <Toolbar />
            <List>
                {sideBarItems
                    .filter((sideBarFilter) =>
                        sideBarFilter.roleName.includes(role.roleName)
                    )
                    .map((item, index) => (
                        <ListItemButton
                            key={`siderbar-key-${index}`}
                            selected={index === activeIndex}
                            component={Link}
                            to={item.path}
                            sx={{
                                width: "calc(100% - 20px)",
                                margin: "5px auto",
                                borderRadius: "10px",
                                "&.Mui-selected": {
                                    color: colors.blue["A700"],
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: colors.blue["200"],
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color:
                                        index === activeIndex &&
                                        colors.blue["A700"],
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                sx={{
                                    "& span": {
                                        fontWeight:
                                            index === activeIndex && "500",
                                    },
                                }}
                            />
                        </ListItemButton>
                    ))}
            </List>
        </Drawer>
    );
};

export default SideBar;
