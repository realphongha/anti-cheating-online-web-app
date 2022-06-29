import * as React from "react";
import { Edit, SimpleForm, TextInput, DateTimeInput, NumberInput, FunctionField }
  from 'react-admin';
import * as constants from "../../utils/Constants";
import { useNavigate } from "react-router-dom";

export const ClassEdit = () => {
  const navigate = useNavigate();

  return (
    <Edit>
      <SimpleForm>
        <TextInput
          label="Tên lớp thi"
          source="name" />
        <DateTimeInput
          label="Thời gian bắt đầu"
          source="start.$date" />
        <NumberInput
          min={1}
          max={360}
          label="Thời gian thi (phút)"
          source="last" />
        <FunctionField
          label="Vào lớp thi"
          render={
            class_ =>
              <button onClick={() => navigate("/supervisor/exam", {
                state: {
                  classId: class_.id
                }
              })}>
                Vào lớp thi
              </button>
          } />
      </SimpleForm>
    </Edit>
  )
};