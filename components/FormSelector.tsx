"use client";

import React, { useState } from "react";

const FormSelctor = ({
  onRemove,
  onFieldChange,
}: {
  onRemove: () => void;
  onFieldChange: (fieldName: string, fieldType: string) => void;
}) => {
  const [fieldType, setFieldType] = useState("");
  const [fieldName, setFieldName] = useState("");

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div className="flex">
        <div>
          <label>
            Pertanyaan:
            <input
              type="text"
              value={fieldName}
              onChange={(e) => {
                setFieldName(e.target.value);
                onFieldChange(e.target.value, fieldType);
              }}
            />
          </label>
        </div>
        <div>
          <label>
            Type:
            <select
              value={fieldType}
              onChange={(e) => {
                setFieldType(e.target.value);
                onFieldChange(fieldName, e.target.value);
              }}
            >
              <option value="">Select Type</option>
              <option value="string">Jawaban Singkat</option>
              <option value="textarea">Jawaban Panjang</option>
              <option value="number">Jawaban Angka</option>
            </select>
          </label>
        </div>
      </div>

      <button type="button" onClick={onRemove}>
        Remove Form
      </button>
    </div>
  );
};

export default FormSelctor;
