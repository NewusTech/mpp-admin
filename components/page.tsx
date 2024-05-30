"use client";

import FormSelector from "@/components/FormSelector";
import { useState } from "react";

export default function Home() {
  const [formSelectors, setFormSelectors] = useState([{ id: Date.now() }]);
  const [formData, setFormData] = useState([]);

  let timeoutId: any;

  const handleAddFormSelector = () => {
    setFormSelectors((prevSelectors) => [...prevSelectors, { id: Date.now() }]);
  };

  const handleRemoveFormSelector = (id: any) => {
    setFormSelectors((prevSelectors) =>
      prevSelectors.filter((selector) => selector.id !== id),
    );
  };

  const handleFieldChange = (fieldName: any, fieldType: any) => {
    // Menghapus pemanggilan sebelumnya yang tertunda
    clearTimeout(timeoutId);

    // Menunda pemanggilan handleFieldChange menggunakan setTimeout
    timeoutId = setTimeout(() => {
      const existingFieldIndex = formData.findIndex(
        (field) => field.name === fieldName,
      );
      if (existingFieldIndex !== -1) {
        const updatedFormData = [...formData];
        updatedFormData[existingFieldIndex] = {
          name: fieldName,
          type: fieldType,
        };
        setFormData(updatedFormData);
      } else {
        setFormData((prevFormData) => [
          ...prevFormData,
          { name: fieldName, type: fieldType },
        ]);
      }
    }, 500); // Menunggu 500 milidetik sebelum menangani perubahan
  };

  const handleSubmit = () => {
    // Kirim formData ke server atau lakukan tindakan lain
    console.log("Submitted FormData:", formData);
  };

  return (
    <div>
      <h1>Dynamic Form Generator</h1>
      {formSelectors.map((selector) => (
        <FormSelector
          key={selector.id}
          onRemove={() => handleRemoveFormSelector(selector.id)}
          onFieldChange={handleFieldChange}
        />
      ))}
      <div>
        <button type="button" onClick={handleAddFormSelector}>
          Add New Form
        </button>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}
