import "../index.css"
import { useEffect, useState } from "react";
import SubjectCol from "./SubjectCol";
import DescCol from "./DescCol";
import FlexBetween from "./FlexBetween";
import DeadlineCol from "./DeadlineCol";
import StatusCol from "./StatusCol";
import { Add, Delete } from "@mui/icons-material";
import { Divider } from "@mui/material";

const CourseList = ({ userId }) => {
  const [isClickedAdd, setIsClickedAdd] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState(false);

  const getTasks = async () => {
    const response = await fetch(`http://localhost:8000/api/${userId}/todos`);
    const data = await response.json();
    setTasks(data);
  }

  useEffect(() => {
    getTasks()
  }, [tasks])

  const addTask = async () => {
    if (subject && desc && deadline) {
      await fetch(`http://localhost:8000/api/${userId}/todo`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        method: 'POST',
        body: JSON.stringify({
          subject: subject,
          description: desc,
          deadline: deadline,
          status: status,
        })
      }).then((response) => {
        console.log('task created');
      });
    };
  };

  return <>
    <FlexBetween>
      <FlexBetween flexDirection="column">
        <SubjectCol tasks={tasks} userId={userId}/>
        {isClickedAdd && (
          <input
            type="text"
            autoFocus
            style={{
              borderLeft: "none",
              borderTop: "none",
              borderRight: "none",
              outline: "none",
              backgroundColor: "#F3F3F3",
              height: "40px",
            }}
            onChange={event => setSubject(event.target.value)}
          />
        )}
      </FlexBetween>

      <FlexBetween flexDirection="column">
        <DescCol tasks={tasks} userId={userId}/>
        {isClickedAdd && (
          <input
            type="text"
            style={{
              borderLeft: "none",
              borderTop: "none",
              borderRight: "none",
              outline: "none",
              backgroundColor: "#F3F3F3",
              height: "40px",
            }}
            onChange={event => setDesc(event.target.value)}
          />
        )}
      </FlexBetween>

      <FlexBetween flexDirection="column">
        <DeadlineCol tasks={tasks} userId={userId}/>
        {isClickedAdd && (
          <input
            type="text"
            style={{
              borderLeft: "none",
              borderTop: "none",
              borderRight: "none",
              outline: "none",
              backgroundColor: "#F3F3F3",
              height: "40px"
            }}
            onChange={event => setDeadline(event.target.value)}
          />
        )}
      </FlexBetween>

      <FlexBetween flexDirection="column" sx={{maxWidth: "80px"}}>
        <StatusCol tasks={tasks} userId={userId}/>
        {isClickedAdd && (
          <FlexBetween>
            <input
              type="checkbox"
              style={{width: "1.5rem", height: "1.5rem", marginTop:"18px"}}
              onChange={event => setStatus(event.target.value)}
            />
            <Delete
              style={{width: "1.8rem", height: "1.8rem", marginTop:"15px"}}
              onClick={() => {setIsClickedAdd()}}
            />
          </FlexBetween>
        )}
      </FlexBetween>

    </FlexBetween>
    {!isClickedAdd && (
      <>
        <Add
          style={{
            color: "blue",
            fontSize: "1.5rem",
            margin: "10px 0 0 -2%",
            cursor: "pointer",
          }}
          onClick={setIsClickedAdd}
        />
        <Divider/>
      </>
    )}
    {isClickedAdd && (
      <FlexBetween mr="89%">
        <button className="btn-add" onClick={() => { setIsClickedAdd(); addTask()}}>
        ADD
      </button>

      <button className="btn-cancel" onClick={() => {setIsClickedAdd()}}>
        CANCEL
      </button>
      </FlexBetween>
    )}
  </>
};

export default CourseList;