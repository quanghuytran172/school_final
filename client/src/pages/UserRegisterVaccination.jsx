import { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Card, CardContent, Grid } from "@mui/material";
import { Box } from "@mui/system";
const steps = [
    "Chọn hình thức đăng ký",
    "Chọn vắc xin",
    "Điền thông tin tiêm chủng",
];

const UserRegisterVaccination = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    // const [onUpdate, setOnUpdate] = useState(false);

    // const [insuranceNumber, setInsuranceNumber] = useState(
    //     user.insuranceNumber
    // );
    // const [insuranceNumberErr, setInsuranceNumberErr] = useState(false);

    // const [name, setName] = useState(user.fullname);
    // const [nameErr, setNameErr] = useState(false);

    // const [gender, setGender] = useState(user.gender);
    // const [genderErr, setGenderErr] = useState(false);

    // const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
    // const [dateOfBirthErr, setDateOfBirthErr] = useState(false);

    // const [phone, setPhone] = useState(user.phoneNumber);
    // const [phoneErr, setPhoneErr] = useState(false);

    // const [identify, setIdentify] = useState(user.identify);
    // const [identifyErr, setIdentifyErr] = useState(false);

    // const [email, setEmail] = useState(user.email);
    // const [emailErr, setEmailErr] = useState(false);

    // const [address, setAddress] = useState(user.address);
    // const [addressErr, setAddressErr] = useState(false);

    // const [job, setJob] = useState(user.job);
    // const [jobErr, setJobErr] = useState(false);

    return (
        <Card elevation={0}>
            <CardContent>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant='caption'>
                                    Optional
                                </Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                pt: 2,
                            }}
                        >
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Step {activeStep + 1}
                        </Typography>
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
                                Back
                            </Button>
                            <Box sx={{ flex: "1 1 auto" }} />
                            {isStepOptional(activeStep) && (
                                <Button
                                    color='inherit'
                                    onClick={handleSkip}
                                    sx={{ mr: 1 }}
                                >
                                    Skip
                                </Button>
                            )}

                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1
                                    ? "Finish"
                                    : "Next"}
                            </Button>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
export default UserRegisterVaccination;
