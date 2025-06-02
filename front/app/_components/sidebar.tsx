"use client";
import { Sidenav, Nav } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import React from "react";
import Link from "next/link";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsPen } from "react-icons/bs";
import { useAuth } from "@/_contexts/authContext";

const SiderbarComponent = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState("1");
  const { hasRoles } = useAuth();
  return (
    <div style={{ width: 240 }}>
      <Sidenav expanded={expanded}>
        <Sidenav.Toggle onToggle={(expanded) => setExpanded(expanded)} />
        <Sidenav.Body>
          <Nav activeKey={activeKey} onSelect={setActiveKey}>
            <Nav.Item
              as={Link}
              eventKey="1"
              icon={
                <MdOutlineSpaceDashboard
                  style={{ position: "absolute", top: "15px", left: "20px" }}
                />
              }
              href="/"
            >
              Dashboard
            </Nav.Item>
            {hasRoles([
              "admin",
              "car_manage",
              "car_show",
              "client_manage",
              "client_show",
            ]) && (
              <Nav.Menu
                placement="rightStart"
                eventKey="2"
                title="Cadastro"
                icon={
                  <BsPen
                    style={{ position: "absolute", top: "15px", left: "20px" }}
                  />
                }
              >
                {hasRoles(["admin", "car_manage", "car_show"]) && (
                  <Nav.Item eventKey="2-1" as={Link} href="/car">
                    Carro
                  </Nav.Item>
                )}
                {hasRoles(["admin", "client_manage", "client_show"]) && (
                  <Nav.Item eventKey="2-2" as={Link} href="/client">
                    Cliente
                  </Nav.Item>
                )}
              </Nav.Menu>
            )}
            {hasRoles(["admin", "rental_manage", "rental_show"]) && (
              <Nav.Item
                as={Link}
                eventKey="3"
                icon={
                  <FaRegMoneyBillAlt
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "20px",
                    }}
                  />
                }
                href="/rental"
              >
                Aluguel
              </Nav.Item>
            )}
            {hasRoles(["admin"]) && (
              <Nav.Item
                as={Link}
                eventKey="4"
                icon={<GroupIcon />}
                href="/user"
              >
                Usuários
              </Nav.Item>
            )}
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};

export default SiderbarComponent;
