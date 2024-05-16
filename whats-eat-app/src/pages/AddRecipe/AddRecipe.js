import { Form, Input, Row, Col, Image, Select, Modal, message } from "antd";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Dish from "../../components/Dish/Dish";
import "./AddRecipe.css";

const { TextArea } = Input;
const { Option } = Select;

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

const DoneIngreButton = ({ onDoneIngre }) => {
  const [isDone, setIsDone] = useState(false);
  return (
    <button
      className={`btn done-btn${isDone ? " disable" : ""}`}
      onClick={() => {
        if (!isDone) {
          console.log("done");
          setIsDone(true);
          onDoneIngre();
        } else return;
      }}
      disabled={isDone}
    >
      {isDone ? "Đã thêm" : "Thêm"}
    </button>
  );
};
const DoneButton = ({ onDone, disable }) => {
  const [isDone, setIsDone] = useState(false);
  console.log(disable);
  return (
    <button
      className={`btn done-btn${isDone || disable ? " disable" : ""}`}
      onClick={() => {
        if (!isDone) {
          setIsDone(true);
          onDone();
        } else return;
      }}
      disabled={disable}
    >
      {isDone ? "Đã xong bước" : "Xong bước"}
    </button>
  );
};

const AddRecipe = () => {
  const [stepImage, setStepImage] = useState();
  const [thumbImage, setThumbImage] = useState("");
  const [form] = Form.useForm();
  const [steps, setSteps] = useState(["textarea"]);
  const [ingredients, setIngredients] = useState(["ingredient"]);
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientList, setIngredientList] = useState([]);
  const [stepsContent, setStepsContent] = useState("");
  const [stepsRecipe, setStepsRecipe] = useState([]);
  const [data, setData] = useState();
  const [myRecipes, setMyRecipes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [deleteRecipeId, setDeleteRecipeId] = useState();
  const [isDisableAddIngre, setIsDisableAddIngre] = useState(true);
  const [isDisableAddStep, setIsDisableAddStep] = useState(true);
  const [disableDoneStep, setDisableDoneStep] = useState(true);
  const [triggerReload, setTriggerReload] = useState(true);
  const token = useSelector((state) => state.auth.userInfo.token);

  const uploadThumbImage = (value) => {
    const formData = new FormData();
    formData.append("file", value);
    formData.append("upload_preset", "utm6qcfl");

    axios
      .post(`https://api.cloudinary.com/v1_1/dexdbltsd/image/upload`, formData)
      .then((res) => {
        console.log("upload thanh cong");
        console.log(res.data.url);
        setThumbImage(res.data.url);
        form.setFieldsValue({ image: res.data.url });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const uploadStepImage = (value) => {
    const formData = new FormData();
    formData.append("file", value);
    formData.append("upload_preset", "utm6qcfl");

    axios
      .post(`https://api.cloudinary.com/v1_1/dexdbltsd/image/upload`, formData)
      .then((res) => {
        setStepImage(res.data.url);
        setDisableDoneStep(false);
      })
      .catch((err) => {
        message.error("Upload ảnh thất bại!");
        console.log(err);
      });
  };

  const handleAddIngredient = () => {
    setIngredients((prevIngre) => [...prevIngre, "ingredient"]);
    setIsDisableAddIngre(true);
  };

  const handleAddStep = () => {
    setStepImage();

    setSteps((prevSteps) => [...prevSteps, "textarea"]);
    setIsDisableAddStep(true);
    setDisableDoneStep(true);
  };

  const handleDoneIngre = () => {
    setIngredientList((preIngre) => [
      ...preIngre,
      {
        unit: { unit: "Gr", value: 0 },
        name: ingredientName,
        quantity: ingredientQuantity,
      },
    ]);
    setIsDisableAddIngre(false);
  };

  const handleDoneBtn = () => {
    setStepsRecipe((prevArr) => [
      ...prevArr,
      {
        content: stepsContent,
        photos: [[{ url: stepImage, height: 0, width: 0 }]],
      },
    ]);
    setIsDisableAddStep(false);
  };

  const onFormFinish = (values) => {
    setData({
      ...values,
      serving: +values.serving,
      totalTime: +values.totalTime,
      thumbnailUrl: `[[{ "url": "${thumbImage}", "height": "0", "width": "0" }]]`,
    });
  };

  const handleAddRecipe = () => {
    const payloadData = {
      ...data,
      ingredients: JSON.stringify(ingredientList),
      recipeTypeIds: data.recipeTypeIds.map((typeId) => +typeId),
      steps: JSON.stringify(stepsRecipe),
    };

    console.log(payloadData);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/recipe`,
      headers: { Authorization: `Bearer ${token}` },
      data: payloadData,
    })
      .then((res) => {
        message.success("Thêm công thức thành công");
        setTriggerReload(!triggerReload);
        form.resetFields();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteRecipe = (e, recipeId) => {
    e.stopPropagation();
    setIsVisible(true);
    setDeleteRecipeId(recipeId);
  };

  const confirmDelete = () => {
    axios({
      method: "delete",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/recipe/${deleteRecipeId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        message.success("Xóa công thức thành công!");
        setTriggerReload(!triggerReload);
        setIsVisible(false);
      })
      .catch((error) => {
        message.error("Xóa công thức thất bại!");
        console.log(error);
      });
  };

  useEffect(() => {
    axios({
      method: "Get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/own-recipes`,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setMyRecipes(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [triggerReload]);

  return (
    <div className="add-recipe">
      <div className="add-recipe-fluid">
        <div className="add-recipe-container">
          <div className="content-container">
            <h1 className="title">Thêm công thức nấu ăn</h1>
            <p className="note">
              Tự tay thêm công thức và những bí kíp nấu ăn của riêng bạn
            </p>
            <div className="basic-info">
              <h3>Điền các thông tin bên dưới để thêm công thức</h3>
              <div className="detail-info">
                <div className="register-form">
                  <Form
                    {...layout}
                    name="nest-messages"
                    validateMessages={validateMessages}
                    form={form}
                    onFinish={onFormFinish}
                  >
                    <Form.Item
                      className="input"
                      name="name"
                      label="Tên món ăn"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="Nhập tên món ăn..." />
                    </Form.Item>
                    <Form.Item
                      className="input"
                      name="serving"
                      label="Khẩu phần"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Nhập khẩu phần..."
                        className="recipe-input"
                        type="number"
                      />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="recipeTypeIds"
                      label="Loại món ăn"
                      rules={[{ required: true }]}
                    >
                      <Select mode="multiple" placeholder="Chọn loại món ăn">
                        <Option value="1">Món khai vị</Option>
                        <Option value="2">Món tráng miệng</Option>
                        <Option value="3">Món chay</Option>
                        <Option value="4">Món chính</Option>
                        <Option value="5">Món ăn sáng</Option>
                        <Option value="6">Món nhanh và dễ</Option>
                        <Option value="7">Thức uống</Option>
                        <Option value="8">Bánh-Bánh ngọt</Option>
                        <Option value="9">Món ăn cho trẻ</Option>
                        <Option value="10">Món nhậu</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="description"
                      label="Mô tả món ăn"
                    >
                      <Input.TextArea placeholder="Nhập mô tả món ăn..." />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="totalTime"
                      label="Thời gian nấu (phút)"
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Nhập tổng thời gian (số phút) nấu..."
                        className="recipe-input"
                        type="number"
                      />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="ingredients"
                      label="Nguyên liệu"
                    >
                      <>
                        {ingredients.map((item, idx) => (
                          <div className="ingredient-box" key={idx}>
                            <Input
                              placeholder="Nhập tên nguyên liệu"
                              onChange={(e) =>
                                setIngredientName(e.target.value)
                              }
                            />
                            <Input
                              type="number"
                              placeholder="Nhập trọng lượng (gr)"
                              onChange={(e) =>
                                setIngredientQuantity(e.target.value)
                              }
                            />
                            <DoneIngreButton onDoneIngre={handleDoneIngre} />
                          </div>
                        ))}
                        <button
                          className={`btn${
                            isDisableAddIngre ? " disable" : ""
                          }`}
                          style={{ float: "right" }}
                          disabled={isDisableAddIngre}
                          onClick={handleAddIngredient}
                        >
                          Thêm nguyên liệu
                        </button>
                      </>
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="thumbnailUrl"
                      label="Hình minh họa"
                    >
                      <Input
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => {
                          uploadThumbImage(e.target.files[0]);
                        }}
                      />
                      <Image width={200} src={thumbImage} />
                    </Form.Item>

                    <Form.Item
                      className="input"
                      name="steps"
                      label="Các bước nấu ăn"
                    >
                      <>
                        {steps.map((step, idx) => {
                          return (
                            <div className="single-step" key={idx}>
                              <p style={{ fontWeight: "bold" }}>
                                Bước {idx + 1}
                              </p>
                              <TextArea
                                placeholder={`Nhập bước ${idx + 1}`}
                                onChange={(e) =>
                                  setStepsContent(e.target.value)
                                }
                              />
                              <Input
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                onChange={(e) => {
                                  uploadStepImage(e.target.files[0]);
                                }}
                              />

                              <DoneButton
                                disable={disableDoneStep}
                                onDone={handleDoneBtn}
                              />
                            </div>
                          );
                        })}
                        <button
                          className={`btn add-step-btn${
                            isDisableAddStep ? " disable" : ""
                          }`}
                          disabled={isDisableAddStep}
                          onClick={handleAddStep}
                        >
                          Thêm bước
                        </button>
                      </>
                    </Form.Item>
                    <Form.Item
                      className="input"
                      wrapperCol={{ ...layout.wrapperCol, offset: 8 }}
                    >
                      <button
                        className="btn submit-btn"
                        onClick={handleAddRecipe}
                      >
                        Lưu thông tin
                      </button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-recipes">
        <h1>Công thức của bạn</h1>
        {myRecipes.length === 0 && <p>Bạn chưa có công thức nấu ăn nào!</p>}
        <Row gutter={[16, 16]}>
          {myRecipes.length > 0 &&
            myRecipes.map((dish) => {
              return (
                <>
                  {dish.status && (
                    <Col span={6} key={dish.recipeId} className="dish-col">
                      <div className="dish-box-container">
                        <Dish {...dish} />
                        <FaTrash
                          className="icon-delete"
                          onClick={(e) => handleDeleteRecipe(e, dish.recipeId)}
                        />
                      </div>
                    </Col>
                  )}
                </>
              );
            })}
        </Row>
      </div>
      <Modal
        title="Xóa sản phẩm"
        visible={isVisible}
        onOk={() => confirmDelete()}
        onCancel={() => setIsVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc muốn xóa sản phẩm này không?</p>
      </Modal>
      <Footer />
    </div>
  );
};

export default AddRecipe;
