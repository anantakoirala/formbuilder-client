"use client";
import React, { useState } from "react";
import { SidebarProvider } from "./ui/sidebar";
import Builder from "./Builder";
import { DndContext, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import BuilderDragOverLay from "./BuilderDragOverLay";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import BuilderBlockProperties from "./BuilderBlockProperties";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { closeSheet, openSheet } from "@/redux/properties/PropertiesSlice";
import SmallBlockPropertyBox from "./SmallBlockPropertyBox";

type Props = {};

const FormBuilder = (props: Props) => {
  const dispatch = useDispatch();
  const { isSheetOpen } = useSelector((state: RootState) => state.properties);
  const [isSideBarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
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
          <Sheet
            open={isSheetOpen}
            onOpenChange={(open) => {
              if (open) {
                dispatch(openSheet());
              } else {
                dispatch(closeSheet());
              }
            }}
          >
            <SheetContent>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <SmallBlockPropertyBox />
            </SheetContent>
          </Sheet>
        </SidebarProvider>
      </DndContext>
    </div>
  );
};

export default FormBuilder;
