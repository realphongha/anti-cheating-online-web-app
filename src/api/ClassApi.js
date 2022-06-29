import axios from "axios";
import * as constants from "../utils/Constants";

export const ClassApi = {
  getOneClass: (token, id) => {
    return axios({
      method: "get",
      url: `${constants.backend}/classes/${id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    })
  },
  addStudents: (token, id, emails) => {
    return axios({
      method: "put",
      url: `${constants.backend}/classes/add_students/${id}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      data: {
        emails: emails
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    })
  },
  deleteStudents: (token, classId, studentId) => {
    return axios({
      method: "delete",
      url: `${constants.backend}/classes/delete_student`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      data: {
        class_id: classId,
        student_id: studentId
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    })
  },
  changeSettings: (token, trackPerson, trackMouse, trackKeyboard, 
    trackLaptop, classId) => {
    return axios({
      method: "put",
      url: `${constants.backend}/classes/${classId}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      data: {
        settings: {
          track_laptop: trackLaptop,
          track_mouse: trackMouse,
          track_keyboard: trackKeyboard,
          track_person: trackPerson
        }
      },
      maxContentLength: 100000000,
      maxBodyLength: 1000000000,
    })
  }
}