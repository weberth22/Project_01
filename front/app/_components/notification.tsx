"use client";

import { useState } from "react";
import { Button, ButtonToolbar, Notification, useToaster } from "rsuite";
import { API_URL } from "../_config/api";
import { fetchWithAuth } from "./fetchWithAuth";

export const FlashNotification = ({
  type,
  message,
  header,
}: {
  type: "info" | "success" | "warning" | "error";
  message: string;
  header: string;
}) => {
  return (
    <div>
      <Notification type={type} header={header} closable>
        {message}
      </Notification>
    </div>
  );
};

export const DeleteNotification = ({
  link,
  id,
  setRefresh,
  refresh,
}: {
  link: string;
  id: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}) => {
  const toaster = useToaster();
  const [visible, setVisible] = useState(true);

  function handleDelete() {
    fetchWithAuth(API_URL + link + "/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      setVisible(false);

      toaster.push(
        <FlashNotification
          type="success"
          message="Excluído com sucesso"
          header="Exclusão"
        />,
        { placement: "topCenter", duration: 3000 }
      );

      setRefresh(!refresh);
    });
  }

  return visible ? (
    <Notification id="delete" type="warning" header="Exclusão" closable>
      <p>Você deseja realmente excluir?</p>
      <hr />
      <ButtonToolbar>
        <Button onClick={handleDelete} appearance="primary">
          Ok
        </Button>
        <Button onClick={() => setVisible(false)} appearance="default">
          Cancel
        </Button>
      </ButtonToolbar>
    </Notification>
  ) : null;
};

export function useMessage() {
  const toaster = useToaster();

  return (response: any) => {
    response.json().then((result: any) => {
      if (response.status !== 200) {
        toaster.push(
          <FlashNotification
            type="warning"
            message={result.message?.[0]?.message || "Erro"}
            header="Aviso"
          />,
          { placement: "topCenter", duration: 3000 }
        );
      } else {
        toaster.push(
          <FlashNotification
            type="success"
            message={result.message}
            header="Sucesso"
          />,
          { placement: "topCenter", duration: 3000 }
        );
      }
    });
  };
}
