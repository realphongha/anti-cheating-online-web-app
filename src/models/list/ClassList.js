import * as React from "react";
import * as constants from "../../utils/Constants";
import { List, Datagrid, TextField, EmailField, FunctionField,
  TextInput, Filter, RadioButtonGroupInput, ShowButton, DeleteButton,
  DateField
} 
  from 'react-admin';

const Search = props => (
  <Filter {...props}>
    <TextInput source="q" label="Tìm kiếm" alwaysOn resettable />
    <RadioButtonGroupInput source="status" label="Trạng thái" 
      choices={constants.CLASS_STATUS_MAP} />
  </Filter>
);

export const ClassList = (props) => (
  <List filters={<Search />}>
    <Datagrid>
      <TextField 
        label="Môn thi"
        source="name" />
      <TextField 
        label="Họ tên giám thị"
        source="supervisor.name" />
      <EmailField 
        label="Email giám thị"
        source="supervisor.email" />
      <DateField 
        label="Thời gian bắt đầu"
        source="start.$date" 
        showTime />
      <DateField 
        label="Thời gian kết thúc"
        source="end.$date"
        emptyText="Chưa có" 
        showTime />
      <FunctionField
        label="Thời gian thi"
        render={class_ => class_.last + " phút"} />
      <FunctionField 
        label="Trạng thái"
        render={class_ => constants.CLASS_STATUS[class_.status]} /> 
      <ShowButton label="Xem chi tiết" />
      <DeleteButton label="Xóa" />
    </Datagrid>
  </List>
);