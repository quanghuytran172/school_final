import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Grid } from "@mui/material";
const ChooseBookingType = ({ selectedBookingType, setSelectedBookingType }) => {
    const [value, setValue] = useState(selectedBookingType);
    return (
        <Grid margin={6} textAlign='center'>
            <FormControl>
                <RadioGroup
                    aria-labelledby='demo-radio-buttons-group-label'
                    name='radio-buttons-group3'
                    value={value}
                    row
                    onChange={(e) => {
                        setSelectedBookingType(e.target.value);
                        setValue(e.target.value);
                    }}
                >
                    <FormControlLabel
                        value='Cá nhân'
                        control={<Radio />}
                        label='Cá nhân'
                    />
                    <FormControlLabel
                        value='Đăng ký hộ'
                        control={<Radio />}
                        label='Đăng ký hộ'
                    />
                </RadioGroup>
            </FormControl>
        </Grid>
    );
};

export default ChooseBookingType;
