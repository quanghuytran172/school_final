import { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Alert, Card, CardContent, Grid } from "@mui/material";
import { Box } from "@mui/system";
import ChooseSchedule from "../components/ChooseSchedule";
import ChooseVaccine from "../components/ChooseVaccine";
import ChooseBookingType from "../components/ChooseBookingType";

import BookingForm from "../components/BookingForm";
import scheduleApi from "../api/scheduleApi";
import bookingApi from "../api/bookingApi";

import { CustomDialog } from "../components";
import userApi from "../api/userApi";
const steps = [
    "Chọn lịch tiêm",
    "Chọn hình thức đăng ký",
    "Chọn vắc xin",
    "Điền thông tin tiêm chủng",
];

const UserRegisterVaccination = () => {
    const [scheduleList, setScheduleList] = useState([]);
    const [vaccineList, setVaccineList] = useState([]);
    const [user, setUser] = useState({});
    const [activeStep, setActiveStep] = useState(0);
    const [selectedScheduleId, setSelectedScheduleId] = useState(null);
    const [selectedBookingType, setSelectedBookingType] = useState("Cá nhân");
    const [selectedVaccine, setSelectedVaccine] = useState(null);
    const [formBooking, setFormBooking] = useState({
        insuranceNumber: "",
        fullname: "",
        dateOfBirth: "01/01/1990",
        phoneNumber: "",
        address: "",
        gender: "",
        identify: "",
        email: "",
        job: "",
    });

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogText, setDialogText] = useState("");
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <ChooseSchedule
                            selectedScheduleId={selectedScheduleId}
                            setSelectedScheduleId={setSelectedScheduleId}
                            scheduleList={scheduleList}
                            setVaccineList={setVaccineList}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <ChooseBookingType
                            setSelectedBookingType={setSelectedBookingType}
                            selectedBookingType={selectedBookingType}
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <ChooseVaccine
                            vaccineList={vaccineList}
                            selectedVaccine={selectedVaccine}
                            setSelectedVaccine={setSelectedVaccine}
                        />
                    </>
                );
            case 3:
                return (
                    <>
                        <BookingForm
                            formBooking={formBooking}
                            setFormBooking={setFormBooking}
                        />
                    </>
                );
            default:
                return "Unknown step";
        }
    };

    const dialogPerform = (message) => {
        setDialogType("error");
        setDialogText(message || "Error");
        setDialogOpen(true);
    };
    const handleSubmit = async () => {
        switch (activeStep) {
            case 0:
                if (!selectedScheduleId)
                    return dialogPerform("Vui lòng chọn lịch");
                handleNext();
                break;
            case 1:
                if (!selectedBookingType)
                    return dialogPerform("Vui lòng chọn hình thức đăng ký");
                handleNext();
                break;
            case 2:
                if (!selectedVaccine)
                    return dialogPerform("Vui lòng chọn vắc xin");
                handleNext();
                break;
            case 3:
                try {
                    if (
                        !formBooking.insuranceNumber ||
                        !formBooking.fullname ||
                        !formBooking.dateOfBirth ||
                        !formBooking.phoneNumber ||
                        !formBooking.gender ||
                        !formBooking.identify ||
                        !formBooking.job ||
                        !formBooking.email ||
                        !formBooking.address
                    )
                        return dialogPerform("Vui lòng điền đẩy đủ thông tin ");
                    await bookingApi.booking({
                        scheduleId: selectedScheduleId,
                        vaccineId: selectedVaccine,
                        bookingType: selectedBookingType,
                        ...formBooking,
                    });
                    handleNext();
                } catch (error) {
                    dialogPerform(error.response.data);
                }

                break;
        }
    };
    useEffect(() => {
        const getData = async () => {
            try {
                const schedules = await scheduleApi.getScheduleAvailable();
                const userInfo = await userApi.getInfo();
                setScheduleList(schedules);
                setUser(userInfo);
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        setFormBooking({
            insuranceNumber:
                selectedBookingType === "Cá nhân" ? user.insuranceNumber : "",
            fullname: selectedBookingType === "Cá nhân" ? user.fullname : "",
            dateOfBirth:
                selectedBookingType === "Cá nhân"
                    ? user.dateOfBirth
                    : "01/01/1990",
            phoneNumber:
                selectedBookingType === "Cá nhân" ? user.phoneNumber : "",
            address: selectedBookingType === "Cá nhân" ? user.address : "",
            gender: selectedBookingType === "Cá nhân" ? user.gender : "",
            identify: selectedBookingType === "Cá nhân" ? user.identify : "",
            email: selectedBookingType === "Cá nhân" ? user.email : "",
            job: selectedBookingType === "Cá nhân" ? user.job : "",
        });
    }, [user, selectedBookingType]);

    return (
        <Card elevation={1}>
            <CardContent>
                <Typography
                    component='h1'
                    variant='h4'
                    align='center'
                    marginBottom={5}
                >
                    Đăng ký tiêm chủng
                </Typography>

                {scheduleList.length ? (
                    <>
                        <Stepper activeStep={activeStep}>
                            {steps.map((label, index) => {
                                const stepProps = {};
                                const labelProps = {};
                                return (
                                    <Step key={label} {...stepProps}>
                                        <StepLabel {...labelProps}>
                                            {label}
                                        </StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                        {activeStep === steps.length ? (
                            <>
                                <Grid padding={4}>
                                    <Typography sx={{ mt: 2, mb: 1 }}>
                                        Bạn đã đăng ký thành công !
                                    </Typography>
                                </Grid>
                            </>
                        ) : (
                            <>
                                {getStepContent(activeStep)}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        pt: 2,
                                    }}
                                >
                                    <Button
                                        color='inherit'
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        sx={{ mr: 1 }}
                                    >
                                        Quay lại
                                    </Button>
                                    <Box sx={{ flex: "1 1 auto" }} />

                                    <Button onClick={handleSubmit}>
                                        {activeStep === steps.length - 1
                                            ? "Nộp đơn đăng ký"
                                            : "Tiếp theo"}
                                    </Button>
                                </Box>
                            </>
                        )}
                    </>
                ) : (
                    <Typography
                        align='center'
                        marginBottom={5}
                        variant='subtitle1'
                        gutterBottom
                        component='div'
                    >
                        Hiện không có lịch tiêm nào
                    </Typography>
                )}
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
            </CardContent>
        </Card>
    );
};
export default UserRegisterVaccination;
