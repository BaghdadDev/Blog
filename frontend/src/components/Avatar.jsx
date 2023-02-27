import React from "react";
import PropTypes from "prop-types";

Avatar.defaultProps = {
  size: 40,
};

Avatar.propTypes = {
  size: PropTypes.number,
  contentType: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

function Avatar({ contentType, data, filename, size, onClick }) {
  return (
    <img
      src={`data:${contentType};base64,${data}`}
      alt={filename}
      style={{ width: size }}
      className={`aspect-square rounded-full border-2 border-gray-200 ${
        onClick && "hover:cursor-pointer hover:brightness-50"
      }`}
      onClick={onClick}
    />
  );
}

export default Avatar;
