import * as React from "react";
import * as constants from "../../utils/Constants";
import { List, Datagrid, TextField, EmailField, FunctionField,
  TextInput, Filter, RadioButtonGroupInput, ShowButton, DeleteButton
} 
  from 'react-admin';

const Search = props => (
  <Filter {...props}>
    <TextInput source="q" label="Tìm kiếm" alwaysOn resettable />
    <RadioButtonGroupInput source="role" label="Vai trò" 
      choices={constants.USER_ROLE_MAP} />
    <RadioButtonGroupInput source="status" label="Trạng thái" 
      choices={constants.USER_STATUS_MAP} />
  </Filter>
);

export const UserList = () => (
  <List filters={<Search />}>
    <Datagrid>
      <EmailField 
        source="email" />
      <TextField 
        label="Họ tên"
        source="name" />
      <TextField 
        label="Số điện thoại"
        source="phone" />
      <FunctionField 
        label="Vai trò" 
        render={user => constants.USER_ROLE[user.role]} />
      <FunctionField 
        label="Trạng thái"
        render={user => constants.USER_STATUS[user.status]} /> 
      <ShowButton label="Xem chi tiết" />
      <DeleteButton label="Khóa/Mở" />
    </Datagrid>
  </List>
);