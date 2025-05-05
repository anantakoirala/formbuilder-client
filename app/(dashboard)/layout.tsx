"use client";
import Header from "@/components/Header";
import AuthProvider from "@/contextProviders/AuthProvider";
import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <div className="w-full ">
            <div className="">{children}</div>
          </div>
        </div>
      </AuthProvider>
    </Provider>
  );
};

export default layout;
