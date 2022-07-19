import { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Card, Grid, Typography } from "@mui/material";
import moment from "moment";
const ChooseVaccine = ({
    vaccineList,
    selectedVaccine,
    setSelectedVaccine,
}) => {
    const [value, setValue] = useState(selectedVaccine);

    return (
        <Grid container spacing={2} padding={4}>
            {vaccineList.map((vaccine, key) => (
                <Grid item xs={4} key={key}>
                    <Card
                        style={
                            value == vaccine.id
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
                                Thông tin vắc xin
                            </FormLabel>
                            <RadioGroup
                                aria-label='address'
                                name='address'
                                value={value}
                                onChange={(e) => {
                                    setSelectedVaccine(e.target.value);
                                    setValue(e.target.value);
                                }}
                            >
                                <FormControlLabel
                                    value={vaccine.id}
                                    label={
                                        <>
                                            <Typography sx={{ mt: 2, mb: 1 }}>
                                                Tên vắc xin:{" "}
                                                <b>{vaccine.name}</b>
                                            </Typography>
                                            <Typography sx={{ mt: 2, mb: 1 }}>
                                                Loại bệnh:{" "}
                                                <b>{vaccine.diseaseId.name}</b>
                                            </Typography>
                                            <Typography sx={{ mt: 2, mb: 1 }}>
                                                Mô tả:{" "}
                                                <b>{vaccine.description}</b>
                                            </Typography>
                                            <Typography sx={{ mt: 2, mb: 1 }}>
                                                Giá tiền:{" "}
                                                <b>
                                                    {vaccine.price.toLocaleString(
                                                        "de-DE"
                                                    )}
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
                                                marginLeft: "1.50em",
                                            }}
                                        />
                                    }
                                />
                            </RadioGroup>
                        </FormControl>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ChooseVaccine;
