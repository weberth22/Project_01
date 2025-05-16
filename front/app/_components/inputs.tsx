"use client";

import React, { useEffect, useState } from "react";
import { DatePicker, DateRangePicker, Form, Input, SelectPicker } from "rsuite";
import { API_URL } from "../_config/api";
import { fetchWithAuth } from "./fetchWithAuth";

export const FormFieldWrapper = ({
  name,
  label,
  children,
  style = {},
}: {
  name: string;
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <Form.Group controlId={name} style={{ width: "98%", ...style }}>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    {children}
  </Form.Group>
);

async function getData(link: string) {
  const response = await fetchWithAuth(API_URL + link, {
    method: "GET",
  });
  if (!response) return;
  const data = await response.json();
  return data;
}

export const TextField = ({
  name,
  label,
  accepter = Input,
  accepterProps = {},
  ...rest
}: {
  name: string;
  label: string;
  accepter?: any;
  accepterProps?: any;
  [key: string]: any;
}) => (
  <FormFieldWrapper name={name} label={label}>
    <Form.Control
      name={name}
      accepter={accepter}
      {...accepterProps}
      {...rest}
    />
  </FormFieldWrapper>
);

export const SelectField = ({
  name,
  label,
  data,
  placeholder = "Selecione uma opção",
  ...rest
}: {
  name: string;
  label: string;
  data: { label: string; value: any }[];
  placeholder?: string;
  [key: string]: any;
}) => (
  <FormFieldWrapper name={name} label={label}>
    <Form.Control
      name={name}
      accepter={SelectPicker}
      data={data}
      placeholder={placeholder}
      style={{ width: "100%" }}
      virtualized
      {...rest}
    />
  </FormFieldWrapper>
);

export const SelectFieldApi = ({
  name,
  label,
  link,
  selectLabel,
  selectValue,
  placeholder = "Selecione uma opção",
  ...rest
}: {
  name: string;
  label: string;
  link: string;
  selectLabel: string;
  selectValue: string;
  placeholder?: string;
  [key: string]: any;
}) => {
  const [options, setOptions] = useState<{ label: string; value: any }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData(link).then((res) => {
      setOptions(
        res.data.map((item: any) => ({
          label: item[selectLabel],
          value: item[selectValue],
        }))
      );
      setLoading(false);
    });
  }, [link, selectLabel, selectValue]);

  return (
    <FormFieldWrapper name={name} label={label}>
      <Form.Control
        name={name}
        accepter={SelectPicker}
        data={options}
        loading={loading}
        placeholder={placeholder}
        style={{ width: "100%" }}
        virtualized
        {...rest}
      />
    </FormFieldWrapper>
  );
};

export const DateField = ({
  name,
  label,
  placeholder = "Selecione uma data",
  ...rest
}: {
  name: string;
  label: string;
  placeholder?: string;
  [key: string]: any;
}) => (
  <FormFieldWrapper name={name} label={label}>
    <Form.Control
      name={name}
      accepter={DatePicker}
      placeholder={placeholder}
      style={{ width: "100%" }}
      {...rest}
    />
  </FormFieldWrapper>
);

export const DateRangeField = ({
  name,
  label,
  placeholder = "Selecione uma data",
  ...rest
}: {
  name: string;
  label: string;
  placeholder?: string;
  [key: string]: any;
}) => (
  <FormFieldWrapper name={name} label={label}>
    <Form.Control
      name={name}
      accepter={DateRangePicker}
      placeholder={placeholder}
      style={{ width: "100%" }}
      {...rest}
    />
  </FormFieldWrapper>
);
