"use client";
import { useLazyGetPublicFormQuery } from "@/redux/form/formApi";
import { FormBlockInstance } from "@/types/FormCategory";
import React, { useEffect, useState } from "react";

type Props = {
  formId: string;
};

const PublicPageComponent = ({ formId }: Props) => {
  const [trigger, { data, isLoading, isError }] = useLazyGetPublicFormQuery();
  const [formData, setFormData] = useState<FormBlockInstance[]>([]);
  if (isLoading) {
    return <div>Loading</div>;
  }

  useEffect(() => {
    if (formId) {
      trigger({ id: formId });
    }
  }, [trigger, formId]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);
  return <div>PublicPageComponent</div>;
};

export default PublicPageComponent;
