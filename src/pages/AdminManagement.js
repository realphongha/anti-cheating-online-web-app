import { useState, useContext, useEffect, React } from "react";
import { Admin, Resource, fetchUtils } from "react-admin";
import simpleRestProvider from 'ra-data-simple-rest';
import { UserList } from "../models/list/UserList";
import { ClassList } from "../models/list/ClassList";
import { ClassShow } from "../models/show/ClassShow";
import { UserEdit } from "../models/edit/UserEdit"; 
import { UserCreate } from "../models/create/UserCreate";
import ReactAdminHeaderLayout from "./layouts/ReactAdminHeaderLayout";
import * as constants from "../utils/Constants";
import vietnameseMessages from 'ra-language-vietnamese';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const i18nProvider = polyglotI18nProvider(() => vietnameseMessages, 'vi');

const AdminManagement = () => {

  const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    let token = localStorage.getItem('token');
    options.headers.set('x-access-token', token);
    return fetchUtils.fetchJson(url, options);
  };

  const dataProvider = simpleRestProvider(constants.backend, httpClient);

  return (
    <Admin 
      basename="/admin" 
      dataProvider={dataProvider} 
      i18nProvider={i18nProvider}
      layout={ReactAdminHeaderLayout}>
      <Resource 
        options={{ label: 'Tài khoản' }}
        name={constants.DB_USERS_COLLECTION} 
        list={UserList}
        edit={UserEdit} 
        create={UserCreate} />
      <Resource 
        options={{ label: 'Lớp thi' }}
        name={constants.DB_CLASSES_COLLECTION} 
        list={ClassList}
        show={<ClassShow admin/>} />
    </Admin>
  )
}

export default AdminManagement;