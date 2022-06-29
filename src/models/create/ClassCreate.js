import * as React from "react";
import * as constants from "../../utils/Constants";
import { Create, SimpleForm, TextInput, DateTimeInput, NumberInput } 
  from 'react-admin';

export const ClassCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput
        label="Tên lớp thi" 
        source="name" />
      <DateTimeInput 
        label="Thời gian bắt đầu"
        source="start" />
      <NumberInput 
        min={1}
        max={360}
        label="Thời gian thi (phút)"
        source="last" />
    </SimpleForm>
  </Create>
);