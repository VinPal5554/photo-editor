import React, { useState } from "react";

const ImageUploader = ({ onImageUpload }) => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {image && <img src={image} alt="uploaded" style={{ width: "200px" }} />}
    </div>
  );
};

export default ImageUploader;