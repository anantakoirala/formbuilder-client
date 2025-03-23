"use client";
import CreateFormDialog from "@/components/CreateFormDialog";
import FormItem from "@/components/FormItem";
import StatsCards from "@/components/StatsCards";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLazyGetAllFormsQuery } from "@/redux/form/formApi";
import { Form } from "@/types/Form";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const [createFormDialogOpen, setCreateFormDialogOpen] =
    useState<boolean>(false);
  const [forms, setForms] = useState<Form[]>([]);
  const [trigger, { isError, isLoading, data }] = useLazyGetAllFormsQuery();
  useEffect(() => {
    trigger({});
  }, [trigger]);

  useEffect(() => {
    if (data) {
      console.log("data", data);
      setForms(data.forms);
    }
  }, [data]);
  return (
    <>
      <div className="w-full p-8 ">
        <div className="w-full max-w-6xl mx-auto px-2 md:px-0 pt-1">
          {/* Form Stats */}
          <section className="stats-section w-full">
            <div className="w-full flex items-center justify-between py-5">
              <h1 className="text-3xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <Button
                className="bg-primary font-medium gap-1"
                onClick={() => setCreateFormDialogOpen(true)}
              >
                <PlusIcon />
                Create a form
              </Button>
            </div>
            <StatsCards />
          </section>
          <div className="mt-10">
            <Separator className="border-[#eee] bg-primary" />
          </div>
          {/* All forms */}
          <section className="w-full pt-7 pb-10">
            <div className="w-full flex items-center mb-4">
              <h5 className="text-xl font-semibold tracking-tight">
                All Forms
              </h5>
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5 ">
              {forms.length > 0 &&
                forms.map((form, index) => (
                  <FormItem form={form} key={index} />
                ))}
            </div>
            {/* <div className="flex items-center justify-center">
              No form created
            </div> */}
          </section>
        </div>
      </div>
      {createFormDialogOpen && (
        <CreateFormDialog
          createFormDialogOpen={createFormDialogOpen}
          setCreateFormDialogOpen={setCreateFormDialogOpen}
        />
      )}
    </>
  );
};

export default Page;
