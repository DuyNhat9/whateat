import React, { Component, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Button } from 'antd';

function Post({ steps }) {
  const user = useSelector((state) => state.auth.userInfo);
  const { submit, gender, pal, weight, height, year, allergy,person } = steps;
  // const [userObject] = useState({ submit, gender, pal, weight, height, year, allergy });
  const [userObject] = useState({
    // submit: submit.value,
    gender: gender.value,
    pal: pal.value,
    weight: weight.value,
    height: height.value,
    year: year.value,
    allergy: allergy.value,
    person: person.value,
  });
  useEffect(() => {
    console.log("userObject", userObject);
    axios({
      method: "put",
      url: `${process.env.REACT_APP_ASP_API_KEY}/api/Customer/update-calo-per-day`,
      data: userObject,
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        // window.location.href = '/recommender';
      })
      .catch((err) => {

      });
  }, [])

  return (
    <div>
    <h3>Thông tin người dùng</h3>
    <table className='table1'>
      <tbody>
        <tr>
          <td>Giới Tính</td>
          <td>{userObject.gender}</td>
        </tr>
        <tr>
          <td>Năm Sinh</td>
          <td>{userObject.year}</td>
        </tr>
        <tr>
          <td>Cân nặng</td>
          <td>{userObject.weight}</td>
        </tr>
        <tr>
          <td>Chiều cao</td>
          <td>{userObject.height}</td> 
        </tr>
        <tr>
        <td>Dị ứng</td>
          <td>{userObject.allergy}</td> 
        </tr>
        <tr>
        <td>Số người</td>
          <td>{userObject.person}</td> 
        </tr>
        <tr>
          <td>Mức độ hoạt động</td>
          <td>{userObject.pal}</td>
        </tr>
      </tbody>
    </table>
  </div>

    
  );
};

export default Post;