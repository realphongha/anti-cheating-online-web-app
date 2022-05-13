import { useState } from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from 'ra-data-json-server';
import { UserList } from "../../models/UserList";
import ReactAdminHeaderLayout from "../layouts/ReactAdminHeaderLayout";

const ClassesSupervisor = () => {

  const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

  return (
    <Admin basename="/supervisor/classes" dataProvider={dataProvider}
      layout={ReactAdminHeaderLayout}>
      <Resource name="users" list={UserList} />
    </Admin>
  )
}

export default ClassesSupervisor;