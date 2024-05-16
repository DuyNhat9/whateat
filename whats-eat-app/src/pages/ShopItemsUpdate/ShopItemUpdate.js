import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Form, Input, Button, Image } from "antd";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import ShopSidebar from "../../components/ShopSidebar/ShopSidebar";
import "./ShopItemUpdate.css";

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

const ShopItemUpdate = () => {
  const location = useLocation();
  const [image, setImage] = useState("");
  const [productDetail, setProductDetail] = useState({});
  const token = useSelector((state) => state.auth.userInfo.token);
  const [form] = Form.useForm();
  const storeId = location.state.storeId;
  const productId = location.state.productId;

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
      photoJson: JSON.stringify(newImage),
    });
    axios({
      method: "put",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/${storeId}/product/${productId}`, //TODO: Changle hard code into idProduct
      data: {
        ...values,
        photoJson: JSON.stringify(newImage),
      },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("update success");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Product/${productId}`, //TODO: Changle hard code into idProduct
    })
      .then((res) => {
        const result = res.data;
        console.log(res.data);
        setProductDetail(result);
        form.setFieldsValue({
          name: result.name,
          productCategoryId: result.productCategoryId,
          inStock: result.inStock,
          basePrice: result.basePrice,
          weightServing: result.weightServing,
          imageUrl: result.images[0][0].url,
          description: result.description,
        });
        console.log("ing", result.images[1].url);
        setImage(result.images[0][0].url);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="shop-items">
      <div className="shop-items-fluid">
        <div className="shop-items-container">
          <ShopSidebar />
          <div className="content-container">
            <h1 className="title">Cập nhật sản phẩm</h1>
            <div className="basic-info">
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
                      <Input
                        value={productDetail.name}
                        placeholder="Nhập tên sản phẩm..."
                      />
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
                      name="weightServing"
                      label="Khối lượng"
                      rules={[{ required: true }]}
                    >
                      <Input type="number" placeholder="Nhập khối lượng" />
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
                        Cập nhật sản phẩm
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

export default ShopItemUpdate;
