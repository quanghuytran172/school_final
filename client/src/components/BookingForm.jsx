import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    Grid,
    TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const BookingForm = ({
    formBooking,
    setFormBooking,
    vaccineList,
    setSelectedVaccineBooking,
}) => {
    const [insuranceNumber, setInsuranceNumber] = useState(
        formBooking ? formBooking.insuranceNumber : ""
    );
    const [fullname, setFullname] = useState(
        formBooking ? formBooking.fullname : ""
    );
    const [gender, setGender] = useState(formBooking ? formBooking.gender : "");
    const [dateOfBirth, setDateOfBirth] = useState(
        formBooking ? formBooking.dateOfBirth : "01/01/1990"
    );
    const [phoneNumber, setPhoneNumber] = useState(
        formBooking ? formBooking.phoneNumber : ""
    );
    const [identify, setIdentify] = useState(
        formBooking ? formBooking.identify : ""
    );
    const [email, setEmail] = useState(formBooking ? formBooking.email : "");
    const [address, setAddress] = useState(
        formBooking ? formBooking.address : ""
    );
    const [job, setJob] = useState(formBooking ? formBooking.job : "");
    return (
        <Grid padding={4}>
            <Card elevation={0}>
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid item xs={4}>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Số thẻ bảo hiểm'
                                    variant='outlined'
                                    value={insuranceNumber}
                                    onChange={(e) => {
                                        setInsuranceNumber(e.target.value);
                                        setFormBooking({
                                            ...formBooking,
                                            insuranceNumber: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Họ và tên'
                                    variant='outlined'
                                    value={fullname}
                                    onChange={(e) => {
                                        setFullname(e.target.value);
                                        setFormBooking({
                                            ...formBooking,
                                            fullname: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Giới tính'
                                    variant='outlined'
                                    value={gender}
                                    onChange={(e) => {
                                        setGender(e.target.value);

                                        setFormBooking({
                                            ...formBooking,
                                            gender: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth margin='normal'>
                                <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                >
                                    <DatePicker
                                        label='Ngày sinh'
                                        value={dateOfBirth}
                                        onChange={(newValue) => {
                                            setDateOfBirth(newValue);
                                            setFormBooking({
                                                ...formBooking,
                                                dateOfBirth: newValue,
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Số điện thoại'
                                    variant='outlined'
                                    type='number'
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        setFormBooking({
                                            ...formBooking,
                                            phoneNumber: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Nghề nghiệp'
                                    variant='outlined'
                                    value={job}
                                    onChange={(e) => {
                                        setJob(e.target.value);
                                        setFormBooking({
                                            ...formBooking,
                                            job: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='CCCD/CMND'
                                    variant='outlined'
                                    type='number'
                                    value={identify}
                                    onChange={(e) => {
                                        setIdentify(e.target.value);
                                        setFormBooking({
                                            ...formBooking,
                                            identify: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Email'
                                    variant='outlined'
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setFormBooking({
                                            ...formBooking,
                                            email: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin='normal'>
                                <TextField
                                    label='Địa chỉ'
                                    variant='outlined'
                                    value={address}
                                    onChange={(e) => {
                                        setAddress(e.target.value);
                                        setFormBooking({
                                            ...formBooking,
                                            address: e.target.value,
                                        });
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        {vaccineList && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <Autocomplete
                                        options={vaccineList}
                                        getOptionLabel={(option) => option.name}
                                        renderOption={(props, option) => (
                                            <Box {...props} component='li'>
                                                {option.name}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Chọn vắc xin'
                                                inputProps={{
                                                    ...params.inputProps,
                                                    autoComplete:
                                                        "new-password",
                                                }}
                                            />
                                        )}
                                        onChange={(event, value) => {
                                            setSelectedVaccineBooking(value);
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default BookingForm;
