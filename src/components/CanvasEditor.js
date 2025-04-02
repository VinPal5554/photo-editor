import React, { useRef, useEffect, useState } from "react";

const CanvasEditor = ({ imageFile, rotationAngle }) => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [scaledImage, setScaledImage] = useState(null);

  // Set the canvas size to take up most of the screen
  const maxWidth = window.innerWidth * 0.9;  // 90% of the window width
  const maxHeight = window.innerHeight * 0.8; // 80% of the window height

  // Function to scale the image based on maxWidth and maxHeight while maintaining aspect ratio
  const scaleImage = (img) => {
    let width = img.width;
    let height = img.height;

    // Calculate scale ratio based on the max bounds, keeping the aspect ratio
    const widthRatio = maxWidth / width;
    const heightRatio = maxHeight / height;
    const scaleRatio = Math.min(widthRatio, heightRatio); // Ensure proportional scaling

    // If scale ratio is smaller than 1, scale the image
    if (scaleRatio < 1) {
      width = width * scaleRatio;
      height = height * scaleRatio;
    }

    setScaledImage({ width, height, image: img });
  };

  useEffect(() => {
    const loadImage = () => {
      if (imageFile) {
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
        img.onload = () => {
          setImage(img);
          scaleImage(img);  // Scale the image to fit within the max dimensions
        };
      }
    };

    loadImage();
  }, [imageFile]);

  useEffect(() => {
    if (scaledImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas size to scaled image size or max dimensions if necessary
      canvas.width = scaledImage.width;
      canvas.height = scaledImage.height;

      // Clear the canvas before drawing the new image
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move the canvas origin to the center for proper rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Rotate the image by the given angle
      ctx.rotate((rotationAngle * Math.PI) / 180);

      // Draw the image on the canvas after rotation
      ctx.drawImage(
        scaledImage.image,
        -scaledImage.width / 2,
        -scaledImage.height / 2
      );

      // Reset the canvas transformation matrix
      ctx.resetTransform();
    }
  }, [scaledImage, rotationAngle]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <canvas ref={canvasRef} style={{ maxWidth: "100%", maxHeight: "100%" }}></canvas>
    </div>
  );
};

export default CanvasEditor;