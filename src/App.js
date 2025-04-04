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
    <div>
      <h1 className="text-7xl text-center text-blue-200">Photo Editor</h1>
      <input type="file" onChange={handleImageUpload} />
      <Controls onRotationChange={setRotationAngle} onFlip={handleFlip} onFilterChange={setFilter}/>
      <CanvasEditor imageFile={imageFile} rotationAngle={rotationAngle} flip={flip} filter={filter}/>
    </div>
  );
};

export default App;