"use client";

import { FaUser } from "react-icons/fa";
import { Nav, Navbar, Schema } from "rsuite";
import { useMessage } from "./notification";
import { useAuth } from "@/_contexts/authContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ModalComponent from "./modal";
import { TextField } from "./inputs";
import { API_URL } from "../_config/api";

const NavbarComponet = () => {
  const showMessage = useMessage();
  const router = useRouter();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [edit, setEdit] = useState(true);
  const [open, setOpen] = useState(false);

  async function submit(e: any) {
    if (loading) return;
    setLoading(true);
    try {
      await logout();
      router.push("/login");
    } catch (error: any) {
      showMessage({
        json: async () => "deslogado com sucesso",
        status: 400,
      });
      showMessage({
        json: async () => ({ message: error.message || "Erro ao se deslogar" }),
        status: 400,
      });
    } finally {
      setLoading(false);
    }
  }

  const model = Schema.Model({
    fullName: Schema.Types.StringType().isRequired("Obrigatorio"),
    email: Schema.Types.StringType()
      .isEmail("Deve ser um email Valido")
      .isRequired("Obrigatorio"),
    password: Schema.Types.StringType().minLength(
      8,
      "Deve ter no minimo 8 caracteres"
    ),
    passwordConfirmation: Schema.Types.StringType()
      .equalTo("password", "As senhas devem ser iguais")
      .minLength(8, "Deve ter no minimo 8 caracteres"),
  });

  const authUserId = localStorage.getItem("authUserId");

  return (
    <div>
      <Navbar>
        <Navbar.Brand href="#">Projeto 01</Navbar.Brand>
        <Nav pullRight>
          <Nav.Menu title="Usuário" icon={<FaUser />}>
            <Nav.Item
              onSelect={() => {
                setOpen(true);
                setEdit(true);
              }}
            >
              Perfil
            </Nav.Item>
            <Nav.Item onSelect={submit}>Logout</Nav.Item>
          </Nav.Menu>
        </Nav>
      </Navbar>
      <ModalComponent
        link="/users"
        refresh={refresh}
        open={open}
        backdrop={"static"}
        setOpen={setOpen}
        setEdit={setEdit}
        setRefresh={setRefresh}
        model={model}
        edit={edit}
        title="Editar Perfil"
        id={authUserId?.toString()}
        form={[
          <TextField key={1} name="fullName" label="Nome Completo" />,
          <TextField key={2} name="email" label="Email" />,
          <TextField key={3} name="password" label="Senha" type="password" />,
          <TextField
            key={4}
            name="passwordConfirmation"
            label="Confirmar Senha"
            type="password"
          />,
        ]}
      />
    </div>
  );
};

export default NavbarComponet;
