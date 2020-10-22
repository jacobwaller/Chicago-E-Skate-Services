import React from 'react';
import { Divider, Layout, Space } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import classes from './app.module.css';
import { GroupRides } from "../group-rides"

const { Header, Content, Footer } = Layout;

export function App() {
  return (
    <Layout className={classes.fullPage}>
      <Header className={classes.header}>
        <Space>
          <ExperimentOutlined className={classes.logo}/>
          <Space split={<Divider type="vertical" />}>
            <div>Eskate</div>
            <div>Maybe some tabs for general info, idk where we'll put that yet</div>
          </Space>
        </Space>
      </Header>
      <Content className={classes.siteContent}>
        <GroupRides/>
      </Content>
      <Footer className={classes.footer}>
        Eksate - TODO back to top? remove this?
      </Footer>
    </Layout>
  );
}
