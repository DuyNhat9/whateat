import React from "react";
import "./PaymentSuccess.css";
import { FcApproval } from "react-icons/fc";
import Footer from "../../components/Footer/Footer";

const PaymentSuccess = () => {
    return (
      <div className="payment-success">
          <div  className="icon">
              <FcApproval/>
          </div>
          <div className="content">
              <h1>Thanh toán thành công</h1>
          </div>
          <div className="btn">
              <a className="back-home-btn" href="/">Về trang chủ</a>
          </div>
          <Footer/>
      </div>
    );
  };
  
export default PaymentSuccess;
