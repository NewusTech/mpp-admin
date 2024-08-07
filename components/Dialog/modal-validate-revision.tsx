"use client";

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
import { Loader } from "lucide-react";
import Swal from "sweetalert2";

const ModalValidateRevision = ({
  title,
  id,
  state,
}: {
  id: number;
  title: string;
  state: any;
}) => {
  const router = useRouter();
  const [feedback, setFeedback] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleOpenAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleValidationStatus = async () => {
    setIsLoading(true);
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
            status: 5,
            pesan: feedback,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });
        handleAddModalClose();
        router.push("/request/online");
      }
    } catch (e: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal submit!",
        timer: 2000,
        showConfirmButton: false,
        position: "center",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Dialog open={addModalOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenAddModal}
          className="bg-warning-700 hover:bg-warning-800 w-[140px] rounded-full"
          disabled={state}
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-warning-700">
            Data user tidak sesuai?
          </DialogTitle>
          <DialogDescription>
            Silakan masukan catatan untuk user
          </DialogDescription>
        </DialogHeader>
        <InputComponent
          typeInput="textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disable={false}
        />
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleAddModalClose}
              className="border border-warning-700 hover:bg-warning-700 hover:text-white text-warning-700 bg-transparent rounded-full px-12"
            >
              Tutup
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleValidationStatus}
            className="bg-warning-700 hover:bg-warning-800 rounded-full px-12"
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loader className="animate-spin" /> : "Ok"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalValidateRevision;
