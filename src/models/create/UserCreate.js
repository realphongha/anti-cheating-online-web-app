import * as React from "react";
import * as constants from "../../utils/Constants";
import { Create, Datagrid, TextField, EmailField, NumberField, DateField, 
  FunctionField, SimpleForm, TextInput, SelectInput } 
  from 'react-admin';

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput 
        source="email" 
        type="email"/>
      <TextInput 
        label="Mật khẩu"
        source="password" />
      <TextInput 
        label="Nhập lại mật khẩu"
        source="c_password" />
      <TextInput 
        label="Họ tên"
        source="name" />
      <TextInput 
        label="Số điện thoại"
        source="phone" />
      <SelectInput
        label="Vai trò"
        source="role"
        choices={constants.USER_ROLE_MAP} />
    </SimpleForm>
  </Create>
);