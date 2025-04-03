import React from "react";

const Controls = ({ onRotationChange }) => {
  const handleRotateLeft = () => {
    onRotationChange((prev) => prev - 45);
  };

  const handleRotateRight = () => {
    onRotationChange((prev) => prev + 45);
  };

  return (
    <div>
      <button onClick={handleRotateLeft}>Rotate Left</button>
      <button onClick={handleRotateRight}>Rotate Right</button>
    </div>
  );
};

export default Controls;