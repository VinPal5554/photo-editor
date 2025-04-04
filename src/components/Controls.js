import React from "react";

const Controls = ({ onRotationChange, onFlip, onFilterChange }) => {
  return (
    <div>

      <div class="flex space-x-4 justify-center">
        <button class="bg-blue-500 text-white p-2 rounded" onClick={() => onRotationChange((prev) => prev - 45)}>Rotate Left (-45°)</button>
        <button class="bg-blue-500 text-white p-2 rounded" onClick={() => onRotationChange((prev) => prev + 45)}>Rotate Right (+45°)</button>
        <button class="bg-blue-500 text-white p-2 rounded" onClick={() => onFlip("horizontal")}>Flip Horizontal</button>
        <button class="bg-blue-500 text-white p-2 rounded" onClick={() => onFlip("vertical")}>Flip Vertical</button>
      </div>

      {/* Filter Controls */}
      <div className="flex space-x-2">
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => onFilterChange("none")}>
          No Filter
        </button>
        <button className="bg-gray-700 text-white p-2 rounded" onClick={() => onFilterChange("grayscale(100%)")}>
          Grayscale
        </button>
        <button className="bg-orange-500 text-white p-2 rounded" onClick={() => onFilterChange("sepia(50%)")}>
          Sepia
        </button>
        <button className="bg-yellow-300 text-black p-2 rounded" onClick={() => onFilterChange("brightness(150%)")}>
          Brightness
        </button>
        <button className="bg-red-500 text-white p-2 rounded" onClick={() => onFilterChange("contrast(200%)")}>
          Contrast
        </button>
        <button className="bg-blue-300 text-black p-2 rounded" onClick={() => onFilterChange("blur(3px)")}>
          Blur
        </button>
      </div>

    </div>

  );
};

export default Controls