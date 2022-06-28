import "./styles.css";

import ReactToPrint from "react-to-print";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import QRCode from "react-qr-code";
import scheduleApi from "../../../api/scheduleApi";
import { useParams } from "react-router-dom";
import moment from "moment";

const VaccinationCertificate = () => {
    const { userId, userBookingId } = useParams();
    const [infoUserVaccine, setInfoUserVaccine] = useState(null);
    const componentRef = useRef();

    useEffect(() => {
        const getBooking = async () => {
            const info = await scheduleApi.getInfoVaccinated(
                userId,
                userBookingId
            );
            console.log(info);
            setInfoUserVaccine(info);
        };
        getBooking();
    }, []);
    return (
        <>
            {infoUserVaccine && (
                <>
                    <div className='section editor' ref={componentRef}>
                        <div className='container clearfix'>
                            <div
                                className='editable textview mce-content-body'
                                id='mce_0'
                                contentEditable='true'
                                style={{ position: "relative" }}
                                spellCheck='false'
                            >
                                <div className='contentedit active hide'>
                                    <table
                                        style={{
                                            borderCollapse: "collapse",
                                            width: "98%",
                                        }}
                                        data-mce-style='border-collapse: collapse; width: 98%;'
                                        className='mce-item-table'
                                    >
                                        <tbody>
                                            <tr>
                                                <td
                                                    style={{
                                                        width: "34.0166%",
                                                    }}
                                                    data-mce-style='width: 34.0166%;'
                                                >
                                                    <table
                                                        style={{
                                                            borderCollapse:
                                                                "collapse",
                                                            width: "47.4913%",
                                                            height: 53,
                                                            borderColor: "#000",
                                                            borderStyle:
                                                                "solid",
                                                            margin: "0 auto",
                                                        }}
                                                        border={1}
                                                        cellSpacing={0}
                                                        data-mce-style='border-collapse: collapse; width: 47.4913%; height: 53px; border-color: #000; border-style: solid;'
                                                    >
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style={{
                                                                        width: "100%",
                                                                    }}
                                                                    data-mce-style='width: 100%;'
                                                                >
                                                                    <strong>
                                                                        <QRCode
                                                                            id='qrcode'
                                                                            value='https://viblo.asia/u/tranchien'
                                                                            size={
                                                                                100
                                                                            }
                                                                            level={
                                                                                "H"
                                                                            }
                                                                            includeMargin={
                                                                                true
                                                                            }
                                                                        />
                                                                    </strong>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td
                                                    style={{
                                                        width: "64.954%",
                                                        textAlign: "center",
                                                    }}
                                                    data-mce-style='width: 64.954%; text-align: center;'
                                                >
                                                    <strong>
                                                        CỘNG HÒA XÃ HỘI CHỦ
                                                        NGHĨA VIỆT NAM
                                                    </strong>
                                                    <strong>
                                                        <br />
                                                    </strong>
                                                    <strong>
                                                        Độc lập - Tự do - Hạnh
                                                        phúc
                                                    </strong>
                                                    <strong>
                                                        <br />
                                                    </strong>
                                                    <strong>
                                                        ---------------
                                                    </strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p
                                        style={{ textAlign: "center" }}
                                        data-mce-style='text-align: center;'
                                    >
                                        <br /> <br />
                                        <strong>
                                            GIẤY CHỨNG NHẬN TIÊM CHỦNG
                                        </strong>
                                        <br />
                                        <strong>
                                            (CERTIFICATE OF VACCINATION)
                                        </strong>
                                        <br />
                                        <br />
                                    </p>
                                    <p>
                                        Họ và tên/Name: .....................
                                        <b>
                                            {
                                                infoUserVaccine.userBooking
                                                    .fullname
                                            }
                                        </b>
                                        ..............................................................
                                    </p>
                                    <p>
                                        Giới tính/Sex:
                                        <b>
                                            {` ${infoUserVaccine.userBooking.gender}`}
                                        </b>
                                    </p>
                                    <p>
                                        Ngày sinh/Date of birth
                                        (day/month/year): ...........
                                        <b>
                                            {moment(
                                                infoUserVaccine.userBooking
                                                    .dateOfBirth
                                            ).format("DD/MM/YYYY")}
                                        </b>
                                        ................................................
                                    </p>
                                    <p>
                                        Số CCCD/CMT/hộ chiếu/định danh cá nhân
                                        (ID): .............
                                        <b>
                                            {
                                                infoUserVaccine.userBooking
                                                    .identify
                                            }
                                        </b>
                                        ..............................
                                    </p>
                                    <p>
                                        Số điện thoại/Tel: ...............
                                        <b>
                                            {
                                                infoUserVaccine.userBooking
                                                    .phoneNumber
                                            }
                                        </b>
                                        ............................................................................
                                    </p>
                                    <p>
                                        Địa chỉ (Address): ...............
                                        <b>
                                            {
                                                infoUserVaccine.userBooking
                                                    .address
                                            }
                                        </b>
                                        ..................................................................................
                                    </p>

                                    <br />

                                    <table
                                        style={{
                                            borderCollapse: "collapse",
                                            width: "98%",
                                            borderColor: "#000",
                                        }}
                                        border={1}
                                        cellSpacing={0}
                                        cellPadding={4}
                                        data-mce-style='border-collapse: collapse; width: 98%; border-color: #000;'
                                    >
                                        <tbody>
                                            <tr>
                                                <td
                                                    style={{
                                                        width: "8254.01%",
                                                    }}
                                                    colSpan={2}
                                                    data-mce-style='width: 8254.01%;'
                                                >
                                                    <p
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                        data-mce-style='text-align: center;'
                                                    >
                                                        <strong>
                                                            Thông tin tiêm chủng
                                                        </strong>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style={{
                                                        width: "54.0109%",
                                                    }}
                                                    width='49,1800%'
                                                    data-mce-style='width: 54.0109%;'
                                                >
                                                    <p>
                                                        Vắc xin (Vaccine)
                                                        .........
                                                        <b>
                                                            {
                                                                infoUserVaccine
                                                                    .vaccine
                                                                    .name
                                                            }
                                                        </b>
                                                        .................
                                                    </p>
                                                    <p>
                                                        Lô số (Lot No):......
                                                        <b>
                                                            {
                                                                infoUserVaccine
                                                                    .vaccineLot
                                                                    .name
                                                            }
                                                        </b>
                                                        ..........
                                                    </p>
                                                    <p>
                                                        Ngày tiêm (Date):.....
                                                        <b>
                                                            {moment(
                                                                infoUserVaccine.createdAt
                                                            ).format(
                                                                "DD/MM/YYYY"
                                                            )}
                                                        </b>
                                                        ...........
                                                    </p>
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                        width: "8200%",
                                                    }}
                                                    width='50,8200%'
                                                    data-mce-style='text-align: center; width: 8200%;'
                                                >
                                                    <p>
                                                        Cơ sở tiêm
                                                        chủng/Immunization unit
                                                    </p>
                                                    <p>
                                                        <em>(Ký, đóng dấu)</em>
                                                    </p>
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <br />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='section nextdocs'>
                        <ReactToPrint
                            trigger={() => (
                                <Button variant='contained'>
                                    In ra
                                    <LocalPrintshopOutlinedIcon
                                        style={{
                                            marginLeft: "10px",
                                        }}
                                    />
                                </Button>
                            )}
                            content={() => componentRef.current}
                        />
                    </div>
                </>
            )}
        </>
    );
};
export default VaccinationCertificate;
