"use client";
import FormBuilder from "@/components/FormBuilder";
import { useLazyGetFormQuery } from "@/redux/form/formApi";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const Page = (props: Props) => {
  const { formId } = useParams();
  const router = useRouter();
  const [trigger, { isLoading, data, error, isError, isSuccess }] =
    useLazyGetFormQuery();

  useEffect(() => {
    if (formId) {
      trigger({ id: formId })
        .unwrap()
        .catch((err) => {
          if (err?.status === 404) {
            console.log("Form not found (404)");
            router.push("/dashboard");
          }
        });
    }
  }, [trigger, formId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <FormBuilder />
    </div>
  );
};

export default Page;
