import "./styles.css";
import { Button, Card } from "@mui/material";
import moment from "moment";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import bookingApi from "../../../api/bookingApi";
import ReactToPrint from "react-to-print";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
const ScreeningTest = () => {
    const { id } = useParams();
    const [bookingRecord, setBookingRecord] = useState({});
    const componentRef = useRef();

    useEffect(() => {
        const getBooking = async () => {
            const booking = await bookingApi.getOneBooking(id);
            setBookingRecord({ ...booking });
            console.log(123);
        };
        getBooking();
    }, []);
    return (
        <div>
            <div className='section editor' ref={componentRef}>
                <div className='container clearfix'>
                    <div
                        className='editable textview mce-content-body mce-edit-focus'
                        id='mce_0'
                        contentEditable='true'
                        style={{ position: "relative" }}
                        spellCheck='false'
                    >
                        <div className='contentedit active hide'>
                            <table
                                border={0}
                                width='100%'
                                cellSpacing={0}
                                cellPadding={0}
                                align='center'
                                className='mce-item-table'
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <p align='center'>
                                                <strong>
                                                    {" "}
                                                    CƠ SỞ Y TẾ BỆNH VIỆN{" "}
                                                </strong>
                                            </p>
                                            <p align='center'>
                                                <strong> ........ </strong>
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>
                                                <strong>
                                                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA
                                                    VIỆT NAM
                                                </strong>
                                            </p>
                                            <p align='center'>
                                                <strong>
                                                    Độc lập - Tự do - Hạnh phúc
                                                </strong>
                                            </p>
                                            <p align='center'>
                                                ________________________
                                            </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p align='center'>
                                <br />
                                <strong>
                                    PHIẾU SÀNG LỌC TRƯỚC KHI TIÊM CHỦNG <br />
                                </strong>
                                <br />
                            </p>
                            <p>
                                Họ và tên: .........
                                <b>{bookingRecord.fullname}</b>.........
                                Ngày sinh: .....
                                <b>
                                    {moment(bookingRecord.dateOfBirth).format(
                                        "DD/MM/YYYY"
                                    )}
                                </b>
                                ..........Giới tính:....
                                <b>{bookingRecord.gender}</b>.......
                            </p>
                            <p>
                                CCCD/CMT/Hộ chiếu: .........
                                <b>{bookingRecord.identify}</b>........... Số
                                điện thoại:.........
                                <b>{bookingRecord.phoneNumber}</b>..........
                            </p>
                            <p>
                                Số thẻ bảo hiểm:...............
                                <b>{bookingRecord.insuranceNumber}</b>
                                ............... Nghề nghiệp:...........
                                <b>{bookingRecord.job}</b>
                                ...........................
                            </p>
                            <p>
                                Địa chỉ liên hệ: ................
                                <b>{bookingRecord.address}</b>
                                .................................
                            </p>
                            <p>
                                Email: ....................
                                <b>{bookingRecord.email}</b>
                                ....................................................................................
                            </p>
                            <p>
                                <strong> I. Sàng lọc </strong>
                            </p>
                            <table
                                style={{
                                    "border-collapse": "collapse",
                                    width: "100%",
                                    "border-color": "#000",
                                }}
                                border={1}
                                width='100%'
                                data-mce-style='border-collapse: collapse; width: 100%; border-color: #000;'
                            >
                                <tbody>
                                    <tr>
                                        <td>
                                            <p>1. Đang mắc bệnh cấp tính</p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                2. Phụ nữ mang thai<sup>a</sup>
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>
                                                <br />
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>
                                                <br />
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                2a. Phụ nữ mang thai &lt; 13
                                                tuần
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                2b. Phụ nữ mang thai ≥ 13 tuần
                                                <sup>b</sup>
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                3. Phản vệ độ 3 trở lên với bất
                                                kỳ dị nguyên nào (Nếu có, loại
                                                tác nhân dị
                                                ứng:.................. )
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                4. Đang bị suy giảm miễn dịch
                                                nặng, ung thư giai đoạn cuối
                                                đang điều trị hóa trị, xạ trị
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                5. Tiền sử dị ứng với bất kỳ dị
                                                nguyên nào
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                6. Tiền sử rối loạn đông máu/cầm
                                                máu
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                7. Rối loạn tri giác, rối loạn
                                                hành vi
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                8. Bất thường dấu hiệu sống (Nếu
                                                có, ghi rõ......)
                                            </p>
                                            <ul>
                                                <li>
                                                    Nhiệt độ:............độ C •
                                                    Mạch<sup>c</sup>
                                                    :............lần/phút
                                                </li>
                                                <li>
                                                    Huyết áp<sup>d</sup>
                                                    :............mmHg • Nhịp thở
                                                    <sup>c</sup>
                                                    :............lần/phút
                                                </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                9. Các chống chỉ định/trì hoãn
                                                khác<sup>e</sup> (nếu có, ghi
                                                rõ)
                                            </p>
                                            <p>
                                                .................................
                                            </p>
                                        </td>
                                        <td>
                                            <p align='center'>Không □</p>
                                        </td>
                                        <td>
                                            <p align='center'>Có □</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p>
                                <strong> II. Kết luận: </strong>
                            </p>
                            <p>
                                <strong>
                                    {" "}
                                    - Đủ điều kiện tiêm chủng ngay:{" "}
                                </strong>
                                Tất cả đều <strong>KHÔNG </strong>có điểm bất
                                thường và <strong>KHÔNG </strong>có chống chỉ
                                định tiêm vắc xin theo hướng dẫn sử dụng của nhà
                                sản xuất
                                <sup> □ </sup>
                            </p>

                            <p>
                                - Trì hoãn tiêm chủng: Khi <strong>CÓ </strong>
                                bất kỳ một điểm bất thường tại các mục 1, 2a
                                <sup>□</sup>
                            </p>
                            <p>
                                - Chỉ định tiêm tại các cơ sở y tế có đủ điều
                                kiện cấp cứu phản vệ: Khi <strong>CÓ </strong>
                                bất thường tại mục 3 <sup>□</sup>
                            </p>
                            <p>
                                - Nhóm thận trọng khi tiêm chủng: Khi
                                <strong>CÓ </strong>bất kỳ một điểm bất thường
                                tại các mục 2b, 4, 5, 6, 7, 8. <sup>□</sup>
                            </p>
                            <p>
                                Lý
                                do:.....................................................................................................................
                            </p>
                            <p align='right' style={{ marginRight: 2 + "em" }}>
                                <em>
                                    Thời gian: ....giờ....phút, ngày …tháng
                                    …năm….
                                </em>
                            </p>
                            <table
                                style={{
                                    "border-collapse": "collapse",
                                    width: "100%",
                                }}
                                border={0}
                                data-mce-style='border-collapse: collapse; width: 100%;'
                                className='mce-item-table'
                            >
                                <tbody>
                                    <tr>
                                        <td
                                            style={{ width: "36.5441%" }}
                                            data-mce-style='width: 36.5441%;'
                                        >
                                            <br />
                                        </td>
                                        <td
                                            style={{ width: "62.4265%" }}
                                            data-mce-style='width: 62.4265%;'
                                        >
                                            <p align='center'>
                                                <strong>
                                                    Người thực hiện sàng lọc
                                                </strong>
                                            </p>
                                            <p align='center'>
                                                <em> (ký, ghi rõ họ và tên)</em>
                                            </p>
                                            <br />
                                            <br />
                                            <br />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p align='center'>
                                <span
                                    style={{ "vertical-align": "super" }}
                                    data-mce-style='vertical-align: super;'
                                >
                                    ___________________________
                                </span>
                            </p>
                            <p>
                                <sup> a </sup> Phụ nữ mang thai hoặc đang cho
                                con bú: cần đối chiếu với hướng dẫn sử dụng vắc
                                xin để chỉ định loại vắc xin được phép sử dụng
                            </p>
                            <p>
                                <sup> b </sup> Với phụ nữ mang thai ≥ 13 tuần:
                                Giải thích lợi ích/nguy cơ và ký cam kết nếu
                                đồng
                                <em>ý</em> tiêm và chuyển đến cơ sở có cấp cứu
                                sản khoa để tiêm
                            </p>
                            <p>
                                <sup> c </sup> Đo mạch, đếm nhịp thở ở người có
                                tiền sử suy tim hoặc phát hiện bất thường như
                                đau ngực, khó thở
                            </p>
                            <p>
                                <sup> d </sup> Đo huyết áp đối với người có tiền
                                sử tăng huyết áp/ huyết áp thấp, người có bệnh
                                nền liên quan đến bệnh lý tim mạch, người trên
                                65 tuổi
                            </p>
                            <p>
                                <sup> e </sup> Các trường hợp chống chỉ định/trì
                                hoãn theo hướng dẫn của nhà sản xuất đối với
                                loại vắc xin sử dụng hoặc phát hiện có các yếu
                                tố bất thường khác
                            </p>
                        </div>
                    </div>
                </div>
                <div className='section nextdocs'>
                    <ReactToPrint
                        trigger={() => (
                            <Button variant="contained">
                                In ra
                                <LocalPrintshopOutlinedIcon
                                    style={{
                                        "margin-left": "10px",
                                    }}
                                />
                            </Button>
                        )}
                        content={() => componentRef.current}
                    />
                </div>
                <div
                    style={{
                        position: "static",
                        height: "0px",
                        width: "0px",
                        padding: "0px",
                        margin: "0px",
                        border: "0px",
                    }}
                />
                <div
                    id='rememberry__extension__root'
                    style={{ all: "unset" }}
                />
                <div style={{ position: "absolute", top: "0px" }} />
            </div>
        </div>
    );
};
export default ScreeningTest;
