import React, { useRef, useEffect, useState } from "react";

const CanvasEditor = ({ imageFile, rotationAngle, flip, filter }) => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null); // Original image
  const [croppedImage, setCroppedImage] = useState(null); // Cropped image
  const [cropArea, setCropArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

  useEffect(() => {
    if (imageFile) {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        setImage(img);
      };
    }
  }, [imageFile]);

  // Decide whether to use the original image or the cropped image
  const imageToRender = croppedImage || image;

  useEffect(() => {
    if (imageToRender) {
      drawImageOnCanvas();
    }
  }, [imageToRender, rotationAngle, flip, filter]);

  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.8;

    let width = imageToRender.width;
    let height = imageToRender.height;
    const scaleRatio = Math.min(maxWidth / width, maxHeight / height, 1);

    width *= scaleRatio;
    height *= scaleRatio;

    const radians = (rotationAngle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));
    const canvasWidth = width * cos + height * sin;
    const canvasHeight = width * sin + height * cos;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);

    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.filter = filter;
    ctx.drawImage(imageToRender, -width / 2, -height / 2, width, height);
    ctx.resetTransform();
    ctx.filter = "none";

    // Draw the crop area (if exists)
    if (cropArea && cropArea.width > 0 && cropArea.height > 0) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(cropArea.x, cropArea.y, cropArea.width, cropArea.height);
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsCropping(true);
  };

  const handleMouseMove = (e) => {
    if (!isCropping || !startPoint) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropArea({
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y),
    });

    // Force canvas update to show crop area immediately
    drawImageOnCanvas();
  };

  const handleMouseUp = () => {
    setIsCropping(false);
  };

  const cropImage = () => {
    if (!cropArea || cropArea.width <= 0 || cropArea.height <= 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = cropArea.width;
    tempCanvas.height = cropArea.height;

    tempCtx.drawImage(
      canvas,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    // Save cropped image to state
    const croppedImg = new Image();
    croppedImg.src = tempCanvas.toDataURL("image/png");
    croppedImg.onload = () => {
      setCroppedImage(croppedImg); // Update the cropped image state
    };

    setCropArea(null); // Clear crop area after cropping
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "edited-image.png";
    link.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", cursor: "crosshair" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>

      <div style={{ marginTop: "10px" }}>
        <button onClick={downloadImage} style={{ margin: "5px", padding: "8px 16px", cursor: "pointer" }}>
          Download Image
        </button>
        <button
          onClick={cropImage}
          style={{ margin: "5px", padding: "8px 16px", cursor: "pointer" }}
          disabled={!cropArea || cropArea.width === 0 || cropArea.height === 0}
        >
          Crop Image
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;