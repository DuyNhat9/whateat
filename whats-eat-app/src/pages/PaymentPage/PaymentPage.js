import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../../components/Footer/Footer";
import "./PaymentPage.css";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../reducers/cart";
import { Modal, Form, Input } from "antd";

const { Option } = Select;

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileUpdated, setIsProfileUpdated] = useState(true);
  const [deliver, setDeliver] = useState();
  const [choosenAddress, setChoosenAddress] = useState();
  const [addressList, setAddressList] = useState([]);
  const [shippingInfoId, setShippingInfoId] = useState();
  const [province, setProvince] = useState(0);
  const [provinceName, setProvinceName] = useState("");
  const [provinceList, setProvinceList] = useState([]);
  const [district, setDistrict] = useState(0);
  const [districtName, setDistrictName] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [ward, setWard] = useState(0);
  const [wardName, setWardName] = useState("");
  const [wardList, setWardList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [shippingFee, setShippingFee] = useState(0);
  const [services, setServices] = useState([]);
  const [choosenService, setChoosenService] = useState();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const token = useSelector((state) => state.auth.userInfo.token);
  const getTotalPrice = (cartItems) => {
    return cartItems.reduce((total, cartItem) => {
      return cartItem.totalPrice + total;
    }, 0);
  };

  const carts = cartItems.map((item) => {
    const container = {};
    container.productId = item.productId;
    container.quantity = item.quantity;
    return container;
  });

  const [form] = Form.useForm();

  const handleConfirm = () => {
    if (!isProfileUpdated) {
      setIsUpdateProfileVisible(true);
    } else if (!shippingInfoId) {
      message.error("Vui lòng chọn địa chỉ giao hàng");
    } else if (!choosenService) {
      message.error("Vui lòng chọn gói dịch vụ giao hàng");
    } else {
      console.log({ paymentMethod, shippingInfoId, carts, choosenService });
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/order`,
        headers: { Authorization: `Bearer ${token}` },
        data: {
          paymentMethodId: paymentMethod,
          shippingInfoId: shippingInfoId,
          productList: carts,
          serviceId: +choosenService,
        },
      })
        .then((res) => {
          dispatch(clearCart());
          if (paymentMethod === 1) {
            navigate(`/payment/success`);
          } else {
            axios({
              method: "POST",
              url: `${process.env.REACT_APP_ASP_API_KEY}/api/Payment/${res.data[0].orderId}`,
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((res) => {
                console.log(res);
                window.open(res.data.url, "_self");
              })
              .catch((err) => {});
          }
        })
        .catch((err) => {
          message.error("Đặt hàng không thành công!");
        });
    }
  };

  const [isUpdateProfileVisible, setIsUpdateProfileVisible] = useState(false);

  const [isAddAddressModalVisible, setIsAddAddressModalVisible] =
    useState(false);
  const [isChooseAddressModalVisible, setIsChooseAddressModalVisible] =
    useState(false);
  const showAddAddressModal = () => {
    setIsAddAddressModalVisible(true);
  };

  const showChooseAddressModal = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/shippingInfos`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log(res.data);
        setAddressList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setIsChooseAddressModalVisible(true);
  };

  const handleCancelAddAddress = () => {
    setIsAddAddressModalVisible(false);
  };

  const handleCancelChooseAddress = () => {
    setIsChooseAddressModalVisible(false);
  };

  const handleGetDistrict = (id) => {
    axios({
      method: "GET",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      headers: { token: `a11d1949-dc33-11ec-987f-ea8994b0d064` },
      params: {
        province_id: +id,
      },
    })
      .then((res) => {
        setDistrictList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleGetWard = (id) => {
    axios({
      method: "GET",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      headers: { token: `a11d1949-dc33-11ec-987f-ea8994b0d064` },
      params: {
        district_id: +id,
      },
    })
      .then((res) => {
        setWardList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmitShippingInfo = (values) => {
    setIsAddAddressModalVisible(false);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/shippingInfos`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: values.name,
        phoneNumber: values.phone,
        address: `${values.address}, ${wardName}, ${districtName}, ${provinceName}`,
        provinceCode: province,
        districtCode: district,
        wardCode: ward,
      },
    })
      .then((res) => {
        message.success("Thêm địa chỉ thành công!");
      })
      .catch((err) => {
        message.error("Thêm địa chỉ không thành công!");
      });
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/shippingInfos`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setAddressList(res.data);

        if (res.data.length > 0) {
          setShippingInfoId(res.data[0].shippingInfoId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log(res.data);
        setIsProfileUpdated(res.data.name ? true : false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (addressList.length > 0) {
      if (!choosenAddress) {
        axios({
          method: "GET",
          url: `${
            process.env.REACT_APP_ASP_API_KEY
          }/api/Customer/ShippingFee?ServiceId=${
            choosenService
              ? choosenService
              : services.length > 0
              ? services[0].service_id
              : 0
          }&FromDistrictId=1463&ToDistrictId=${
            addressList[0].districtCode
          }&ToWardCode=${addressList[0].wardCode}`,
        })
          .then((res) => {
            console.log(res.data);
            setShippingFee(res.data.shippingFee);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios({
          method: "GET",
          url: `${
            process.env.REACT_APP_ASP_API_KEY
          }/api/Customer/ShippingFee?ServiceId=${
            choosenService
              ? choosenService
              : services.length > 0
              ? services[0].service_id
              : 0
          }&FromDistrictId=1463&ToDistrictId=${
            choosenAddress.districtCode
          }&ToWardCode=${choosenAddress.wardCode}`,
        })
          .then((res) => {
            console.log(res.data);
            setShippingFee(res.data.shippingFee);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [choosenAddress, choosenService]);

  useEffect(() => {
    if (addressList.length > 0) {
      if (!choosenAddress) {
        axios({
          method: "GET",
          url: `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`,
          headers: { token: `a11d1949-dc33-11ec-987f-ea8994b0d064` },
          params: {
            shop_id: 3021285,
            from_district: 1463,
            to_district: addressList[0].districtCode,
          },
        })
          .then((res) => {
            console.log(res.data);
            setServices(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios({
          method: "GET",
          url: `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services`,
          headers: { token: `a11d1949-dc33-11ec-987f-ea8994b0d064` },
          params: {
            shop_id: 3021285,
            from_district: 1463,
            to_district: choosenAddress.districtCode,
          },
        })
          .then((res) => {
            console.log(res.data);
            setServices(res.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [choosenAddress]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
      headers: { token: `a11d1949-dc33-11ec-987f-ea8994b0d064` },
    })
      .then((res) => {
        setProvinceList(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="payment">
      <div className="payment-fluid">
        <div className="payment-container">
          <h1 className="hero" style={{ fontWeight: "650" }}>
            Thanh toán đơn hàng
          </h1>
          <div className="address-block">
            <p className="title">Địa chỉ giao hàng</p>
            {addressList.length > 0 ? (
              !choosenAddress ? (
                <div className="info-block">
                  <div>
                    <p className="username">
                      {addressList[0].name
                        ? addressList[0].name
                        : "Trần Nhật Hiệp"}
                    </p>
                    <p className="phone">{addressList[0].phoneNumber}</p>
                    <p className="address">{addressList[0].address}</p>
                  </div>
                </div>
              ) : (
                <div className="info-block">
                  <div>
                    <p className="username">
                      {choosenAddress.name
                        ? choosenAddress.name
                        : "Trần Nhật Hiệp"}
                    </p>
                    <p className="phone">{choosenAddress.phoneNumber}</p>
                    <p className="address">{choosenAddress.address}</p>
                  </div>
                </div>
              )
            ) : (
              <></>
            )}
            <button
              className="btn btn-add-address"
              onClick={showChooseAddressModal}
            >
              Đổi địa chỉ
            </button>
            <button
              className="btn btn-add-address"
              onClick={showAddAddressModal}
            >
              Thêm địa chỉ
            </button>
            <Modal
              visible={isUpdateProfileVisible}
              onCancel={() => setIsUpdateProfileVisible(false)}
              footer={false}
            >
              <h2>Hồ sơ cá nhân của bạn chưa được cập nhật!</h2>
              <a href="/profile">
                Đến cập nhật hồ sơ <AiOutlineArrowRight />
              </a>
            </Modal>
            <Modal
              title="Thêm địa chỉ mới"
              visible={isAddAddressModalVisible}
              onOk={form.submit}
              onCancel={handleCancelAddAddress}
              cancelText="Hủy"
              okText="Lưu"
            >
              <Form
                labelCol={{
                  span: 7,
                }}
                wrapperCol={{
                  span: 16,
                }}
                layout="horizontal"
                size="default"
                form={form}
                onFinish={handleSubmitShippingInfo}
              >
                <Form.Item name="name" label="Họ và tên">
                  <Input placeholder="Nhập họ và tên..." />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại">
                  <Input placeholder="Nhập số điện thoại..." />
                </Form.Item>
                <Form.Item name="provinceCode" label="Tỉnh">
                  <Select
                    placeholder="Chọn tỉnh"
                    onChange={(value) => {
                      const [code, id, name] = value.split(".");
                      setProvince(+code);
                      setProvinceName(name);
                      handleGetDistrict(id);
                    }}
                  >
                    {provinceList.map(
                      (province) =>
                        province.Code === "8" && (
                          <Option
                            key={province.ProvinceID}
                            value={`${province.Code}.${province.ProvinceID}.${province.ProvinceName}`}
                          >
                            {province.ProvinceName}
                          </Option>
                        )
                    )}
                  </Select>
                </Form.Item>
                <Form.Item name="districtCode" label="Huyện">
                  <Select
                    placeholder="Chọn huyện"
                    onChange={(value) => {
                      const [code, id, name] = value.split(".");
                      setDistrict(+id);
                      setDistrictName(name);
                      handleGetWard(id);
                    }}
                  >
                    {districtList.map((district) => (
                      <Option
                        key={district.DistrictID}
                        value={`${district.Code}.${district.DistrictID}.${district.DistrictName}`}
                      >
                        {district.DistrictName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="wardCode" label="Xã">
                  <Select
                    placeholder="Chọn xã"
                    onChange={(value) => {
                      const [code, name] = value.split(".");
                      setWard(+code);
                      setWardName(name);
                    }}
                  >
                    {wardList.map((ward) => (
                      <Option
                        key={ward.WardCode}
                        value={`${ward.WardCode}.${ward.WardName}`}
                      >
                        {ward.WardName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="address" label="Địa chỉ chi tiết">
                  <Input placeholder="Nhập địa chỉ chi tiết..." />
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="Chọn địa chỉ giao hàng"
              visible={isChooseAddressModalVisible}
              onCancel={handleCancelChooseAddress}
              footer={false}
            >
              {addressList.length > 0 &&
                addressList.map((address) => (
                  <div
                    className="info-block choose-address"
                    style={{
                      border: "2px solid #c4c4c4",
                      marginBottom: "1rem",
                      padding: "0.5rem",
                      cursor: "pointer",
                    }}
                    key={address.shippingInfoId}
                    onClick={() => {
                      console.log({ address });
                      setShippingInfoId(address.shippingInfoId);
                      setChoosenAddress(address);
                      setIsChooseAddressModalVisible(false);
                    }}
                  >
                    <div>
                      <p className="username">
                        {address.name ? address.name : "Trần Nhật Hiệp"}
                      </p>
                      <p className="phone">{address.phoneNumber}</p>
                      <p className="address">{address.address}</p>
                    </div>
                  </div>
                ))}
            </Modal>
          </div>
          <div className="products-block">
            <div className="products-box">
              <div className="title">
                <div className="product">Sản phẩm</div>
                <div className="price">Đơn giá</div>
                <div className="quantity">Số lượng/Khối lượng</div>
                <div className="total">Thành tiền</div>
              </div>
              <div className="product-detail">
                {cartItems.map((item) => {
                  const {
                    productId,
                    image,
                    productName,
                    quantity,
                    totalPrice,
                    price,
                    weightServing,
                  } = item;
                  return (
                    <div className="single-item" key={productId}>
                      <div className="info">
                        <img src={image} alt={productName} />
                        <p style={{ fontSize: "1.2rem" }}>
                          {productName} ({weightServing})
                        </p>
                      </div>
                      <h3>
                        {price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h3>
                      <h3>{quantity}</h3>
                      <h3>
                        {totalPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="message-box">
              <div className="message">
                <p>Lời nhắn:</p>
                <input type="text" placeholder="Nhập lời nhắn..." />
              </div>
              <div className="deliver">
                <div className="title">
                  Dịch vụ giao hàng:
                  <Select
                    labelInValue
                    onChange={(value) => setChoosenService(value.value)}
                    bordered={false}
                  >
                    {services.length > 0 &&
                      services.map((service) => {
                        return (
                          <Option
                            key={service.service_id}
                            value={service.service_id}
                          >
                            {service.short_name === "Đi bộ"
                              ? "Giao hàng tiêu chuẩn"
                              : service.short_name}
                          </Option>
                        );
                      })}
                  </Select>
                </div>
              </div>
              <div className="shipping-fee">
                <p>
                  Phí vận chuyển:{" "}
                  {shippingFee.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
            <div className="payment-method-box">
              <div className="title">
                Hình thức thanh toán:{" "}
                <Select
                  labelInValue
                  defaultValue={{ value: 1 }}
                  onChange={(value) => {
                    setPaymentMethod(value.value);
                  }}
                  bordered={false}
                >
                  <Option value={1}>Thanh toán khi nhận hàng</Option>
                  <Option value={2}>Thanh toán trả trước</Option>
                </Select>
              </div>
            </div>
            <div className="total-box">
              <p className="total-payment">
                Tổng tiền:{" "}
                <span>
                  {(getTotalPrice(cartItems) + shippingFee).toLocaleString(
                    "vi-VN",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  )}
                </span>
              </p>
            </div>
          </div>
          <button className="btn confirm-btn" onClick={handleConfirm}>
            xác nhận
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;
