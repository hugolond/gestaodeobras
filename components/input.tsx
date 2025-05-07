import React from "react";
import {TEInput} from "tw-elements-react";
type dadosProps = {
  id: string;
};

export default function InputText(pros: dadosProps): JSX.Element {
  return (
    <TEInput
    type="search"
    id={pros.id}
    name={pros.id}
    label="Número Pedido"
    className="mt-1 w-full border px-4 py-3 bg-white rounded-lg shadow"
  ></TEInput>
  );
}

export function InputEmail(pros: dadosProps): JSX.Element {
  return (
    <TEInput
      type="email"
      id={pros.id}  
      label="E-mail"
    ></TEInput>
  );
}

export function InputPassword(pros: dadosProps): JSX.Element {
  return (
    <TEInput
      type="email"
      id="exampleFormControlInputText"
      label={pros.id}     
    ></TEInput>
  );
}