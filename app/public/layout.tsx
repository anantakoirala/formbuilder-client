"use client";
import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <div>{children}</div>
    </Provider>
  );
};

export default layout;
