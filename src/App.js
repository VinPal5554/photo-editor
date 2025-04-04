import React, { useState } from "react";
import CanvasEditor from "./components/CanvasEditor";
import Controls from "./components/Controls";

const App = () => {
  const [imageFile, setImageFile] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  const [filter, setFilter] = useState("none");

  const handleImageUpload = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleFlip = (direction) => {
    setFlip((prevFlip) => ({
      ...prevFlip,
      [direction]: !prevFlip[direction], // Toggle flip state
    }));
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen">
      <h1 className="text-7xl text-center text-blue-200 mb-8">Photo Editor</h1>

      {/* Image Upload */}
      <div className="z-10 mb-4">
        <input
          type="file"
          onChange={handleImageUpload}
          className="p-2 bg-gray-200 rounded"
        />
      </div>

      {/* Canvas Editor */}
      <div className="relative w-full max-w-[800px] mb-8">
        <CanvasEditor
          imageFile={imageFile}
          rotationAngle={rotationAngle}
          flip={flip}
          filter={filter}
        />
      </div>

      {/* Controls Container */}
      <div className="absolute top-1/4 left-4 z-10 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-white text-xl mb-4">Controls</h3>

        <Controls
          onRotationChange={setRotationAngle}
          onFlip={handleFlip}
          onFilterChange={setFilter}
        />
      </div>
    </div>
  );
};

export default App;