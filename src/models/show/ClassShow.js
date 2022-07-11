import * as React from "react";
import { Show, SimpleShowLayout, TextField, EmailField, DateField,
  FunctionField, ArrayField, Datagrid, ImageField }
  from 'react-admin';
import * as constants from "../../utils/Constants";

export const ClassShow = (props) => (
  <Show>
    <SimpleShowLayout>
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
        showTime />
      <FunctionField
        label="Thời gian thi"
        render={class_ => class_.last + " phút"} />
      <FunctionField
        label="Trạng thái"
        render={class_ => constants.CLASS_STATUS[class_.status]} />
      {
      props.admin &&
      <ArrayField
        label="Học sinh"
        source="students"
        fieldKey="id">
          <Datagrid bulkActionButtons={false}>
            <TextField label="Họ tên" source="name" />
            <EmailField label="Email" source="email" />
            <TextField label="Số điện thoại" source="phone" />
          </Datagrid>
      </ArrayField>
      }
      {
      props.admin &&
      <ArrayField
        label="Gian lận"
        source="cheatings"
        fieldKey="id">
          <Datagrid bulkActionButtons={false}>
            <TextField label="Học sinh" source="student.name" />
            <EmailField label="Email" source="student.email" />
            <TextField label="Ghi chú" source="note" />
            <DateField label="Thời gian" source="time.$date" showTime />
            <FunctionField label="Ảnh"
              render={
                student => <img
                  className="cheatingImg"
                  alt="Không có ảnh"
                  src={(student.image && student.image["$binary"])?
                    "data:image/jpeg;base64," + student.image["$binary"].base64:
                    null
                  } />
              } />
          </Datagrid>
      </ArrayField>
      }
    </SimpleShowLayout>
  </Show>
);
