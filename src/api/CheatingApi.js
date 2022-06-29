import axios from "axios";
import * as constants from "../utils/Constants";

export const CheatingApi = {
  createCheating: (token, classId, studentId, image, note) => {
    let formData = new FormData();
    formData.append('img', image);
    formData.append('student_id', studentId);
    formData.append('class_id', classId);
    formData.append('note', note);
    return axios.post(
      `${constants.backend}/cheatings`,
      formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        }
      }
    )
  },
  deleteCheating: (token, id, classId) => {
    return axios({
      method: "delete",
      url: `${constants.backend}/cheatings/${id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      data: {
        "class_id": classId
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    })
  },
}