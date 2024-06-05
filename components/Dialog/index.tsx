import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import InputComponent from "@/components/InputComponent";
import { AlertDialogPopupProps } from "@/type/type";

export function AlertDialogPopup({ title, content }: AlertDialogPopupProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-primary-700 hover:bg-primary-800 w-[140px] rounded-full">
          {title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 border-0 overflow-auto">
        <AlertDialogHeader className="bg-primary-700 px-9 py-6">
          <AlertDialogTitle className="font-normal text-neutral-50 text-2xl">
            Tambah Instansi
          </AlertDialogTitle>
        </AlertDialogHeader>
        {content}
        <AlertDialogFooter className="p-6">
          <AlertDialogCancel className="bg-transparent border border-primary-700 rounded-full hover:bg-primary-700 hover:text-neutral-50 text-primary-700">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction className="bg-primary-700 hover:bg-primary-800 rounded-full">
            Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
