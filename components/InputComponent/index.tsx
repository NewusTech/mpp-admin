"use client";

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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const InputComponent = ({ typeInput }: { typeInput?: string }) => {
  const [date, setDate] = useState<Date>();
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

  if (typeInput === "datepicker")
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-between text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            {date ? format(date, "PPP") : <span>Pick a date</span>}
            <CalendarIcon className="ml-2 h-4 w-4 text-primary-700" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );

  if (typeInput === "textarea")
    return <Textarea className="h-40" placeholder="Type your message here." />;

  if (typeInput === "radio")
    return (
      <RadioGroup>
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
        className="rounded-none border-r-0 border-t-0 border-l-0 bg-transparent"
      />
    );

  if (typeInput === "file")
    return <Input type="file" placeholder="Email" className="rounded-full" />;

  if (typeInput === "upload")
    return (
      <div className="relative inline-block">
        <input
          type="file"
          id="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
        />
        <label
          htmlFor="file"
          className="cursor-pointer inline-block bg-transparent border border-primary-700 text-primary-700 py-2 px-5 rounded-full font-semibold text-sm hover:bg-violet-100"
        >
          Upload
        </label>
      </div>
    );

  return <Input type="email" placeholder="Email" className="rounded-full" />;
};

export default InputComponent;
