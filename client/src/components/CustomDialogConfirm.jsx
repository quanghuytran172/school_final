import PropTypes from "prop-types";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    Button,
} from "@mui/material";

const CustomDialogConfirm = (props) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby='responsive-dialog-title'
        >
            <DialogTitle id='responsive-dialog-title'>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>{props.content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} variant='outlined'>
                    Hủy
                </Button>
                <Button
                    variant='contained'
                    onClick={props.handleOk}
                    color={props.delete ? "error" : "primary"}
                >
                    {props.delete ? "Xóa" : "Xác nhận"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CustomDialogConfirm.propTypes = {
    title: PropTypes.string,
    content: PropTypes.node,
    open: PropTypes.bool,
    delete: PropTypes.bool,
};

export default CustomDialogConfirm;
