import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const InputComponent = ({ typeInput }: { typeInput?: string }) => {
  if (typeInput === "select")
    return (
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Pilih Instansi" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Instansi</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  if (typeInput === "textarea")
    return <Textarea placeholder="Type your message here." />;

  if (typeInput === "radio")
    return (
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="docs" id="docs" />
          <Label htmlFor="docs">Dokumen</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pdf" id="pdf" />
          <Label htmlFor="pdf">PDF</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="image" id="image" />
          <Label htmlFor="image">Gambar</Label>
        </div>
      </RadioGroup>
    );

  if (typeInput === "formInput")
    return (
      <Input
        type="text"
        placeholder="Judul / Pertanyaan"
        className="rounded-none border-b-1 border-0"
      />
    );

  return <Input type="email" placeholder="Email" />;
};

export default InputComponent;
