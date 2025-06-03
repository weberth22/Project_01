"use client";

import React from "react";
import { IconButton, MaskedInput, Schema, Toggle, useToaster } from "rsuite";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import ModalComponent from "../_components/modal";
import TableComponent, {
  TableButomIcon,
  TableField,
  TableFieldBoolean,
} from "../_components/table";
import { TextField } from "../_components/inputs";
import { DeleteNotification } from "../_components/notification";
import { useAuth } from "@/_contexts/authContext";
import ProtectedPage from "@/_contexts/ProtectedPage";

const Client = () => {
  const toaster = useToaster();
  const [edit, setEdit] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const { hasRoles } = useAuth();
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
        link="/clients"
        id={id}
        setRefresh={setRefresh}
      />,
      { placement: "topCenter", duration: 3000 }
    );
  };
  const model = Schema.Model({
    name: Schema.Types.StringType().isRequired("Obrigatorio"),
    email: Schema.Types.StringType()
      .isEmail("Deve ser um email Valido")
      .isRequired("Obrigatorio"),
    phone: Schema.Types.StringType().isRequired("Obrigatorio"),
  });

  const [id, setId] = React.useState(0);

  return (
    <ProtectedPage roles={["admin", "client_manage", "client_show"]}>
      <div className="flex flex-col h-screen">
        {hasRoles(["admin", "client_manage", "client_create"]) && (
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
        )}
        <main>
          <ModalComponent
            refresh={refresh}
            link="/clients"
            open={open}
            backdrop={"static"}
            setOpen={setOpen}
            setEdit={setEdit}
            setRefresh={setRefresh}
            model={model}
            edit={edit}
            id={edit ? id.toString() : ""}
            form={[
              <TextField key={1} name="name" label="Nome" />,
              <TextField key={2} name="email" label="Email" />,
              <TextField
                key={3}
                name="phone"
                label="Telefone"
                accepter={MaskedInput}
                accepterProps={{
                  mask: [
                    "(",
                    /[1-9]/,
                    /\d/,
                    ")",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ],
                }}
              />,
              <TextField
                key={5}
                name="active"
                label="Ativo"
                accepter={Toggle}
              />,
            ]}
          />

          <TableComponent
            link="/clients"
            refresh={refresh}
            columns={[
              TableField({ data: "id", label: "id", width: 50 }),
              TableField({ data: "name", label: "Nome" }),
              TableField({ data: "email", label: "Email" }),
              TableField({ data: "phone", label: "Telefone" }),
              TableFieldBoolean({ data: "active", label: "Ativo", width: 50 }),
              TableButomIcon(
                [
                  {
                    icon: <EditIcon />,
                    color: "green",
                    prop: handleEdit,
                    key: 1,
                    width: 50,
                    roles: ["admin", "client_manage", "client_edit"],
                  },
                  {
                    icon: <TrashIcon />,
                    color: "red",
                    prop: handleDelete,
                    key: 2,
                    width: 50,
                    roles: ["admin", "client_manage", "client_delete"],
                  },
                ],
                hasRoles
              ),
            ]}
          />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default Client;
