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

const ModalValidate = ({ title }: { title: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-error-700 hover:bg-error-800 w-[140px] rounded-full">
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
              className="bg-error-700 hover:bg-error-800 rounded-full px-12"
            >
              Ok
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalValidate;
