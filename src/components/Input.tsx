import { InputHTMLAttributes, useEffect, useRef } from "react";
import { useField } from "@unform/core";

type InputProps = { name: string } & InputHTMLAttributes<HTMLInputElement>;

function Input({ name, ...props }: InputProps) {
  const inputRef = useRef(null);

  const { fieldName, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, [fieldName, registerField]);

  return <input ref={inputRef} {...props} />;
}

export default Input;
