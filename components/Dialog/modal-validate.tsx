import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import InputComponent from "@/components/InputComponent";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ModalValidate = ({ title, id }: { id: number; title: string }) => {
  const router = useRouter();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleValidationStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/inputform/updatestatus/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            status: 4,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        toast(data.message);
        handleAddModalClose();
        router.push("/request/online");
      }
    } catch (e: any) {
      toast(e.message);
    }
  };

  return (
    <Dialog open={addModalOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="bg-error-700 hover:bg-error-800 w-[140px] rounded-full"
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-error-700">
            Data user tidak sesuai?
          </DialogTitle>
          <DialogDescription>
            Silakan masukan catatan untuk user
          </DialogDescription>
        </DialogHeader>
        <InputComponent typeInput="textarea" />
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleAddModalClose}
              className="border border-error-700 hover:bg-error-700 hover:text-white text-error-700 bg-transparent rounded-full px-12"
            >
              Tutup
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleValidationStatus}
            className="bg-error-700 hover:bg-error-800 rounded-full px-12"
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalValidate;
