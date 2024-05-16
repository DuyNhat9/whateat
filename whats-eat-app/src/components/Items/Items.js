import React, { useState, useContext } from "react";
import { useSelector } from "react-redux";
import "./Items.css";
import "antd/dist/antd.css";
import { Row, Col, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../../context/AppContext";
import Product from "../Product/Product";

const Items = ({ products, storeId }) => {
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    productId: 0,
  });
  const { triggerReload, setTriggerReload } = useContext(AppContext);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.userInfo.token);

  const onDeleteProduct = (productId) => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Store/${storeId}/product/${productId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setTriggerReload(!triggerReload);
        message.success("Xóa sản phẩm thành công!");
      })
      .catch((err) => {
        message.error("Xóa sản phẩm thất bại!");
        console.log(err);
      });
    setVisible(false);
  };

  const onCloseModal = () => {
    setVisible(false);
  };

  const showDeleteModal = (name, productId) => {
    setSelectedProduct({ name, productId });
    setVisible(true);
  };

  const onUpdateProduct = (productId) => {
    navigate(`/shop/items/update/${productId}`, {
      state: {
        storeId: storeId,
        productId: productId,
      },
    });
  };
  return (
    <div className="items-container">
      <div className="items">
        <Row gutter={[16, 16]}>
          {products.map((item) => {
            const { productId, name, status } = item;
            if (!status) return <></>;
            return (
              <Col span={6} className="item-col" key={productId}>
                <Product {...item} />
                <button
                  className="btn"
                  onClick={() => showDeleteModal(name, productId)}
                >
                  Xóa
                </button>
                <button
                  className="btn"
                  onClick={() => onUpdateProduct(productId)}
                >
                  Sửa
                </button>
              </Col>
            );
          })}
        </Row>
      </div>
      <Modal
        title="Xóa sản phẩm"
        visible={visible}
        onOk={() => onDeleteProduct(selectedProduct.productId)}
        onCancel={onCloseModal}
        okText="Đồng ý"
        cancelText="Hủy"
      >
        <p>Bạn có muốn xóa sản phẩm {selectedProduct.name}</p>
      </Modal>
    </div>
  );
};

export default Items;
