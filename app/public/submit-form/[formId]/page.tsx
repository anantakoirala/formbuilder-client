"use client";
import React, { useEffect, useState } from "react";
import PublicPageComponent from "../../_component/PublicPageComponent";
import { useParams } from "next/navigation";
import { useLazyGetPublicFormQuery } from "@/redux/form/formApi";
import { FormBlockInstance } from "@/types/FormCategory";
import NotAvailable from "../../_component/NotAvailable";
import FormSubmitComponent from "../../_component/FormSubmitComponent";
import TestInput from "../../_component/TestInput";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

type Props = {};

const Page = (props: Props) => {
  const [trigger, { data, isLoading, isError }] = useLazyGetPublicFormQuery();
  const [formData, setFormData] = useState<FormBlockInstance[]>([]);

  const { formId } = useParams();

  useEffect(() => {
    if (formId) {
      trigger({ id: formId });
    }
  }, [trigger, formId]);

  useEffect(() => {
    if (data !== undefined) {
      console.log("data", data);
      setFormData(data.form.jsonBlocks);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <NotAvailable />; // Show "Not Found" if error or no data
  }

  if (!data) {
    return <div>Loading</div>;
  }

  return (
    <div>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <TestInput register={register} />
        <Button type="submit">Submit</Button>
      </form> */}
      <FormSubmitComponent formId={formId as string} blocks={formData} />
    </div>
  );
};

export default Page;
