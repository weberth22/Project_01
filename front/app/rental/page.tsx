"use client";

import { IconButton, Schema, useToaster } from "rsuite";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import TableComponent, {
  TableButomIcon,
  TableField,
} from "../_components/table";
import React from "react";
import ModalComponent from "../_components/modal";
import { DateRangeField, SelectFieldApi } from "../_components/inputs";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { DeleteNotification } from "../_components/notification";
import { useAuth } from "@/_contexts/authContext";
import ProtectedPage from "@/_contexts/ProtectedPage";

const Rental = () => {
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
        link="/rents"
        id={id}
        setRefresh={setRefresh}
      />,
      { placement: "topCenter", duration: 3000 }
    );
  };

  const model = Schema.Model({
    carId: Schema.Types.NumberType().isRequired("Obrigatorio"),
    clientId: Schema.Types.NumberType().isRequired("Obrigatorio"),
    dateRange: Schema.Types.ArrayType().isRequired("Obrigatorio"),
  });

  const [id, setId] = React.useState(0);

  return (
    <ProtectedPage roles={["admin", "rental_manage", "rental_show"]}>
      <div className="flex flex-col h-screen">
        {hasRoles(["admin", "rental_manage", "rental_create"]) && (
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
            link="/rents"
            refresh={refresh}
            open={open}
            backdrop={"static"}
            setOpen={setOpen}
            setEdit={setEdit}
            setRefresh={setRefresh}
            model={model}
            edit={edit}
            id={edit ? id.toString() : ""}
            dateFields={["dateRange"]}
            form={[
              <SelectFieldApi
                key={1}
                name="carId"
                label="Carro"
                link="/cars"
                selectLabel="licensePlate"
                selectValue="id"
              />,
              <SelectFieldApi
                key={2}
                name="clientId"
                label="Cliente"
                link="/clients"
                selectLabel="name"
                selectValue="id"
              />,

              <DateRangeField
                key={3}
                name="dateRange"
                label="Periodo do Aluguel"
              />,
            ]}
          />

          <TableComponent
            link="/rents"
            refresh={refresh}
            columns={[
              TableField({ data: "id", label: "ID", width: 50 }),
              TableField({ data: "car.licensePlate", label: "Placa" }),
              TableField({ data: "client.name", label: "Cliente", width: 300 }),
              TableField({
                data: "startDate",
                label: "Inicio do Aluguel",
                isDate: true,
              }),
              TableField({
                data: "endDate",
                label: "Fim do Aluguel",
                isDate: true,
              }),
              TableButomIcon(
                [
                  {
                    icon: <EditIcon />,
                    color: "green",
                    prop: handleEdit,
                    key: 1,
                    width: 50,
                    roles: ["admin", "rental_manage", "rental_edit"],
                  },
                  {
                    icon: <TrashIcon />,
                    color: "red",
                    prop: handleDelete,
                    key: 2,
                    width: 50,
                    roles: ["admin", "rental_manage", "rental_delete"],
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

export default Rental;
