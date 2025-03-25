"use client";
import { Button } from "@/components/ui/button";
import { FormBlocks } from "@/lib/form-blocks";
import { useSubmitFormMutation } from "@/redux/form/formApi";
import { FormBlockInstance } from "@/types/FormCategory";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  formId: string;
  blocks: FormBlockInstance[];
};

const FormSubmitComponent = ({ formId, blocks }: Props) => {
  const [saveFormResponse, { isError, isLoading, isSuccess }] =
    useSubmitFormMutation();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formVals = useRef<{ [key: string]: string }>({});
  const [thankyou, setThankyou] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm({ mode: "onBlur" });
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    control,
  } = form;

  // const validateFields = () => {
  //   const errors: { [key: string]: string } = {};
  //   blocks.forEach((block) => {
  //     if (!block.childBlocks) return;
  //     block.childBlocks?.forEach((childblock) => {
  //       const required = childblock.attributes?.required;
  //       const blockValue = formVals.current?.[childblock.id]?.trim();

  //       // Check if field is required and empty
  //       if (required && (!blockValue || blockValue.trim() === "")) {
  //         errors[childblock.id] = "This Field is required";
  //       }
  //     });
  //   });
  //   setFormErrors(errors); // Update state with errors
  //   return Object.keys(errors).length === 0; // Return true if no errors
  // };

  // const handleBlur = (key: string, value: string) => {
  //   formVals.current[key] = value;

  //   if (formErrors[key] && value?.trim() !== "") {
  //     setFormErrors((prevErrors) => {
  //       const updatedErrors = { ...prevErrors };
  //       delete updatedErrors[key]; // Remove the key from errors
  //       return updatedErrors;
  //     });
  //   }
  // };
  const handleSubmitForm = async (data: any) => {
    try {
      console.log("formsubmit", data);

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key] instanceof FileList) {
          console.log(`Appending files for key: ${key}`, data[key]); // Debugging
          Array.from(data[key]).forEach((file) => {
            formData.append(key, file);
          });
        } else if (data[key] !== undefined && data[key] !== null) {
          // Ensure non-file values exist before appending
          console.log("key", key);
          formData.append(key, data[key].toString());
        }
      });

      formData.append("formId", formId);

      // console.log("Final FormData before sending:", formData);

      // formData.append("formId", formId);
      const response = await saveFormResponse(formData).unwrap();
      console.log("response", response);
      if (response.success) {
        setThankyou(true);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log("error", error);
    }
  };

  const redirectToLogin = () => {
    router.push("/login");
  };
  return (
    <div className="w-full h-full overflow-y-auto pt-3 transition-all duration-300">
      <div className="w-full h-full max-w-[650px] mx-auto">
        {thankyou ? (
          <>
            <div className="w-full h-96 mt-16 flex flex-row items-center justify-center">
              <Card className="w-full bg-white">
                <CardHeader>
                  <CardTitle></CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                  <div className="w-full h-full flex flex-col items-center">
                    <div>
                      <Image
                        alt="thankyou"
                        src={"/thankyou.png"}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="text-4xl font-extrabold">Thank You !</div>
                    <div className="text-muted-foreground">
                      Your submission has been received
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex flex-row items-center justify-between">
                    <div className="text-muted-foreground tracking-tighter text-[14px]">
                      Now you can create your own form
                    </div>
                    <div>
                      <Button onClick={() => redirectToLogin()}>
                        Create your own
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="w-full relative bg-transparent px-2 flex flex-col items-center justify-start pt-1 pb-14 ">
              <div className="w-full mb-3 bg-white bg-[url(/form-bg.jpg)] bg-center bg-cover bg-no-repeat border shadow-sm h-[135px] max-w-[768px] rounded-md px-1"></div>
              <div className="w-full h-auto">
                <form
                  onSubmit={handleSubmit(handleSubmitForm)}
                  encType="multipart/form-data"
                >
                  {/* <input type="file" {...register("file")} /> */}
                  <div className="flex flex-col w-full gap-4">
                    {blocks.map((block) => {
                      const FormBlockComponent =
                        FormBlocks[block.blockType].publicFormComponent;
                      return (
                        <FormBlockComponent
                          key={block.id}
                          blockInstance={block}
                          register={register}
                          errors={errors}
                          trigger={trigger}
                          control={control}
                        />
                      );
                    })}
                  </div>
                  <div className="w-full mt-4">
                    <Button className="bg-primary" type="submit">
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormSubmitComponent;
