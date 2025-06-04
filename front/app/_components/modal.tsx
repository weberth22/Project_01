"use client";
import { Button, Form, Modal, useToaster } from "rsuite";
import { API_URL } from "../_config/api";
import React, { useEffect } from "react";
import { fetchAndParseFormData } from "./functions";
import { useMessage } from "./notification";
import { fetchWithAuth } from "./fetchWithAuth";
import { set } from "rsuite/esm/internals/utils/date";

const ModalComponent = ({
  open,
  backdrop,
  setOpen,
  setEdit,
  setRefresh,
  refresh,
  form,
  model,
  link,
  edit = false,
  id,
  dateFields = [],
  title = "",
}: {
  open: boolean;
  backdrop: boolean | "static";
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  form: any;
  model: any;
  link: string;
  edit?: boolean;
  id?: string;
  dateFields?: string[];
  title?: string;
}) => {
  const showMessage = useMessage();
  const [formValue, setFormValue] = React.useState<Record<string, any>>({});
  const handleClose = () => {
    setOpen(false), setEdit(false), setFormValue([]), setRefresh(!refresh);
  };

  const stableDateFields = React.useMemo(() => dateFields || [], []);

  useEffect(() => {
    if (edit) {
      (async () => {
        const response = await fetchAndParseFormData({
          url: `${API_URL}${link}/${id}`,
          dateFields: stableDateFields,
        });
        console.log(response);
        if (!response) return;
        setFormValue(response);
      })();
    }
  }, [edit, id, stableDateFields, link]);

  async function submit(e: any) {
    edit
      ? await fetchWithAuth(API_URL + link + "/" + id, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(e),
        })
          .then((response) => showMessage(response))
          .catch((error) => showMessage(error))
      : await fetchWithAuth(API_URL + link, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(e),
        })
          .then((response) => showMessage(response))
          .catch((error) => showMessage(error));
    handleClose();
  }

  return (
    <>
      <Modal
        backdrop={backdrop}
        keyboard={false}
        open={open}
        onClose={handleClose}
      >
        <Form
          model={model}
          onSubmit={submit}
          formValue={formValue}
          onChange={(formValue) => setFormValue(formValue)}
          fluid
        >
          <Modal.Header>
            {title == "" ? (
              <Modal.Title>{edit ? "Editar" : "Criar"}</Modal.Title>
            ) : (
              <Modal.Title>{title}</Modal.Title>
            )}
          </Modal.Header>
          <Modal.Body>{form}</Modal.Body>
          <Modal.Footer>
            <Button type="submit" appearance="primary" color="green">
              Salvar
            </Button>
            <Button onClick={handleClose} appearance="primary" color="red">
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ModalComponent;
