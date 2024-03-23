import React from "react";
import state from "../store";
import PropTypes from "prop-types";
import { useSnapshot } from "valtio";

const CustomButton = ({ title, type, customStyles, handleClick }) => {
  const snap = useSnapshot(state);
  const generateStyle = (type) => {
    if (type === "filled") {
      return {
        backgroundColor: snap.color,
        color: "#fff",
      };
    }
    if (type === "outline") {
      return {
        borderWidth: "1px",
        borderColor: "#3a86ff",
        color: "#3a86ff",
      };
    }
  };
  return (
    <button
      className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

CustomButton.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  customStyles: PropTypes.string,
  handleClick: PropTypes.func,
};
export default CustomButton;
