import React, { useRef, useEffect, useState } from "react";

const CanvasEditor = ({ imageFile, rotationAngle, flip, filter }) => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropArea, setCropArea] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [history, setHistory] = useState([]); // History stack

  useEffect(() => {
    if (imageFile) {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        setImage(img);
        saveToHistory({ img, rotation: 0, flip: { horizontal: false, vertical: false }, filter: "none" });
      };
    }
  }, [imageFile]);

  const imageToRender = croppedImage || image;

  useEffect(() => {
    if (imageToRender) {
      saveToHistory({ img: imageToRender, rotation: rotationAngle, flip, filter });
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

    const croppedImg = new Image();
    croppedImg.src = tempCanvas.toDataURL("image/png");
    croppedImg.onload = () => {
      saveToHistory({ img: croppedImg, rotation: rotationAngle, flip, filter });
      setCroppedImage(croppedImg);
    };

    setCropArea(null);
  };

  const saveToHistory = (state) => {
    setHistory((prev) => [...prev, state]);
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const lastState = newHistory[newHistory.length - 1];
      setCroppedImage(lastState.img);
      setHistory(newHistory);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "edited-image.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-6">
      <div className="relative bg-white p-4 shadow-xl rounded-lg">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-700 cursor-crosshair rounded-lg shadow-lg hover:shadow-2xl transition-all duration-200 ease-in-out"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></canvas>
      </div>

      <div className="mt-6 flex space-x-6">
        <button
          onClick={downloadImage}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 active:scale-105 transition-all duration-200 ease-in-out"
        >
          Download Image
        </button>
        <button
          onClick={cropImage}
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500 active:scale-105 transition-all duration-200 ease-in-out"
          disabled={!cropArea || cropArea.width === 0 || cropArea.height === 0}
        >
          Crop Image
        </button>
        <button
          onClick={undo}
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-500 active:scale-105 transition-all duration-200 ease-in-out"
          disabled={history.length <= 1}
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default CanvasEditor;