import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faPlus, faCamera, faCheck, faXmark } 
  from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { toHHMMSS } from "../../utils/DateTime";
import * as constants from "../../utils/Constants";

const Exam = () => {
  var [currentTime, setCurrentTime] = useState(toHHMMSS(new Date()));
  var [focus, setFocus] = useState("students");
  var [students, setStudents] = useState([
    {
      "name": "Virgie Grenier",
    },
    {
      "name": "Morton Larry",
    },
    {
      "name": "Delphine Pickering",
    },
    {
      "name": "Virgie Grenier",
    },
    {
      "name": "Morton Larry",
    },
  ]);
  var [notis, setNotis] = useState([
    {
      "name": "Virgie Grenier",
      "type": "endRequest",
    },
    {
      "name": "Morton Larry",
      "type": "cheating",
    },
    {
      "name": "Delphine Pickering",
      "type": "endRequest",
    },
    {
      "name": "Virgie Grenier",
      "type": "endRequest",
    },
    {
      "name": "Morton Larry",
      "type": "cheating",
    },
  ]);

  useEffect(() => {
    let intervalId = setInterval(() =>
      setCurrentTime(toHHMMSS(new Date())),
      250
    );
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const toggleFocus = (button) => {
    if (button == focus){
      setFocus("none");
    } else {
      setFocus(button);
    }
  }

  const onPrev = () => {
    console.log("prev page");
  }

  const onNext = () => {
    console.log("next page");
  }

  return (
    <>
      <div className="examStatus">
        <p><b>Exam in progress...</b></p>
        <p>Time remaining: {currentTime}</p>
      </div>
      <div className="examData">
        <button onClick={() => toggleFocus("students")}>Students</button>
        {(focus === "students") &&
        students.map((student, i) => 
          <div key={i}>
            <p style={{flex: 2}}>{student.name}</p> 
            <p style={{flex: 2, fontWeight: "bold", color: "red"}}>
              Cheat 1 time(s)
            </p> 
            <p style={{flex: 1, fontWeight: "bold"}}>
              SHOW IMAGES&nbsp;&nbsp;&nbsp;&nbsp; 
              <FontAwesomeIcon icon={faCamera} />
            </p> 
          </div>
        )}
        {(focus === "students") &&
          <div className="footer">
            <div style={{flex: 1}}>
              <FontAwesomeIcon icon={faAngleLeft} />
              <p><b>Page 1 of 2</b></p>
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
            <div style={{flex: 1, justifyContent: "flex-end"}}>
              <FontAwesomeIcon icon={faPlus} />
              <p><b>ADD STUDENT</b></p>
            </div>
          </div>
        }
        <button onClick={() => toggleFocus("notis")}>Notifications (2)</button>
        {(focus === "notis") &&
        notis.map((noti, i) => 
          <div key={i}>
            <p style={{flex: 2}}>{noti.name + " "}{noti.type==="cheating"?"is suspicious":"requests to quit"}</p> 
            {(noti.type==="cheating")?
            <p style={{flex: 1, fontWeight: "bold"}}>
              SHOW IMAGES&nbsp;&nbsp;&nbsp;&nbsp; 
              <FontAwesomeIcon icon={faCamera} />
            </p>
            :
            <div style={{flex: 1, alignItems: "center", fontSize: 30}}>
              <FontAwesomeIcon icon={faCheck} color={constants.green} />&nbsp;&nbsp;&nbsp;&nbsp;
              <FontAwesomeIcon icon={faXmark} color={constants.red} />
            </div>
            }
          </div>
        )}
        {(focus === "notis") &&
          <div className="footer">
            <div style={{flex: 1}}>
              <FontAwesomeIcon icon={faAngleLeft} />
              <p><b>Page 1 of 2</b></p>
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          </div>
        }
        <button onClick={() => toggleFocus("settings")}>Settings</button>
        {(focus === "settings") &&
        <div style={{flexDirection: "column", display: "flex"}}>
          <div className="checkboxDiv">
            <input type="checkbox" value="" />&nbsp;Check more than one person
          </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="" />&nbsp;Check touching mouse
          </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="" />&nbsp;Check touching keyboard
          </div>
          <div className="checkboxDiv">
            <input type="checkbox" value="" />&nbsp;Check touching laptop  
          </div>
          <input className="inputBtn" type="button" value="Save"
            style={{
              width: "10%",
              marginLeft: "20px"
            }}/>
        </div>
        }
      </div>
    </>
  )
}

export default Exam;