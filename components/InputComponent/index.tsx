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

const InputComponent = ({ typeInput }: { typeInput?: string }) => {
  if (typeInput === "select")
    return (
      <Select>
        <SelectTrigger className="w-1/2">
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
  return <Input type="email" placeholder="Email" />;
};

export default InputComponent;
