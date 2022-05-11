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
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";

const TopNav = () => {
    const theme = useTheme();
    const navigate = useNavigate();

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
                    Cơ sở y tế XYZ
                </Typography>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <Avatar
                        alt='User image'
                        src='https://banner2.cleanpng.com/20180625/req/kisspng-computer-icons-avatar-business-computer-software-user-avatar-5b3097fcae25c3.3909949015299112927133.jpg'
                        sx={{
                            height: "30px",
                            width: "30px",
                        }}
                    />
                    <IconButton
                        aria-label='logout'
                        sx={{ color: colors.blue["800"] }}
                        onClick={() => logout(navigate)}
                    >
                        <ExitToAppOutlinedIcon />
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;
