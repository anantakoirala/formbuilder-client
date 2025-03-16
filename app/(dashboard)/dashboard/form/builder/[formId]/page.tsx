"use client";
import FormBuilder from "@/components/FormBuilder";
import { useLazyGetFormQuery } from "@/redux/form/formApi";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const Page = (props: Props) => {
  const { formId } = useParams();
  const [trigger, { isLoading, data }] = useLazyGetFormQuery();

  useEffect(() => {
    if (formId) {
      trigger({ id: formId });
    }
  }, [trigger, formId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FormBuilder />
    </div>
  );
};

export default Page;
