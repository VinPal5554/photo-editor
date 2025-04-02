import React from "react";

const Controls = ({ onRotationChange }) => {
  const handleRotateLeft = () => {
    onRotationChange((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    onRotationChange((prev) => prev + 90);
  };

  return (
    <div>
      <button onClick={handleRotateLeft}>Rotate Left</button>
      <button onClick={handleRotateRight}>Rotate Right</button>
    </div>
  );
};

export default Controls;