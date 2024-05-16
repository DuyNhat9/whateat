import { Form, Input, Button, Image, message } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer/Footer";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import "./ShopAddItem.css";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "Vui lòng nhập ${label}!",
  types: {
    email: "${label} không hợp lệ!",
    number: "${label} không hợp lệ!",
  },
};

const ShopAddItem = () => {
  const [image, setImage] = useState("");
  const token = useSelector((state) => state.auth.userInfo.token);
  const [form] = Form.useForm();
  const location = useLocation();
  const storeId = location.state.storeId;

  const uploadImage = (value) => {
    const formData = new FormData();
    formData.append("file", value);
    formData.append("upload_preset", "utm6qcfl");

    axios
      .post(`https://api.cloudinary.com/v1_1/dexdbltsd/image/upload`, formData)
      .then((res) => {
        console.log("upload thanh cong");
        console.log(res.data.url);
        setImage(res.data.url);
        form.setFieldsValue({ image: res.data.url });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFormFinish = (values) => {
    const newImage = [[{ url: image, height: 0, width: 0 }]];
    console.log({
      ...values,
      image: JSON.stringify(newImage),
    });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/add-product`,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        ...values,
        imageUrl: `[[{ "url": "${image}", "height": "0", "width": "0" }]]`,
        productCategoryId: 1,
        storeId: storeId,
      },
    })
      .then((res) => {
        message.success("Thêm sản phẩm thành công!");
        form.resetFields();
      })
      .catch((err) => {
        message.error("Thêm sản phẩm thất bại!");
        console.log(err);
      });
  };

  return (
    <div className="shop-add-item">
      <div className="shop-add-item-fluid">
        <div className="shop-add-item-container">
          <ShopSidebar storeId={storeId} />
          <div className="content-container">
            <h1 className="title">Thêm sản phẩm</h1>
            <p className="note">
              Thêm sản phẩm mới và bán hàng cùng với WhatsEat!
            </p>
            <div className="basic-info">
              <h3>Thông tin sản phẩm</h3>
              <div className="detail-info">
                <div className="register-form">
                  <Form
                    {...layout}
                    name="nest-messages"
                    validateMessages={validateMessages}
                    onFinish={onFormFinish}
                    form={form}
                  >
                    <Form.Item
                      className="input"
                      name="name"
                      label="Tên sản phẩm"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Nhập tên sản phẩm..." />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="productCategoryId"
                      label="Loại hàng"
                      rules={[{ required: true }]}
                    >
                      <Input type="number" placeholder="Nhập loại hàng" />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="inStock"
                      label="Hàng còn"
                      rules={[{ required: true }]}
                    >
                      <Input type="number" />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="basePrice"
                      label="Giá sản phẩm"
                      rules={[{ required: true }]}
                    >
                      <Input type="number" placeholder="Nhập giá sản phẩm..." />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="imageUrl"
                      label="Hình minh họa"
                    >
                      <Input
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => {
                          uploadImage(e.target.files[0]);
                        }}
                      />
                      <Image width={200} src={image} />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="description"
                      label="Mô tả sản phẩm"
                    >
                      <Input.TextArea placeholder="Nhập mô tả..." />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                    >
                      <Button className="btn submit-btn" htmlType="submit">
                        Thêm sản phẩm
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopAddItem;
