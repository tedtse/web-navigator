import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Header, Content, Footer, Sider } = Layout;

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Layout className="global-layout">
        <Sider breakpoint="lg" collapsedWidth="0">
          <Menu theme="dark" mode="inline">
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    </>
  );
};
export default Home;
