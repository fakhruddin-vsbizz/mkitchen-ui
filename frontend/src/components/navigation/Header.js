import React from "react";
import { colorGreen, valueShadowBox } from "../../colors";

const Header = ({ title,subTitle, comp }) => {
  return (
    <div
      style={{
        padding: "0.3% 3%",
          margin: "1%",
        //  borderBottom: "2px solid #E86800",
        boxShadow: valueShadowBox,
        borderRadius: 10, 
        color: "white",
        backgroundColor: colorGreen,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ width:'50%' , fontFamily: 'Helvetica', fontWeight: 100}}>
        <h1>{title}</h1>
        <p style={{textAlign: 'center'}}>{subTitle}</p>
      </div>
      <div  style={{ height: "100%", width:'50%' , marginTop: 25, textAlign: "end" }}>
        {comp}
      </div>
    </div>
  );
};

export default Header;
