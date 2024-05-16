import React from "react";
import "./Guide.css";

const Guide = ({ steps }) => {
  return (
    <div className="guide-container">
      <h1 className="title">Hướng dẫn thực hiện</h1>
      <div className="guide-box">
        {steps.map((step, idx) => {
          const { content, photos } = step;
          return (
            <div className="step-container" key={idx}>
              <span className="step-number">{idx + 1}.</span>
              <div className="step-content">
                <p>{content}</p>
                {
                  <div className="img-box">
                    {photos?.map((image, idx) => {
                      return (
                        <div className="img" key={idx}>
                          {image[0].url && (
                            <img
                              src={image[0].url ? image[0].url : ""}
                              alt="whatseat"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Guide;
