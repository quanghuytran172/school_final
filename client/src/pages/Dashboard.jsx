import {
    CardContent,
    Grid,
    Stack,
    Card,
    Typography,
    CardHeader,
    colors,
    Button,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import accountApi from "../api/accountApi";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [summaryData, setSummaryData] = useState();

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await accountApi.getSummary();
                setSummaryData(res);
            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, []);

    return (
        <Stack spacing={4}>
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Card elevation={0}>
                            <CardContent>
                                {summaryData && (
                                    <SummaryInfo
                                        title='Tổng số người dân'
                                        number={summaryData.totalUser.toLocaleString(
                                            "de-DE"
                                        )}
                                        icon={
                                            <PersonOutlineOutlinedIcon
                                                sx={{ fontSize: "3rem" }}
                                                color='warning'
                                            />
                                        }
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card elevation={0}>
                            <CardContent>
                                {summaryData && (
                                    <SummaryInfo
                                        title='Người dân đăng ký mới trong tháng'
                                        number={summaryData.newUserRegisterThisMonth.toLocaleString(
                                            "de-DE"
                                        )}
                                        icon={
                                            <VerifiedUserOutlinedIcon
                                                sx={{ fontSize: "3rem" }}
                                                color='success'
                                            />
                                        }
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card elevation={0}>
                            <CardContent>
                                {summaryData && (
                                    <SummaryInfo
                                        title='Doanh thu trong ngày'
                                        number={summaryData.totalRevenueToDay.toLocaleString(
                                            "de-DE"
                                        )}
                                        icon={
                                            <AddModeratorOutlinedIcon
                                                sx={{ fontSize: "3rem" }}
                                                color='primary'
                                            />
                                        }
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={3}>
                        <Card elevation={0}>
                            <CardContent>
                                {summaryData && (
                                    <SummaryInfo
                                        title='Tổng doanh thu'
                                        number={summaryData.totalRevenue.toLocaleString(
                                            "de-DE"
                                        )}
                                        icon={
                                            <AddModeratorOutlinedIcon
                                                sx={{ fontSize: "3rem" }}
                                                color='primary'
                                            />
                                        }
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card elevation={0}>
                            <CardHeader
                                title={
                                    <Typography variant='h6'>
                                        Phân tích các loại vắc xin được tiêm
                                    </Typography>
                                }
                            />
                            <CardContent>
                                {summaryData && (
                                    <VaccinatedChart
                                        chartData={
                                            summaryData.userVaccinatedAnalyst
                                        }
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <Card elevation={0}>
                            <CardHeader
                                title={
                                    <Typography variant='h6'>
                                        Danh sách lô vắc xin mới nhất
                                    </Typography>
                                }
                            />
                            <CardContent>
                                {summaryData && (
                                    <LatestVaccineLotTable
                                        list={summaryData.latestVaccineLot}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </Stack>
    );
};

export default Dashboard;

const SummaryInfo = ({ title, number, icon }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Stack spacing={2}>
                <Typography variant='body2' fontWeight='600'>
                    {title}
                </Typography>
                <Typography variant='h4' fontWeight='600'>
                    {number}
                </Typography>
            </Stack>
            <div>{icon}</div>
        </Box>
    );
};

const VaccinatedChart = ({ chartData }) => {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const data = {
        labels: chartData.statisticsVaccineUsed.map(
            (data) =>
                `${data[0]} ${Math.floor(
                    (data[1] / chartData.totalUser) * 100
                )}%`
        ),
        datasets: [
            {
                label: "Vaccinated analyst",
                data: chartData.statisticsVaccineUsed.map((data) => data[1]),
                backgroundColor: [
                    colors.yellow["700"],
                    colors.green["700"],
                    colors.red["700"],
                    colors.deepPurple["700"],
                    colors.teal["700"],
                    colors.deepOrange["700"],
                ],
                borderColor: [
                    colors.yellow["700"],
                    colors.green["700"],
                    colors.red["700"],
                    colors.deepPurple["700"],
                    colors.teal["700"],
                    colors.deepOrange["700"],
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <Pie
            data={data}
            options={{
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
            }}
        />
    );
};

const LatestVaccineLotTable = ({ list }) => {
    const tableHeader = [
        {
            field: "name",
            headerName: "Số Lô",
            width: 200,
        },
        {
            field: "vaccine",
            headerName: "Tên Vaccine",
            width: 200,
            renderCell: (params) => params.value.name,
        },
        {
            field: "quantity",
            headerName: "Số Lượng",
            width: 150,
            align: "right",
            renderCell: (params) => params.value.toLocaleString("de-DE"),
        },
        {
            field: "createdAt",
            headerName: "Thời Gian Tạo",
            flex: 1,
            renderCell: (params) =>
                moment(params.value).format("DD-MM-YYYY HH:mm:ss"),
        },
    ];
    return (
        <DataGrid
            autoHeight
            rows={list}
            columns={tableHeader}
            hideFooter
            density='comfortable'
            showCellRightBorder
            showColumnRightBorder
            disableSelectionOnClick
        />
    );
};
