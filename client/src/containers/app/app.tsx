import React from "react";
import { Divider, Layout, Space, PageHeader } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import classes from "./app.module.css";
import { GroupRides } from "../group-rides";
import Avatar from "antd/lib/avatar/avatar";
import RideData from "../../interfaces/RideData";

const { Header, Content, Footer } = Layout;

const openModal = (rideData: RideData) => {};

export class App extends React.Component {
  render() {
    return (
      <Layout className={classes.fullPage}>
        <PageHeader
          title="Chicago E-Skate"
          className={classes.header}
          avatar={{ src: "./logo.jpg" }}
        ></PageHeader>

        <Content className={classes.siteContent}>
          <GroupRides />
          <Divider />
        </Content>
        <Footer className={classes.footer}>
          <p>Join us on Telegram</p>
          <Avatar src="./telegram.png"></Avatar>
        </Footer>
      </Layout>
    );
  }
}
