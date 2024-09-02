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
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table ",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        // "table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
        // table_toolbar:
        //   "table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
        content_style:
          "body { font-family:Roboto,Helvetica,Arial,sans-serif; font-size:16px; line-height: 1; }",
      }}
      textareaName={name}
    />
  );
};

export default forwardRef(MyEditor);
