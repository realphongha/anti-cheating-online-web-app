import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faCamera, faCheck, faXmark, faEye }
  from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from "react-router-dom";
import { toDDMMYYHHSS, msecToHHMMSS } from "../../utils/DateTime";
import * as constants from "../../utils/Constants";
import { validateEmail } from "../../utils/String";
import { ClassApi } from "../../api/ClassApi";
import { CheatingApi } from "../../api/CheatingApi";
import { b64StrToFile } from "../../utils/Storage";
import { message } from "react-message-popup";
import Popup from 'reactjs-popup';
import { Chip } from "@mui/material";
import { io } from "socket.io-client";
import Dexie from 'dexie';
import ImageGallery from 'react-image-gallery';
import _ from "lodash";

// adding students to exam popup
const AddStudentPopup = (props) => {
  var [emails, setEmails] = useState([]);
  var [text, setText] = useState("");
  var [invalidEmail, setInvalidEmail] = useState(false);

  const onChangeText = (event) => {
    setText(event.target.value);
    setInvalidEmail(false);
    let newEmails = textToEmails(event.target.value);
    if (newEmails == null) {
      setEmails([]);
      setInvalidEmail(true);
    } else {
      setEmails(newEmails);
    }
  }

  const textToEmails = (text) => {
    let newEmails = text.split(",");
    for (let i = 0; i < newEmails.length; i++) {
      newEmails[i] = newEmails[i].trim();
      if (!validateEmail(newEmails[i])) {
        return null;
      }
    }
    return newEmails;
  }

  const onDeleleEmail = (i) => {
    let newEmails = [...emails];
    newEmails.splice(i, 1);
    setEmails(newEmails);
  }

  const onAddStudents = async () => {
    if (emails.length === 0) {
      message.error("Không có email nào để thêm!", 4000);
    } else {
      try {
        let res = await ClassApi.addStudents(
          localStorage.getItem("token"), props.classId, emails
        );
        message.info("Thêm học sinh thành công!", 4000);
        setEmails([]);
        setText("");
        props.getData();
      } catch (err) {
        console.log(err);
        if (err.response && (err.response.status === 400 || 
                             err.response.status === 404 ||
                             err.response.status === 401)) {
          message.error(err.response.data.message, 4000);
          console.log(err.response.data.message);
        } else {
          message.error("Lỗi server", 4000);
          console.log("Internal error");
        }
      }
    }
  }

  return (
    <Popup trigger={props.triggerElement}
      closeOnDocumentClick
      modal>
      {close => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header">Thêm học sinh</div>
          <div className="content">
            <textarea maxLength={100000}
              cols={50}
              rows={5}
              value={text}
              onChange={onChangeText}
              required
              placeholder="Nhập email học sinh ở đây (nhiều email cách nhau bởi dấu phẩy)..." />
            <br />
            {
              emails.map((email, i) =>
                <Chip key={i} label={email} variant="outlined"
                  onDelete={() => onDeleleEmail(i)} />
              )
            }
            {
              text &&
              <p>Nhập email học sinh (nhiều email cách nhau bởi dấu phẩy)</p>
            }
            {
              invalidEmail &&
              <p style={{ color: "red" }}>Tồn tại email không hợp lệ</p>
            }
          </div>
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                onAddStudents();
              }}>
              Thêm
            </button>
            <button
              className="button"
              onClick={() => {
                close();
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </Popup>
  )
}

// showing cheatings for each students popup
const StudentCheatingPopup = (props) => {
  const [images, setImages] = useState({});

  useEffect(() => {
    getImages();
  }, [props.cheatings]);

  const getImages = async () => {
    let newImages = {};
    await props.db.current.cheatingImages
      .where({
        student_id: props.studentId,
        class_id: props.classId
      })
      .each(image => {
        console.log("set", image)
        if (image.image.base64) {
          newImages[image.id] = image.image.base64;
        } else {
          newImages[image.id] = "";
        }
      });
    setImages(newImages);
  }

  const onDeleteCheating = async (cheating, i) => {
    try {
      let res = await CheatingApi.deleteCheating(
        localStorage.getItem("token"), cheating.id, props.classId
      );
      message.info("Xóa gian lận thành công!", 4000);
      let newCheatings = props.cheatings;
      let newCheating = props.cheatings[props.studentId];
      newCheating.splice(i, 1);
      newCheatings[props.studentId] = newCheating;
      props.setCheatings(newCheatings);
    } catch (err) {
      console.log(err);
      if (err.response && (err.response.status === 400 || err.response.status === 403)) {
        message.error(err.response.data.message, 4000);
        console.log(err.response.data.message);
      } else {
        message.error("Lỗi server", 4000);
        console.log("Internal error");
      }
    }
  }

  return (
    <Popup trigger={props.triggerElement}
      closeOnDocumentClick
      modal
      nested>
      {close => (
        <div className="modal nonTranslucentModal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header">Danh sách gian lận</div>
          <div className="content cheatingList">
            {
              images && props.cheatings[props.studentId] && props.cheatings[props.studentId].map((cheating, i) =>
                <div key={cheating.id}>
                  <p>
                    Lý do: "{cheating.note}"<br /> Thời gian: {toDDMMYYHHSS(new Date(cheating.time.$date))}
                  </p>
                  <Popup trigger={
                    <span className="clickable">
                      <FontAwesomeIcon icon={faEye} />
                    </span>
                  }
                    closeOnDocumentClick>
                    <img className="cheatingImg"
                      alt="Không có ảnh"
                      src={"data:image/jpeg;base64," + images[cheating.id]} />
                  </Popup>
                  <FontAwesomeIcon className="clickable" icon={faXmark}
                    onClick={
                      () => onDeleteCheating(cheating, i)
                    } />
                </div>
              )
            }
          </div>
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                close();
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </Popup>
  )
}

// handling sus images popup
const SusImagePopup = (props) => {
  const [image, setImage] = useState(null);
  const [cheating, setCheating] = useState(null);
  const [note, setNote] = useState(null);

  useEffect(() => {
    getImage();
    setCheating(props.cheating);
    setNote(`${props.cheating.note}`);
  }, []);

  const getImage = async () => {
    if (props.cheating) {
      if (props.cheating.image_id){
        let imageRecord = await props.db.current.susImages
          .where({ id: props.cheating.image_id })
          .first();
        setImage(imageRecord.image);
      }
    }
  }

  const onSaveCheating = async () => {
    try {
      let res = await CheatingApi.createCheating(
        localStorage.getItem("token"), props.classId, cheating.studentId,
        b64StrToFile(image, "img.jpeg"), note
      );
      onRemoveNoti();
      if (res.data) {
        props.addCheating(cheating.studentId, res.data, image);
        message.info("Lưu gian lận thành công!", 4000);
      } else {
        message.error("Lưu gian lận thất bại!", 4000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && (err.response.status === 400 || err.response.status === 403)) {
        message.error(err.response.data.message, 4000);
        console.log(err.response.data.message);
      } else {
        message.error("Lỗi server", 4000);
        console.log("Internal error");
      }
    }
  }

  const onRemoveNoti = () => {
    let newNotis = props.notis;
    newNotis.splice(props.i, 1);
    props.setNotis(newNotis);
  }

  return (
    <Popup trigger={props.triggerElement}
      closeOnDocumentClick
      modal>
      {close => (
        <div className="modal nonTranslucentModal susImage">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header">Ảnh</div>
          <div className="content">
            {
              image &&
              <img className="cheatingImg"
                src={"data:image/jpeg;base64," + image} />
            }
            <p>Lý do:</p>
            <input className="inputText" type="text"
              value={note}
              onChange={t => setNote(t.target.value)} />
          </div>
          <div className="actions">
            <button
              className="button"
              onClick={() => {
                onSaveCheating();
                close()
              }}
            >
              Lưu
            </button>
            <button
              className="button"
              onClick={() => {
                onRemoveNoti();
                close();
              }}
            >
              Xóa
            </button>
            <button
              className="button"
              onClick={() => {
                close();
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </Popup>
  )
}

// handling regular supervising images popup
const ImagesPopup = (props) => {
  const [images, setImages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [countAll, setCountAll] = useState(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const imgPerPage = 7;
  const galleryRef = useRef();

  useEffect(() => {
    getCountImages();
  }, [props.studentMaps]);

  useEffect(() => {
    if (!countAll || !currentPage) return;
    getImages();
  }, [countAll, currentPage, props.studentMaps]);

  const getCountImages = async () => {
    if (props.studentId) {
      let count = await props.db.current.regularImages
        .where({
          student_id: props.studentId,
          class_id: props.classId
        })
        .count();
      setCountAll(count);
      setCurrentPage(Math.ceil(count / imgPerPage));
    }
  }

  const getImages = async () => {
    if (props.studentId) {
      let newImages = [];
      let offset = countAll - (Math.ceil(countAll / imgPerPage) - currentPage + 1) * imgPerPage;
      offset = (offset >= 0?offset:0);
      let limit = (offset >= 0 ? imgPerPage : imgPerPage + offset);
      await props.db.current.regularImages
        .where({
          student_id: props.studentId,
          class_id: props.classId
        })
        .sortBy("time", (arr) => {
          for (let i = offset; i < offset+limit; i++){
            newImages.push({
              original: "data:image/jpeg;base64," + arr[i].image,
              thumbnail: "data:image/jpeg;base64," + arr[i].image,
              id: arr[i].id
            });
          }
        });
      setImages(newImages);
    }
  }

  const onPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const onNext = () => {
    if (currentPage < Math.ceil(countAll / imgPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  }

  const onSaveCheating = async (image) => {
    try {
      let res = await CheatingApi.createCheating(
        localStorage.getItem("token"), props.classId, props.studentId,
        b64StrToFile(image, "img.jpeg"), note
      );
      if (res.data) {
        props.addCheating(props.studentId, res.data, image);
        message.info("Lưu gian lận thành công!", 4000);
      } else {
        message.err("Lưu gian lận thất bại!", 4000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && (err.response.status === 400 || err.response.status === 403)) {
        message.error(err.response.data.message, 4000);
        console.log(err.response.data.message);
      } else {
        message.error("Lỗi server", 4000);
        console.log("Internal error");
      }
    }
  }

  return (
    <Popup trigger={props.triggerElement}
      closeOnDocumentClick
      modal>
      {close => (
        <div className="modal nonTranslucentModal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header">Ảnh giám sát thường xuyên</div>
          <div className="content">
            {
              images &&
              <ImageGallery items={images} ref={galleryRef}
                infinite={false} showPlayButton={false}
                showFullscreenButton={false} startIndex={imgPerPage-1}
              />
            }
          </div>
          <div className="actions">
            {images &&
              <a>
                <FontAwesomeIcon className="clickable leftBtn"
                  icon={faAngleLeft}
                  onClick={() => onPrev()} />
                Trang {currentPage} trên {Math.ceil(countAll / imgPerPage)}
                <FontAwesomeIcon className="clickable rightBtn"
                  icon={faAngleRight}
                  onClick={() => onNext()} />
              </a>
            }
            {
              saving &&
              <input className="inputText" type="text"
                placeholder="Nhập lý do gian lận..."
                value={note} onChange={t => setNote(t.target.value)} />
            }
            <button
              className="button"
              onClick={() => {
                if (saving) {
                  let i = galleryRef.current.getCurrentIndex();
                  onSaveCheating(images[i].original)
                } else {
                  setSaving(true);
                }
              }}
            >
              {
                saving ?
                  "Lưu" :
                  "Đánh dấu gian lận"
              }
            </button>
            <button
              className="button"
              onClick={() => {
                setSaving(false);
                close();
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </Popup>
  )
}

// time remaining bar
const TimeStatus = (props) => {
  const [remainingTimeStart, setRemainingTimeStart] = useState(null);
  const [remainingTimeEnd, setRemainingTimeEnd] = useState(null);

  useEffect(() => {
    if (props.timeStatus === "not_started") {
      let intervalUpdateTimeStart = setInterval(() => {
          let diff = props.start - new Date();
          if (diff < 0) {
            props.setTimeStatus("in_progress");
            clearInterval(intervalUpdateTimeStart);
            return;
          }
          setRemainingTimeStart(msecToHHMMSS(diff));
        },
        250
      );
      return () => {
        clearInterval(intervalUpdateTimeStart);
      }
    } else if (props.timeStatus === "in_progress") {
      let intervalUpdateTimeEnd = setInterval(() => {
          let diff = new Date(props.start.getTime() + props.last*60000) - new Date();
          if (diff < 0) {
            props.setTimeStatus("ended");
            clearInterval(intervalUpdateTimeEnd);
            return;
          }
          setRemainingTimeEnd(msecToHHMMSS(diff));
        },
        250
      );
      return () => {
        clearInterval(intervalUpdateTimeEnd);
      }
    }
  }, [props.timeStatus]);

  return (
    <div className="examStatus">
      <p><b>
        {
          props.timeStatus === "in_progress" ?
            "Đang trong thời gian thi..." :
            (props.timeStatus === "ended" ?
              "Lớp thi đã kết thúc" :
              "Lớp thi chưa diễn ra"
            )
        }
      </b></p>
      {
        props.timeStatus !== "ended" &&
        (
          props.timeStatus === "in_progress" ?
            <p>Thời gian thi còn lại: {remainingTimeEnd}</p>
            :
            <p>Bắt đầu thi trong: {remainingTimeStart}</p>
        )
      }
    </div>
  )
}

const Exam = (props) => {
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [studentPage, setStudentPage] = useState(1);
  const [notisPerPage, setNotisPerPage] = useState(10);
  const [notiPage, setNotiPage] = useState(1);
  const [classId, setClassId] = useState(null);
  const [timeStatus, setTimeStatus] = useState(null);
  const [focus, setFocus] = useState("students");
  const [start, setStart] = useState(null);
  const [last, setLast] = useState(null);
  const [end, setEnd] = useState(null);
  const [trackPerson, setTrackPerson] = useState(true);
  const [trackMouse, setTrackMouse] = useState(true);
  const [trackKeyboard, setTrackKeyboard] = useState(true);
  const [trackLaptop, setTrackLaptop] = useState(true);
  const [students, setStudents] = useState([]);
  const [studentMaps, setStudentMaps] = useState({});
  const requestEndStatus = useRef({});
  const [cheatings, setCheatings] = useState({});
  const [notis, setNotis] = useState([]);
  const [socketio, setSocketio] = useState(null);
  const db = useRef(null);
  const loc = useLocation();
  const navigate = useNavigate();

  // initializing socketio
  useEffect(() => {
    if (timeStatus != "in_progress") return;
    const socket = io(constants.backend, {
      extraHeaders: {
        "x-access-token": localStorage.getItem("token")
      }
    });
    setSocketio(socket);
  }, [timeStatus])

  // initializing socketio listening and emitting events
  useEffect(() => {
    if (timeStatus !== "in_progress") {
      if (socketio && timeStatus === "ended") {
        socketio.emit("handle_end_exam", {
          class_id: classId,
        });

        socketio.removeAllListeners();
        socketio.disconnect();
        if (db.current !== null) {
          db.current.delete();
        }
      }
      return;
    }
    if (!socketio || !studentMaps || !loc.state) return;

    socketio.on("connect", () => {
      console.log("connected", socketio.id);
    });

    socketio.on("disconnect", () => {
      console.log("disconnected", socketio.id);
    });

    socketio.on("handle_end_request", (data) => {
      if (data.class_id !== classId) return;
      console.log(data);
      let newNotis = notis;
      let student = null;
      if (data.student_id in studentMaps) {
        student = studentMaps[data.student_id];
        if (student && requestEndStatus.current[data.student_id] === constants.NOT_REQUESTED_STATUS) {
          newNotis.push({
            type: "endRequest",
            name: student.name,
            studentId: data.student_id,
            sid: data.sid
          });
          requestEndStatus.current[data.student_id] = constants.REQUESTING_STATUS;
        }
        setNotis(newNotis);
      }
    });

    socketio.on("handle_image", (data) => {
      if (data.class_id !== classId) return;
      console.log("regular image:");
      console.log(data);
      imgb64toDB(data.image, data.uuid, data.student_id,
        db.current.regularImages);
      let newStudentMaps = _.cloneDeep(studentMaps);
      if (data.student_id in newStudentMaps ) {
        console.log(newStudentMaps);
        pushToPicsQueue(
          newStudentMaps[data.student_id]["pictures"], {
          studentId: data.student_id,
          image_id: data.uuid,
          note: "",
          time: new Date()
        });
        setStudentMaps(newStudentMaps);
      }
    });

    socketio.on("handle_cheating_image", (data) => {
      if (data.class_id !== classId) return;
      console.log("cheating image:");
      console.log(data);
      imgb64toDB(data.image, data.uuid, data.student_id,
        db.current.susImages);
      let newNotis = notis;
      let student = null;
      if (data.student_id in studentMaps) {
        student = studentMaps[data.student_id];
        console.log(student);
        if (student) {
          console.log(student);
          newNotis.push({
            type: "cheating",
            name: student.name,
            studentId: student.id,
            image_id: data.uuid,
            note: data.note,
          });
          setNotis(newNotis);
        }
      }
    });

    socketio.emit("join", {
      class_id: classId ? classId : loc.state.classId,
    });

    let intervalBroadcastId = setInterval(() => {
      socketio.emit("broadcast_supervisor_sid", {
        class_id: classId ? classId : loc.state.classId,
      });
    }, constants.INTERVAL_BROADCAST_SID);

    return () => {
      clearInterval(intervalBroadcastId);
    }
  }, [socketio, timeStatus])

  // initializing IndexedDB and exam data
  useEffect(() => {
    if (!classId) return;
    db.current = new Dexie('db');
    db.current.version(1).stores({
      cheatingImages: 'id, [student_id+class_id]',
      susImages: 'id, class_id',
      regularImages: 'id, [student_id+class_id]'
    });
    db.current.open().catch((err) => {
      console.log(err.stack || err);
    })
    getData(classId);
  }, [classId]);

  // checking classId
  useEffect(() => {
    if (loc.state && loc.state.classId) {
      setClassId(loc.state.classId);
    } else {
      navigate("/");
    }
  }, []);

  // getting init exam data
  const getData = async (id) => {
    try {
      if (id == null) {
        id = classId;
      }
      let res = await ClassApi.getOneClass(
        localStorage.getItem("token"), id);
      if (res.data) {
        let class_ = res.data;
        if (class_.status !== constants.CLASS_STATUS_ACTIVE) {
          message.error("Lớp thi không tổn tại!",
            4000);
        }
        let newStudents = class_.students;
        let newStudentMaps = {};
        for (let i = 0; i < newStudents.length; i++) {
          newStudents[i]["pictures"] = [];
          requestEndStatus.current[newStudents[i].id] = constants.NOT_REQUESTED_STATUS;
          newStudentMaps[newStudents[i].id] = newStudents[i];
        }
        setStudents(newStudents);
        setStudentMaps(newStudentMaps);
        let cheatings_ = class_.cheatings;
        let newCheatings = {};
        for (let i = 0; i < cheatings_.length; i++) {
          let studentId = cheatings_[i].student.id;
          let img = null;
          if (cheatings_[i].image && cheatings_[i].image.$binary){
            img = cheatings_[i].image.$binary;
          }
          await db.current.cheatingImages.add({
            id: cheatings_[i].id,
            student_id: cheatings_[i].student.id,
            image: img,
            class_id: classId
          }).catch(err => console.log(err));
          delete cheatings_[i].image;
          if (studentId in newCheatings) {
            newCheatings[studentId].push(cheatings_[i]);
          } else {
            newCheatings[studentId] = [cheatings_[i]];
          }
        }
        setCheatings(newCheatings);
        delete class_["cheatings"];
        setStart(new Date(class_.start.$date));
        setEnd(class_.end ? new Date(class_.end.$date) : null);
        setLast(class_.last);
        let now = new Date();
        if (now < new Date(class_.start.$date)) {
          setTimeStatus("not_started");
        } else if (end) {
          setTimeStatus("ended");
        } else {
          setTimeStatus("in_progress");
        }
        let settings = class_.settings;
        setTrackPerson(settings.track_person);
        setTrackKeyboard(settings.track_keyboard);
        setTrackLaptop(settings.track_laptop);
        setTrackMouse(settings.track_mouse);
        // console.log(class_);
      } else {
        message.error("Không thể lấy thông tin lớp thi!",
          4000);
      }
    } catch (err) {
      console.log(err);
      if (err.response && (err.response.status === 404)) {
        message.error(err.response.data.message, 4000);
        console.log(err.response.data.message);
      } else {
        message.error("Lỗi server", 4000);
        console.log("Internal error");
      }
    }
  }

  const addCheating = async (studentId, cheating, image) => {
    if (cheating._id) {
      cheating.id = cheating._id.$oid;
      cheating.student = {id: cheating.student_id}
    }
    console.log("cheating:", cheating, image);
    if (image.slice(0, 10) === "data:image") {
      image = image.split(",")[1]
    }
    let newCheatings = _.cloneDeep(cheatings);
    await db.current.cheatingImages.add({
      id: cheating.id,
      student_id: studentId,
      image: {
        base64: image,
        subType: "00"
      },
      class_id: classId
    }).catch(err => console.log(err));
    delete cheating.image;
    if (studentId in newCheatings) {
      newCheatings[studentId].push(cheating)
    } else {
      newCheatings[studentId] = [cheating];
    }
    setCheatings(newCheatings);
  }

  // saving base64 image to IndexedDB 
  const imgb64toDB = async (b64, uuid, studentId, store) => {
    await store.add({
      id: uuid,
      student_id: studentId,
      image: b64,
      class_id: classId,
      time: (new Date())/1000
    })
      .catch(err => console.log(err));
  }

  // pushing regular supervising images to DB (and deleting too old images)
  const pushToPicsQueue = async (listPics, newPic) => {
    listPics.push(newPic);
    if (listPics.length > constants.MAX_SUPERVISING_IMAGES) {
      for (let i = 0; i < listPics.length - constants.MAX_SUPERVISING_IMAGES; i++) {
        await db.current.regularImages.delete(listPics[i].image_id);
      }
      listPics.splice(0, listPics.length-constants.MAX_SUPERVISING_IMAGES);
    }
  }

  // checking regular supervising images
  const checkRegularImages = () => {
    if (timeStatus !== "in_progress") return;
    if (studentMaps) {
      let newNotis = notis;
      let lastTime = null;
      for (let id in studentMaps) {
        let s = studentMaps[id];
        if (requestEndStatus.current[id] === constants.ENDED_STATUS) continue;
        lastTime = s.pictures[s.pictures.length-1]; 
        if (!(lastTime && (new Date() - lastTime.time) < constants.PATIENCE_SUPERVISING_IMAGES )) {
          newNotis.push({
            type: "cheating",
            name: s.name,
            studentId: s.id,
            image_id: null,
            note: "Không nhận được ảnh giám sát!",
          });
        }
      }
      setNotis(newNotis);
    }
  }

  const onSaveSettings = async () => {
    try {
      let res = await ClassApi.changeSettings(
        localStorage.getItem("token"), trackPerson, trackMouse, trackKeyboard,
        trackLaptop, classId);
      message.info("Lưu cấu hình giám sát thành công!", 4000);
    } catch (err) {
      console.log(err);
      if (err.response && (err.response.status === 400 || 
                           err.response.status === 403)) {
        message.error(err.response.data.message, 4000);
        console.log(err.response.data.message);
      } else {
        message.error("Lỗi server", 4000);
        console.log("Internal error");
      }
    }
  }


  const toggleFocus = (button) => {
    if (button === focus) {
      setFocus("none");
    } else {
      setFocus(button);
    }
  }

  const removeNoti = (i) => {
    let newNotis = notis;
    newNotis.splice(i, 1);
    setNotis(newNotis);
  }

  const removeAllNotis = () => {
    setNotis([]);
  }

  const onDeleteStudent = async (studentId) => {
    let result = window.confirm("Bạn có muốn xóa học sinh khỏi lớp?");
    if (!result) return;
    try {
      let res = await ClassApi.deleteStudents(
        localStorage.getItem("token"), classId, studentId);
      getData();
    } catch (err) {
      console.log(err);
      if (err.response && (err.response.status === 404 || 
                           err.response.status === 400 ||
                           err.response.status === 401)) {
        message.error(err.response.data.message, 4000);
        console.log(err.response.data.message);
      } else {
        message.error("Lỗi server", 4000);
        console.log("Internal error");
      }
    }
  }

  const onAcceptEndRequest = (studentId, sid, i) => {
    socketio.emit("handle_end_request", {
      class_id: classId,
      type: "reply",
      accept: true,
      student_id: studentId,
      sid: sid
    });
    requestEndStatus.current[studentId] = constants.ENDED_STATUS;
    removeNoti(i);
  }

  const onDeclineEndRequest = (studentId, sid, i) => {
    socketio.emit("handle_end_request", {
      class_id: classId,
      type: "reply",
      decline: true,
      student_id: studentId,
      sid: sid
    });
    requestEndStatus.current[studentId] = constants.NOT_REQUESTED_STATUS;
    removeNoti(i);
  }

  return (
    <>
      {
        timeStatus && start && last &&
        <TimeStatus timeStatus={timeStatus} setTimeStatus={setTimeStatus}
          start={start} end={end} last={last} />
      }
      <div className="examData">
        <button onClick={() => toggleFocus("students")}>
          Danh sách học sinh
        </button>
        {(focus === "students") && students && cheatings &&
          students.slice((studentPage - 1) * studentsPerPage, studentPage * studentsPerPage).map((student, i) =>
            <div key={i + (studentPage - 1) * studentsPerPage}>
              <p style={{ flex: 2 }}>{student.name}</p>
              {
                (cheatings[student.id] && cheatings[student.id].length > 0) ?
                  <StudentCheatingPopup
                    cheatings={cheatings}
                    setCheatings={setCheatings}
                    studentId={student.id}
                    classId={classId}
                    db={db}
                    triggerElement={
                      <p className="clickable"
                        style={{ flex: 2, fontWeight: "bold", color: "red" }}>
                        Gian lận {cheatings[student.id].length} lần
                      </p>
                    } />
                  :
                  <p className="clickable"
                    style={{ flex: 2, fontWeight: "bold", color: "green" }}>
                    Chưa gian lận
                  </p>
              }
              <p style={{ fontWeight: "bold", flex: 1 }}>
                ẢNH GIÁM SÁT&nbsp;&nbsp;&nbsp;&nbsp;
                <ImagesPopup triggerElement={
                    <FontAwesomeIcon icon={faCamera} className="clickable" />
                  }
                  studentId={student.id}
                  classId={classId}
                  addCheating={addCheating}
                  db={db}
                  studentMaps={studentMaps} />
              </p>
              <FontAwesomeIcon icon={faXmark} className="clickable"
                color={constants.red}
                style={{flex: 1, alignSelf: "center", fontSize: 30}}
                onClick={() => onDeleteStudent(student.id)} />
            </div>
          )}
        {(focus === "students") &&
          <div className="footer">
            <div style={{ flex: 1 }}>
              <FontAwesomeIcon icon={faAngleLeft} className="clickable"
                onClick={() => {
                  if (studentPage > 1) setStudentPage(studentPage - 1);
                }}
                color={(studentPage > 1) ? constants.black : constants.gray} />
              <p><b>Trang {studentPage} trên {Math.ceil(students.length / studentsPerPage)}</b></p>
              <FontAwesomeIcon icon={faAngleRight} className="clickable"
                onClick={() => {
                  if (studentPage < Math.ceil(students.length / studentsPerPage)) setStudentPage(studentPage + 1);
                }}
                color={(studentPage < Math.ceil(students.length / studentsPerPage)) ? constants.black : constants.gray} />
            </div>
            <div style={{ flex: 1, justifyContent: "flex-end" }}>
              <AddStudentPopup classId={classId} getData={getData}
                triggerElement={
                  <input className="inputBtn" type="button" value="Thêm học sinh" />
                } />
              <input className="inputBtn" type="button" 
                value="Kiểm tra học sinh vắng"
                onClick={() => checkRegularImages()} />
            </div>
          </div>
        }
        <button onClick={() => toggleFocus("notis")}>Thông báo ({notis.length})</button>
        {(focus === "notis") &&
          notis.slice((notiPage - 1) * notisPerPage, notiPage * notisPerPage).map((noti, i) =>
            <div key={i + (notiPage - 1) * notisPerPage}>
              <p style={{ flex: 2 }}>{noti.name + " "}{noti.type === "cheating" ? `có thể đang gian lận ("${noti.note}")` : "yêu cầu dừng thi"}</p>
              {(noti.type === "cheating") ?
                <p style={{ fontWeight: "bold", flex: 1 }}>
                  XEM
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <SusImagePopup
                    db={db}
                    i={i + (notiPage - 1) * notisPerPage}
                    notis={notis}
                    setNotis={setNotis}
                    addCheating={addCheating}
                    cheating={noti}
                    classId={classId}
                    triggerElement={
                      <FontAwesomeIcon icon={faCamera} className="clickable" />
                    } />
                </p>
                :
                <div style={{ flex: 1, alignItems: "center", fontSize: 30 }}>
                  <FontAwesomeIcon className="clickable"
                    icon={faCheck} color={constants.green}
                    onClick={() => onAcceptEndRequest(
                      noti.studentId, noti.sid, i + (notiPage - 1) * notisPerPage
                    )}
                  />&nbsp;&nbsp;&nbsp;&nbsp;
                  <FontAwesomeIcon className="clickable"
                    color={constants.red}
                    icon={faXmark} 
                    onClick={() => onDeclineEndRequest(
                      noti.studentId, noti.sid, i + (notiPage - 1) * notisPerPage
                    )}
                  />
                </div>
              }
              <FontAwesomeIcon className="clickable"
                icon={faXmark} color={constants.red}
                style={{ flex: 1, alignSelf: "center", fontSize: 30 }}
                onClick={() => removeNoti(i + (notiPage-1) * notisPerPage)} />
            </div>
          )}
        {(focus === "notis") &&
          <div className="footer">
            <div style={{ flex: 1 }}>
              <FontAwesomeIcon icon={faAngleLeft} className="clickable"
                onClick={() => {
                  if (notiPage > 1) setNotiPage(notiPage - 1);
                }}
                color={(notiPage > 1) ? constants.black : constants.gray} />
              <p><b>Trang {notiPage} trên {Math.ceil(notis.length / notisPerPage)}</b></p>
              <FontAwesomeIcon icon={faAngleRight} className="clickable"
                onClick={() => {
                  if (notiPage < Math.ceil(notis.length / notisPerPage)) setNotiPage(notiPage + 1);
                }}
                color={(notiPage < Math.ceil(notis.length / notisPerPage)) ? constants.black : constants.gray} />
            </div>
            <div style={{ flex: 1, justifyContent: "flex-end" }}>
              <input className="inputBtn" type="button" 
                value="Xóa tất cả thông báo"
                onClick={() => removeAllNotis()} />
            </div>
          </div>
        }
        <button onClick={() => toggleFocus("settings")}>Cấu hình giám sát</button>
        {(focus === "settings") &&
          <div style={{ flexDirection: "column", display: "flex" }}>
            <div className="checkboxDiv">
              <input type="checkbox"
                checked={trackPerson}
                onChange={() => setTrackPerson(!trackPerson)} />&nbsp;Theo dõi xuất hiện nhiều người
            </div>
            <div className="checkboxDiv">
              <input type="checkbox"
                checked={trackMouse}
                onChange={() => setTrackMouse(!trackMouse)} />&nbsp;Theo dõi sử dụng chuột
            </div>
            <div className="checkboxDiv">
              <input type="checkbox"
                checked={trackKeyboard}
                onChange={() => setTrackKeyboard(!trackKeyboard)} />&nbsp;Theo dõi sử dụng bàn phím
            </div>
            <div className="checkboxDiv">
              <input type="checkbox"
                checked={trackLaptop}
                onChange={() => setTrackLaptop(!trackLaptop)} />&nbsp;Theo dõi sử dụng laptop
            </div>
            <input className="inputBtn" type="button" value="Lưu"
              onClick={() => onSaveSettings()}
              style={{
                width: "10%",
                marginLeft: "20px"
              }} />
          </div>
        }
      </div>
    </>
  )
}

export default Exam;