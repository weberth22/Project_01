"use client";

import { Button, Form, Schema } from "rsuite";
import { TextField } from "../_components/inputs";
import React, { useState } from "react";
import { useMessage } from "../_components/notification";
import { useRouter } from "next/navigation";
import { useAuth } from "@/_contexts/authContext";

const Login = () => {
  const showMessage = useMessage();
  const router = useRouter();
  const { login } = useAuth();
  const [formValue, setFormValue] = React.useState<Record<string, any>>([]);
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    if (loading) return;
    setLoading(true);
    try {
      await login(e.email, e.password);
      router.push("/");
    } catch (error: any) {
      showMessage({
        json: async () => ({ message: error.message || "Erro ao fazer login" }),
        status: 400,
      });
    } finally {
      setLoading(false);
    }
  }

  const model = Schema.Model({
    email: Schema.Types.StringType()
      .isEmail("Deve ser um email Valido")
      .isRequired("Obrigatorio"),
    password: Schema.Types.StringType().isRequired("Obrigatorio"),
  });

  return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      {/*// @ts-ignore */}
      <Form
        model={model}
        onSubmit={submit}
        formValue={formValue}
        onChange={(formValue) => setFormValue(formValue)}
      >
        <TextField key={1} name="email" label="Email" />
        <TextField key={2} name="password" label="Senha" type="password" />
        <Form.Group>
          <Button type="submit" appearance="primary" color="blue">
            Login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Login;
