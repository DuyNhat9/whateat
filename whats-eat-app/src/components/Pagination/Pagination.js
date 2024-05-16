import React from "react";
import "./Pagination.css";

import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

const Pagination = ({ onClickNext, onClickPrev }) => {
  return (
    <div className="pagination">
      <button className="pagination-btn" onClick={onClickPrev}>
        <AiOutlineArrowLeft />
        Trang trước
      </button>
      <button className="pagination-btn" onClick={onClickNext}>
        Trang tiếp
        <AiOutlineArrowRight />
      </button>
    </div>
  );
};

export default Pagination;
