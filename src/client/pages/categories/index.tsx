import React, { useState, useEffect, useMemo } from 'react';
import { NextPage } from 'next';
import {
  Layout,
  Menu,
  List,
  PageHeader,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import * as antdIcons from '@ant-design/icons';
// import { ReactSortable } from 'react-sortablejs';
import StaticWebHeader from '../components/static-web-header';
import { BackgroundRoutes } from '../routes';
import {
  findCategories,
  findAntdIconsList,
  createCategory,
  updateCategory,
  removeCategory,
} from './service';

import styles from '../index.module.scss';

import type { CategoryType } from './data';
import type { FormStateType, AntdIconsListType } from '../types';

const { Content, Footer, Sider } = Layout;
const { Option, OptGroup } = Select;

const CategoriesPage: NextPage = () => {
  const [renderable, setRenderable] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [antdIconsList, setAntdIconsList] = useState<AntdIconsListType[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormStateType>();
  const modalTitle = useMemo(() => {
    const map = {
      create: '新增分类',
      update: '编辑分类',
      read: '分类详情',
    };
    return map[formState] ?? '';
  }, [formState]);
  const [form] = Form.useForm<CategoryType>();

  useEffect(() => {
    setRenderable(true);
    findCategories().then((res) => {
      setCategories(res.data);
    });
    findAntdIconsList().then((res) => {
      setAntdIconsList(res);
    });
  }, []);

  const handleCreateCategory = async (json: CategoryType) => {
    createCategory(json)
      .then(() => {
        message.success('新增成功');
        setVisible(false);
        return findCategories();
      })
      .then((res) => {
        setCategories(res.data);
      });
  };
  const handleUpdateCategory = async (json: CategoryType) => {
    updateCategory(json)
      .then(() => {
        message.success('修改成功');
        setVisible(false);
        return findCategories();
      })
      .then((res) => {
        setCategories(res.data);
      });
  };

  if (!renderable) {
    return null;
  }

  return (
    <>
      <StaticWebHeader />
      <Layout className={styles.globalLayout}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <Menu theme="dark" mode="inline" selectedKeys={['categories']}>
            {BackgroundRoutes.map((el) => {
              const Icon = antdIcons[el.icon];
              return (
                <Menu.Item key={el.key} icon={<Icon />}>
                  {el.title}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout className={styles.siteLayout}>
          <PageHeader
            extra={[
              <Button
                key="new"
                type="primary"
                onClick={() => {
                  setFormState('create');
                  setVisible(true);
                  form?.resetFields();
                }}
              >
                新增
              </Button>,
            ]}
          />
          <Content>
            {/* <ReactSortable<CategoryType>
              list={categories}
              setList={setCategories}
            ></ReactSortable> */}
            <List
              className={styles.listRegular}
              dataSource={categories}
              renderItem={(item) => {
                const Icon = antdIcons[item.icon];
                return (
                  <List.Item
                    key={String(item._id)}
                    actions={[
                      <a
                        key="edit"
                        onClick={() => {
                          setFormState('update');
                          setVisible(true);
                          form?.resetFields();
                          form?.setFieldsValue(item);
                        }}
                      >
                        编辑
                      </a>,
                      <a
                        key="remove"
                        onClick={() => {
                          const ExclamationIcon =
                            antdIcons.ExclamationCircleOutlined;
                          Modal.confirm({
                            icon: <ExclamationIcon />,
                            content: '确定要删除吗?',
                            onOk: () => {
                              removeCategory(item._id)
                                .then(() => {
                                  message.success('删除成功');
                                  setVisible(false);
                                  return findCategories();
                                })
                                .then((res) => {
                                  setCategories(res.data);
                                });
                            },
                          });
                        }}
                      >
                        删除
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Icon />}
                      title={item.name}
                      description={item.description}
                    />
                  </List.Item>
                );
              }}
            />
          </Content>
          <Footer>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
      <Modal
        title={modalTitle}
        visible={visible}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={(json) => {
            if (formState === 'create') {
              handleCreateCategory(json);
            }
            if (formState == 'update') {
              handleUpdateCategory(json);
            }
          }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="图标"
            name="icon"
            rules={[{ required: true, message: '请选择图标' }]}
          >
            <Select showSearch>
              {antdIconsList.map((group, index) => (
                <OptGroup key={index} label={group.title}>
                  {group.icons.map((icon) => {
                    const Icon = antdIcons[icon];
                    return (
                      <Option key={icon} value={icon}>
                        {icon} <Icon />
                      </Option>
                    );
                  })}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CategoriesPage;
