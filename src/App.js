import React, { useState } from "react";
import CanvasEditor from "./components/CanvasEditor";
import Controls from "./components/Controls";

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  const handleImageUpload = (file) => {
    setImageFile(file);
  };

  const handleRotationChange = (newAngle) => {
    setRotationAngle(newAngle);
  };

  return (
    <div className="App">
      <h1>Photo Editor</h1>
      <Controls onRotationChange={handleRotationChange} />
      <CanvasEditor imageFile={imageFile} rotationAngle={rotationAngle} />
      <div>
        <input
          type="file"
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />
      </div>
    </div>
  );
}

export default App;