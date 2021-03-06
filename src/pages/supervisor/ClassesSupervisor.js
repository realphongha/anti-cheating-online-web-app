import { useState } from "react";
import { Admin, Resource, fetchUtils } from "react-admin";
import simpleRestProvider from 'ra-data-simple-rest';
import { ClassList } from "../../models/list/ClassList";
import { ClassCreate } from "../../models/create/ClassCreate";
import { ClassEdit } from "../../models/edit/ClassEdit";
import ReactAdminHeaderLayout from "../layouts/ReactAdminHeaderLayout";
import * as constants from "../../utils/Constants";
import vietnameseMessages from 'ra-language-vietnamese';
import polyglotI18nProvider from 'ra-i18n-polyglot';

const i18nProvider = polyglotI18nProvider(() => vietnameseMessages, 'vi');

const ClassesSupervisor = () => {

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
      basename="/supervisor/classes" 
      dataProvider={dataProvider}
      i18nProvider={i18nProvider}
      layout={ReactAdminHeaderLayout}>
      <Resource 
        options={{ label: 'Lớp thi' }}
        name={constants.DB_CLASSES_COLLECTION} 
        list={ClassList}
        create={ClassCreate}
        edit={ClassEdit} />
    </Admin>
  )
}

export default ClassesSupervisor;