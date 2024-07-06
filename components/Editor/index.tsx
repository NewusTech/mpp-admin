// components/Editor.tsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
import { Editor } from "@tinymce/tinymce-react";

interface MyEditorProps {
  name: string;
  initialValue?: string;
}

// ForwardRefRenderFunction digunakan untuk mendefinisikan tipe props dan ref
const MyEditor: React.ForwardRefRenderFunction<
  { getContent: () => string },
  MyEditorProps
> = ({ name, initialValue }, ref) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return editorRef.current ? editorRef.current.getContent() : "";
    },
  }));

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={
        initialValue || "<p>This is the initial content of the editor</p>"
      }
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat | help",
      }}
      textareaName={name}
    />
  );
};

export default forwardRef(MyEditor);
