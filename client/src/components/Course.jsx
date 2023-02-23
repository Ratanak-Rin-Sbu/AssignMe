import {
  Divider,
} from "@mui/material"
import { Delete } from "@mui/icons-material"
import { useState } from "react";
import FlexBetween from "./FlexBetween";

const Course = ({ para, task }) => {
  console.log(task.id);

  const updateTodo = async (todo) => {
    await fetch(`http://localhost:8000/api/todo/${task.id}`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'PUT',
      body: JSON.stringify(todo),
    }).then((response) => {
      console.log("Update a task");
    });
    window.location.reload();
  };

  const updateSubject = async (value) => {
    updateTodo({
      subject: value,
      description: task.description,
      deadline: task.deadline,
      status: task.status
    });
  };

  const updateDescription = async (value) => {
    updateTodo({
      subject: task.subject,
      description: value,
      deadline: task.deadline,
      status: task.status
    });
  };

  const updateDeadline = async (value) => {
    updateTodo({
      subject: task.subject,
      description: task.description,
      deadline: value,
      status: task.status
    });
  };

  const updateStatus = async () => {
    await fetch(`http://localhost:8000/api/todo/${task.id}`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'PUT',
      body: JSON.stringify({
        status: !para,
      }),
    }).then((response) => {
      console.log("Update the task status");
    });
    para = !para;
  };

  const deleteTask = async () => {
    await fetch(`http://localhost:8000/api/todo/${task.id}`, {
      method: 'DELETE',
    }).then((response) => {
      console.log("Deleted a task");
    })
    window.location.reload();
  };

  if (typeof(para) === "boolean") {
    return <>
      <FlexBetween>
        <input
          style={{width: "1.5rem", height: "1.5rem", marginTop:"18px"}}
          type="checkbox"
          defaultChecked={para}
          onChange={updateStatus}
        />
        <Delete
          style={{width: "1.8rem", height: "1.8rem", marginTop:"15px"}}
          onClick={deleteTask}
        />
      </FlexBetween>
    </>
  } else {
    return <>
      <input 
        type="text"
        defaultValue={para}
        style={{
          borderLeft: "none",
          borderTop: "none",
          borderRight: "none",
          outline: "none",
          backgroundColor: "#F3F3F3",
          height: "30px",
          marginTop: "12px",
          fontSize: 15
        }}
        onChange={(e) => {if (para === task.subject) {
          updateSubject(e.target.value);
        } else if (para === task.description) {
          updateDescription(e.target.value);
        } else {
          updateDeadline(e.target.value);
        }}}
      />
      <Divider />
    </>
  }
};

export default Course;