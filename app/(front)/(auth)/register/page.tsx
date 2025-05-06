"use client";
import { restApi } from "@/api";
import { handleApiError } from "@/lib/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type Props = {};
const formSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(5).nonempty("Password is required"), // Ensures password is not empty,
    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error will be attached to confirmPassword
  });

const Page = (props: Props) => {
  const route = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await restApi.post("/api/auth/signup", data);

      toast.success(response?.data?.message);
      route.push("/login");

      console.log("data", data);
    } catch (error) {
      handleApiError(error);
    }
  };
  return (
    <div className="mt-10 ">
      <h1 className="lg:text-5xl text-3xl text-center font-extrabold">
        Create Your Account
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
        <div className="mt-4">
          <input
            placeholder="Username"
            type="text"
            className="w-full bg-[#EFF0EB] text-gray-800 border-2 rounded-xl py-3.5 px-3 placeholder-gray-500 focus:outline-none"
            {...register("name")}
          />
          {errors && errors.name && (
            <span className="text-red-600 text-sm">{errors?.name.message}</span>
          )}
        </div>
        <div className="mt-4">
          <input
            placeholder="Email"
            type="email"
            className="w-full bg-[#EFF0EB] text-gray-800 border-2 rounded-xl py-3.5 px-3 placeholder-gray-500 focus:outline-none"
            {...register("email")}
          />
          {errors && errors.email && (
            <span className="text-red-600 text-sm">
              {errors?.email.message}
            </span>
          )}
        </div>
        <div className="mt-4">
          <input
            placeholder="password"
            type="password"
            className="w-full bg-[#EFF0EB] text-gray-800 border-2 rounded-xl py-3.5 px-3 placeholder-gray-500 focus:outline-none"
            {...register("password")}
          />
          {errors && errors.password && (
            <span className="text-red-600 text-sm">
              {errors?.password.message}
            </span>
          )}
        </div>
        <div className="mt-4">
          <input
            placeholder="Confirm Password"
            type="password"
            className="w-full bg-[#EFF0EB] text-gray-800 border-2 rounded-xl py-3.5 px-3 placeholder-gray-500 focus:outline-none"
            {...register("confirmPassword")}
          />
          {errors && errors.confirmPassword && (
            <span className="text-red-600 text-sm">
              {errors?.confirmPassword.message}
            </span>
          )}
        </div>
        <div className="mt-10">
          <button
            className="rounded-full w-full p-3 font-bold bg-[#8228D9] hover:bg-[#6c21b3] text-white disabled:bg-[#EFF0EB] disabled:text-[#A7AAA2]"
            type="submit"
            disabled={
              !watch("email") ||
              !watch("password") ||
              !watch("name") ||
              !watch("confirmPassword")
            }
          >
            Register
          </button>
        </div>
      </form>
      <div className="text-[14px text-center pt-12] ">
        Already have an account?{" "}
        <Link href={"/login"} className="text-[#8228D9] underline">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Page;
