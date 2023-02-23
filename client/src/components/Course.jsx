import {
  Divider,
} from "@mui/material"
import { Delete } from "@mui/icons-material"
import FlexBetween from "./FlexBetween";
import debounce from "lodash.debounce";

const Course = ({ para, task }) => {

  const updateTodo = async (e) => {
    if (para === task.subject) {
      await fetch(`http://localhost:8000/api/todo/${task.id}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        method: 'PUT',
        body: JSON.stringify({
          subject: e?.target?.value,
        }),
      }).then((response) => {
        console.log("Update a task");
      });
    } else if (para === task.description) {
      await fetch(`http://localhost:8000/api/todo/${task.id}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        method: 'PUT',
        body: JSON.stringify({
          description: e?.target?.value,
        }),
      }).then((response) => {
        console.log("Update a task");
      });
    } else {
      await fetch(`http://localhost:8000/api/todo/${task.id}`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        method: 'PUT',
        body: JSON.stringify({
          deadline: e?.target?.value,
        }),
      }).then((response) => {
        console.log("Update a task");
      });
    }
  };

  const debounceOnChange = debounce(updateTodo, 500);

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
        onChange={debounceOnChange}
      />
      <Divider />
    </>
  }
};

export default Course;