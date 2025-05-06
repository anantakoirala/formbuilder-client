import React, { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useDeleteFormMutation } from "@/redux/form/formApi";
import toast from "react-hot-toast";

type Props = {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  formId: number;
};

const DeleteFormDialog = ({ setOpenDialog, openDialog, formId }: Props) => {
  const [trigger, { isLoading }] = useDeleteFormMutation();
  const handleSubmit = async () => {
    try {
      await trigger({ id: formId }).unwrap();
      toast.success("Form deleted successfully");
      setOpenDialog(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <p className="text-sm text-muted-foreground tracking-tight">
            This action cannot be undone. This will permanently delete your form
            and all data associated with it.
          </p>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpenDialog(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            className="bg-red-700 text-white"
            onClick={() => handleSubmit()}
          >
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFormDialog;
