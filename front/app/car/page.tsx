"use client";
import React from "react";
import { InputNumber, IconButton, useToaster, Toggle } from "rsuite";
import ModalComponent from "../_components/modal";
import { Schema } from "rsuite";
import TableComponent, {
  TableButomIcon,
  TableField,
  TableFieldBoolean,
} from "../_components/table";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import { TextField } from "../_components/inputs";
import { DeleteNotification } from "../_components/notification";
import { useAuth } from "@/_contexts/authContext";
import ProtectedPage from "@/_contexts/ProtectedPage";

const Car = () => {
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
        link="/cars"
        id={id}
        setRefresh={setRefresh}
      />,
      { placement: "topCenter", duration: 3000 }
    );
  };
  const model = Schema.Model({
    manufacturer: Schema.Types.StringType().isRequired("Obrigatorio"),
    color: Schema.Types.StringType().isRequired("Obrigatorio"),
    licensePlate: Schema.Types.StringType().isRequired("Obrigatorio"),
    chassi: Schema.Types.NumberType().isRequired("Obrigatorio"),
  });

  const [id, setId] = React.useState(0);

  return (
    <ProtectedPage roles={["admin", "car_manage", "car_show"]}>
      <div className="flex flex-col h-screen">
        {hasRoles(["admin", "car_manage", "car_create"]) && (
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
            link="/cars"
            open={open}
            backdrop={"static"}
            setOpen={setOpen}
            setEdit={setEdit}
            setRefresh={setRefresh}
            model={model}
            edit={edit}
            id={edit ? id.toString() : ""}
            form={[
              <TextField
                key={1}
                name="manufacturer"
                label="Fabricante do carro"
              />,
              <TextField key={2} name="color" label="Cor do Carro" />,
              <TextField key={3} name="licensePlate" label="Placa do carro" />,
              <TextField
                key={4}
                name="chassi"
                label="Chassi do carro"
                accepter={InputNumber}
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
            link="/cars"
            refresh={refresh}
            columns={[
              TableField({ data: "id", label: "id", width: 50 }),
              TableField({ data: "manufacturer", label: "Fabricante" }),
              TableField({ data: "color", label: "Cor" }),
              TableField({ data: "licensePlate", label: "Placa" }),
              TableField({ data: "chassi", label: "Chassi" }),
              TableFieldBoolean({ data: "active", label: "Ativo", width: 50 }),
              TableButomIcon(
                [
                  {
                    icon: <EditIcon />,
                    color: "green",
                    prop: handleEdit,
                    key: 1,
                    width: 50,
                    roles: ["admin", "car_manage", "car_edit"],
                  },
                  {
                    icon: <TrashIcon />,
                    color: "red",
                    prop: handleDelete,
                    key: 2,
                    width: 50,
                    roles: ["admin", "car_manage", "car_delete"],
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

export default Car;
