import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    ScreeningTest,
    LoginSystem,
    AppLayout,
    Dashboard,
    User,
    UserCreate,
    UserDetail,
    Vaccine,
    VaccineDetail,
    Disease,
    Account,
    AccountDetail,
    LoginUser,
    UserProfile,
    AccountProfile,
    Schedule,
    ScheduleDetails,
    UserRegisteredSchedule,
    UserVaccinatedInfo,
    VaccinationCertificate,
    UserRegisterVaccination,
} from "./pages";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='login' element={<LoginSystem />} />
                <Route path='login-user' element={<LoginUser />} />

                <Route path='/' element={<AppLayout type={"user"} />}>
                    <Route index element={<UserRegisterVaccination />} />
                    <Route path='/profile' element={<UserProfile />} />
                    <Route
                        path='/registered-schedule'
                        element={<UserRegisteredSchedule />}
                    />
                    <Route
                        path='/vaccinated-infomation'
                        element={<UserVaccinatedInfo />}
                    />
                </Route>
                <Route path='/system' element={<AppLayout type={"system"} />}>
                    <Route index element={<Dashboard />} />
                    <Route
                        path='/system/profile'
                        element={<AccountProfile />}
                    />
                    <Route path='/system/user' element={<User />} />
                    <Route
                        path='/system/user/create'
                        element={<UserCreate />}
                    />
                    <Route path='/system/user/:id' element={<UserDetail />} />
                    <Route path='/system/disease' element={<Disease />} />
                    <Route path='/system/vaccine' element={<Vaccine />} />
                    <Route
                        path='/system/vaccine/:id'
                        element={<VaccineDetail />}
                    />
                    <Route path='/system/account' element={<Account />} />
                    <Route
                        path='/system/account/:id'
                        element={<AccountDetail />}
                    />
                    <Route path='/system/schedule' element={<Schedule />} />
                    <Route
                        path='/system/schedule/:id'
                        element={<ScheduleDetails />}
                    />
                    <Route
                        path='/system/schedule/screening-test/:id'
                        element={<ScreeningTest />}
                    />
                    <Route
                        path='/system/schedule/certificate/:userBookingId/:userId'
                        element={<VaccinationCertificate />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
