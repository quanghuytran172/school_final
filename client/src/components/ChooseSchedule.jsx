import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Card, Grid, Typography } from "@mui/material";
import moment from "moment";
const ChooseSchedule = ({
    scheduleList,
    selectedScheduleId,
    setSelectedScheduleId,
    setVaccineList,
}) => {
    const [value, setValue] = useState(selectedScheduleId);
    return (
        <Grid padding={4}>
            {scheduleList.map((schedule, key) => (
                <Card
                    key={key}
                    style={
                        value == schedule.id
                            ? {
                                  padding: "1em",
                                  margin: "1.5em",
                                  position: "relative",
                                  top: 0,
                                  boxShadow:
                                      "0 2px 4px 0 rgb(219 215 215 / 50%), 0 0 0 2px #3057d5",
                              }
                            : {
                                  padding: "1em",
                                  margin: "1.5em",
                                  position: "relative",
                                  top: 0,
                              }
                    }
                >
                    <div
                        style={{
                            display: "flex",
                            position: "absolute",
                            top: "5%",
                            right: "5%",
                        }}
                    ></div>

                    <FormControl
                        component='fieldset'
                        style={{
                            width: "100%",
                        }}
                    >
                        <FormLabel component='legend'>
                            Thông tin lịch tiêm
                        </FormLabel>
                        <RadioGroup
                            aria-label='address'
                            name='address'
                            value={value}
                            onChange={(e) => {
                                setSelectedScheduleId(e.target.value);
                                setVaccineList(schedule.listVaccine);
                                setValue(e.target.value);
                            }}
                        >
                            <FormControlLabel
                                value={schedule.id}
                                label={
                                    <>
                                        <Typography sx={{ mt: 2, mb: 1 }}>
                                            Tiêu đề: <b>{schedule.title}</b>
                                        </Typography>
                                        <Typography sx={{ mt: 2, mb: 1 }}>
                                            Thời gian:{" "}
                                            <b>
                                                {moment(schedule.time).format(
                                                    "DD-MM-YYYY"
                                                )}
                                            </b>
                                        </Typography>
                                        <Typography sx={{ mt: 2, mb: 1 }}>
                                            Số lượng người đăng ký:{" "}
                                            <b>
                                                {schedule.totalUsersBooking}/
                                                {schedule.maxQuantity}
                                            </b>
                                        </Typography>
                                    </>
                                }
                                labelPlacement='start'
                                style={{
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}
                                control={
                                    <Radio
                                        style={{
                                            opacity: 1,
                                            color: "#3057d5",
                                            marginLeft: "10em",
                                        }}
                                    />
                                }
                            />
                        </RadioGroup>
                    </FormControl>
                </Card>
            ))}
        </Grid>
    );
};

export default ChooseSchedule;
