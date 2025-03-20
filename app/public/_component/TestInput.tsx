"use client";
import { Input } from "@/components/ui/input";
import React from "react";

type Props = {
  register: any;
};

const TestInput = ({ register }: Props) => {
  return (
    <div>
      <Input
        {...register("testinput", { required: "This field is required" })}
      />
    </div>
  );
};

export default TestInput;
