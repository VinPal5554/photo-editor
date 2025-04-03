import React from "react";

const Controls = ({ onRotationChange, onFlip }) => {
  return (
    <div class="flex space-x-4 justify-center">
      <button class="bg-blue-500 text-white p-2 rounded" onClick={() => onRotationChange((prev) => prev - 45)}>Rotate Left (-45°)</button>
      <button class="bg-blue-500 text-white p-2 rounded" onClick={() => onRotationChange((prev) => prev + 45)}>Rotate Right (+45°)</button>
      <button class="bg-blue-500 text-white p-2 rounded" onClick={() => onFlip("horizontal")}>Flip Horizontal</button>
      <button class="bg-blue-500 text-white p-2 rounded" onClick={() => onFlip("vertical")}>Flip Vertical</button>
    </div>
  );
};

export default Controls