"use client";
import React, { useState } from "react";
import { SidebarProvider } from "./ui/sidebar";
import Builder from "./Builder";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import BuilderDragOverLay from "./BuilderDragOverLay";

type Props = {};

const FormBuilder = (props: Props) => {
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  return (
    <div>
      <DndContext sensors={useSensors(mouseSensor)}>
        <BuilderDragOverLay />
        <SidebarProvider
          open={isSideBarOpen}
          onOpenChange={setIsSidebarOpen}
          className="h-[calc(100vh-64px)]"
          style={
            {
              "--sidebar-width": "300px",
              "--sidebar-height": "40px",
            } as React.CSSProperties
          }
        >
          <Builder isSideBarOpen={isSideBarOpen} />
        </SidebarProvider>
      </DndContext>
    </div>
  );
};

export default FormBuilder;
