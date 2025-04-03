import React, { useRef, useEffect, useState } from "react";

const CanvasEditor = ({ imageFile, rotationAngle, flip }) => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (imageFile) {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        setImage(img);
      };
    }
  }, [imageFile]);

  useEffect(() => {
    if (image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Get screen size for scaling
      const maxWidth = window.innerWidth * 0.9;
      const maxHeight = window.innerHeight * 0.8;

      // Scale the image to fit within screen bounds
      let width = image.width;
      let height = image.height;
      const widthRatio = maxWidth / width;
      const heightRatio = maxHeight / height;
      const scaleRatio = Math.min(widthRatio, heightRatio, 1);

      width *= scaleRatio;
      height *= scaleRatio;

      // Adjust canvas size for rotation
      const radians = (rotationAngle * Math.PI) / 180;
      const cos = Math.abs(Math.cos(radians));
      const sin = Math.abs(Math.sin(radians));
      const canvasWidth = width * cos + height * sin;
      const canvasHeight = width * sin + height * cos;

      // Set canvas size
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Clear previous drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move origin to center, apply rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);

      // Apply flip based on state
      const flipX = flip.horizontal ? -1 : 1;
      const flipY = flip.vertical ? -1 : 1;
      ctx.scale(flipX, flipY);

      // Draw image at adjusted position
      ctx.drawImage(image, -width / 2, -height / 2, width, height);
      ctx.resetTransform();
    }
  }, [image, rotationAngle, flip]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
    </div>
  );
};

export default CanvasEditor;