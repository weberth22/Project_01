"use client";

import React, { useEffect } from "react";
import { IconButton, Pagination, Table } from "rsuite";
import { API_URL } from "../_config/api";
import { Cell, Column, HeaderCell } from "rsuite-table";
import { TypeAttributes } from "rsuite/esm/internals/types";
import CheckOutlineIcon from "@rsuite/icons/CheckOutline";
import CloseOutlineIcon from "@rsuite/icons/CloseOutline";
import { fetchWithAuth } from "./fetchWithAuth";

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

const formatDate = (value: any) => {
  if (!value) return "-";

  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

interface iconButton {
  icon: any;
  color: TypeAttributes.Color;
  prop: (id: number) => void;
  key: number;
  width?: number;
  roles?: string[] | string;
}

export const TableField = ({
  data,
  label,
  width,
  isDate = false,
}: {
  data: string;
  label: string;
  width?: number;
  isDate?: boolean;
}) => (
  <Column key={data} flexGrow={width ?? 150}>
    <HeaderCell>{label}</HeaderCell>
    <Cell>
      {(rowData) => {
        const value = getNestedValue(rowData, data);
        return isDate ? formatDate(value) : value || "-";
      }}
    </Cell>
  </Column>
);

export const TableFieldBoolean = ({
  data,
  label,
  width,
}: {
  data: string;
  label: string;
  width?: number;
}) => (
  <Column key={data} flexGrow={width ?? 150}>
    <HeaderCell>{label}</HeaderCell>
    <Cell>
      {(rowData) =>
        rowData.active ? (
          <CheckOutlineIcon color="green" />
        ) : (
          <CloseOutlineIcon color="red" />
        )
      }
    </Cell>
  </Column>
);

export const TableButomIcon = (
  iconButtons: iconButton[],
  hasRoles: (role: string | string[]) => boolean
) => (
  <Column key={1} flexGrow={80} align="center" fixed="right">
    <HeaderCell> </HeaderCell>

    <Cell style={{ padding: "6px" }}>
      {(rowData) =>
        iconButtons
          .filter((bnt) => bnt.roles && hasRoles(bnt.roles))
          .map((iconButton) => (
            <IconButton
              className="mr-1"
              key={iconButton.key}
              appearance="primary"
              color={iconButton.color}
              onClick={() => iconButton.prop(rowData.id)}
              icon={iconButton.icon}
            ></IconButton>
          ))
      }
    </Cell>
  </Column>
);

const TableComponent = ({
  link,
  columns,
  refresh,
}: {
  link: string;
  columns: any;
  refresh: boolean;
}) => {
  const [defaultData, setdefaultData] = React.useState([]);
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetchWithAuth(API_URL + link, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        page: page.toString(),
        limit: limit.toString(),
      },
    })
      .then((response) => (!response ? [] : response.json()))
      .then((data) => setdefaultData(data.data));
  }, [link, refresh, page, limit]);

  const handleChangeLimit = (dataKey: number) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = defaultData.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  return (
    <div>
      <Table bordered cellBordered virtualized data={data} height={400}>
        {columns}
      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={defaultData.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  );
};

export default TableComponent;
