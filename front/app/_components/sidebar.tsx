"use client";
import { Sidenav, Nav } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import React from "react";
import Link from "next/link";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsPen } from "react-icons/bs";

const SiderbarComponent = () => {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState("1");
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
              <Nav.Item eventKey="2-1" as={Link} href="/car">
                Carro
              </Nav.Item>
              <Nav.Item eventKey="2-2" as={Link} href="/client">
                Cliente
              </Nav.Item>
            </Nav.Menu>
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
            <Nav.Item as={Link} eventKey="4" icon={<GroupIcon />} href="/user">
              Usuários
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
};

export default SiderbarComponent;
