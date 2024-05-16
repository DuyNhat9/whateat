import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer/Footer";
import Recommender from "../../components/Recommender/Recommender";
import "./RecommendPage.css";
import ModalCalo from "../../components/ModalCalCalo/ModalCalo";
import { Tabs } from "antd";
const RecommendPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [kcal, setKcal] = useState(0);
  const [allergy, setAllergy] = useState("");
  const [menu, setMenu] = useState([]);
  const [menu1, setMenu1] = useState([]);
  const [key, setPage] = useState(1);
  const [level, setLevel] = useState("Mức độ");
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const user = useSelector((state) => state.auth.userInfo);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk = (gender, pal, weight, height, year, allergy,person) => {
    console.log(gender, pal, weight, height, year,person);
    const body = {
      gender: gender,
      pal: pal,
      weight: weight,
      height: height,
      year: year,
      allergy: allergy,
      person: person,
    };
    axios({
      method: "put",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/update-calo-per-day`,
      data: body,
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        setKcal(res.data.calo);
        setAllergy(res.data.allergy);
        if (res.data.calo > 0) {
          ListRecommend(res.data);
        }
      })
      .catch((err) => {});
    setIsModalVisible(false);
  };
  // const getRecommendedRecipe = (data) => {
  //   axios({
  //     method: "get",
      // url: `${process.env.REACT_APP_PYTHON_API_KEY}/individual/recipe/?id_user=${user.userId}&user_kcal=${data.calo}&n_recipe=16&page=${page}&level=${level}&mintime=${minTime}&maxtime=${maxTime}&allergy=${data.allergy}`,
  //   })
  //     .then((res) => {
  //       const result = res.data;
  //       setMenu(result);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const ListRecommend = (data) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Recipe/search?recipeTypes=${key}`,
    })
    .then((res) => {
      const result = res.data;
      setMenu(result);
    })
    .catch((error) => {
      console.log(error);
    });
};
  const onKeyChange = (key) => {
    setPage(key);
  };

  const onFilter = (level, minTime, maxTime) => {
    setLevel(level);
    setMaxTime(maxTime);
    setMinTime(minTime);
  };

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/get-calo-per-day`,
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        setKcal(res.data.calo);
        if (res.data.calo > 0) {
          ListRecommend(res.data);
        }
      })
      .catch((err) => {});
  }, [key, level, minTime, maxTime]);

  return (
    <div className="recommend">
      <Recommender
        kcal={kcal}
        menu={menu}
        setCurrentPage={onKeyChange}
        onFilter={onFilter}
      />
      <Footer />
      {kcal === 0 && (
        <ModalCalo
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default RecommendPage;
