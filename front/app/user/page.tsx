"use client";

import React from "react";
import { IconButton, Schema, useToaster } from "rsuite";
import { DeleteNotification } from "../_components/notification";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import ModalComponent from "../_components/modal";
import { TextField } from "../_components/inputs";
import TableComponent, {
  TableButomIcon,
  TableField,
  TableFieldBoolean,
} from "../_components/table";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

const User = () => {
  const toaster = useToaster();
  const [edit, setEdit] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [id, setId] = React.useState(0);
  const handleOpen = () => {
    setOpen(true), setRefresh(false);
  };

  const handleEdit = (id: number) => {
    setEdit(true);
    setOpen(true), setId(id);
  };

  const handleDelete = (id: number) => {
    toaster.push(
      <DeleteNotification
        refresh={refresh}
        link="/rents"
        id={id}
        setRefresh={setRefresh}
      />,
      { placement: "topCenter", duration: 3000 }
    );
  };

  const model = Schema.Model({
    fullName: Schema.Types.StringType().isRequired("Obrigatorio"),
    email: Schema.Types.StringType()
      .isEmail("Deve ser um email Valido")
      .isRequired("Obrigatorio"),
    password: Schema.Types.StringType()
      .minLength(8, "Deve ter no minimo 8 caracteres")
      .isRequired("Obrigatorio"),
    passwordConfirmation: Schema.Types.StringType()
      .equalTo("password", "As senhas devem ser iguais")
      .minLength(8, "Deve ter no minimo 8 caracteres")
      .isRequired("Obrigatorio"),
  });

  const modelEdit = Schema.Model({
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

  return (
    <div className="flex flex-col h-screen">
      <header className="pb-1">
        <div className="text-right">
          <IconButton
            placement="right"
            onClick={handleOpen}
            icon={<AddOutlineIcon />}
          >
            Criar
          </IconButton>
        </div>
      </header>
      <main>
        <ModalComponent
          link="/users"
          refresh={refresh}
          open={open}
          backdrop={"static"}
          setOpen={setOpen}
          setEdit={setEdit}
          setRefresh={setRefresh}
          model={edit ? modelEdit : model}
          edit={edit}
          id={edit ? id.toString() : ""}
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
        <TableComponent
          link="/users"
          refresh={refresh}
          columns={[
            TableField({ data: "fullName", label: "Nome" }),
            TableField({ data: "email", label: "Email" }),
            TableFieldBoolean({ data: "active", label: "Ativo", width: 50 }),
            TableButomIcon([
              {
                icon: <EditIcon />,
                color: "green",
                prop: handleEdit,
                key: 1,
                width: 50,
              },
              {
                icon: <TrashIcon />,
                color: "red",
                prop: handleDelete,
                key: 2,
                width: 50,
              },
            ]),
          ]}
        />
      </main>
    </div>
  );
};
export default User;
