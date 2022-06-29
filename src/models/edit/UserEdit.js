import * as React from "react";
import * as constants from "../../utils/Constants";
import { Edit, SimpleForm, TextInput, SelectInput } 
  from 'react-admin';

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput 
        source="email" 
        type="email"/>
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
      <SelectInput
        label="Trạng thái"
        source="status"
        choices={constants.USER_STATUS_MAP} />
    </SimpleForm>
  </Edit>
);