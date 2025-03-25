"use client";
import React, { useEffect, useState } from "react";
import { BlockPicker, ChromePicker, SketchPicker } from "react-color";
import { HexColorPicker } from "react-colorful";

type Props = {};

const FormSettings = (props: Props) => {
  const [color, setColor] = useState("#000"); // Default color is black
  const [isPickerOpen, setIsPickerOpen] = useState(false); // State to control visibility of the picker

  // Handle color change
  const handleChangeComplete = (color: any) => {
    console.log("color", color);
    setColor(color); // Update the color state with the selected color
    setIsPickerOpen(false);
  };

  const togglePicker = () => {
    setIsPickerOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log("state color", color);
  }, [color]);
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-3 w-full">
        <div className="w-full flex flex-row h-14 p-2 items-center justify-between ">
          <div className="text-[13px] text-card-foreground font-medium">
            Background
          </div>
          <div className="relative">
            <div
              className="w-4 h-4 cursor-pointer border border-black" // Add a border to make sure it's visible
              style={{ backgroundColor: color }}
              onClick={togglePicker}
            />
            {isPickerOpen && (
              <div className="absolute top-4 right-0">
                <HexColorPicker color={color} onChange={handleChangeComplete} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSettings;
