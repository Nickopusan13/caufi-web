"use client";

import { useState } from "react";

export const EditForm = ({
  name,
  id,
  required,
  bottomLabel,
  value,
  setValue,
  onClick,
  readOnly,
}: {
  name: string;
  id: string;
  required: boolean;
  bottomLabel?: string;
  value?: string;
  setValue?: (val: string) => void;
  onClick?: () => void;
  readOnly?: boolean;
}) => {
  const [label, setLabel] = useState("");
  return (
    <div className="relative text-black dark:text-white">
      {name !== "Full Address" ? (
        <input
          className="border text-[12px] px-2 w-full pt-5 pb-2 rounded-[10px] focus:outline-1"
          onChange={(e) => {
            setLabel(e.target.value);
            if (setValue) setValue(e.target.value);
          }}
          type="text"
          name={name}
          id={id}
          placeholder=""
          required={required}
          autoComplete="off"
          onClick={onClick}
          readOnly={readOnly}
          value={value}
        />
      ) : (
        <textarea
          className="border text-[12px] px-2 w-full pt-5 pb-2 rounded-[10px] focus:outline-1 resize-none h-[100px]"
          onChange={(e) => {
            setLabel(e.target.value);
            if (setValue) setValue(e.target.value);
          }}
          name={name}
          id={id}
          placeholder=""
          required={required}
          autoComplete="off"
          value={value !== undefined ? value : label}
        />
      )}
      <label
        className={`absolute left-2 transition-all duration-200 pointer-events-none ${
          required
            ? "after:content-['*'] after:text-red-400"
            : "after:content-['(Optional)'] after:text-[10px] after:ml-1"
        } ${
          label || value
            ? "translate-y-1 text-[10px] translate-x-2 font-semibold opacity-60"
            : "translate-y-5 text-[12px] opacity-40"
        }`}
        htmlFor={id}
      >
        {name}
      </label>
      <p
        className={`text-[10px] text-red-500 ml-1 mt-0.5 transition-opacity duration-200 ${
          label || value ? "opacity-0" : "opacity-100"
        }`}
      >
        {bottomLabel || "\u00A0"}
      </p>
    </div>
  );
};
