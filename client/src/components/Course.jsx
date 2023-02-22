import {
  Typography,
  Divider
} from "@mui/material"
import { Delete, MoreVert } from "@mui/icons-material"

const Course = ({ para, task }) => {
  const updateStatus = async () => {
    await fetch(`http://localhost:8000/api/todo/${task.id}`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'PUT',
      body: JSON.stringify({
        // id: task.id,
        // subject: task.subject,
        // description: task.description,
        // deadline: task.deadline,
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
      <input
        style={{width: "1.5rem", height: "1.5rem", marginTop:"10px"}}
        type="checkbox"
        defaultChecked={para}
        onChange={updateStatus}
      />
    </>
  } else if (para == null) {
    return <>
      <Delete
        style={{width: "1.8rem", height: "1.8rem", marginTop:"7px"}}
        onClick={deleteTask}
      />
    </>
  } 
  else {
    return <>
      <Typography
        fontSize="clamp(1rem, 1rem, 0.25rem)"
        style={{color: "rgb(55, 53, 47)"}}
        mt="12px"
      >
        {para}
      </Typography>
      <Divider />
    </>
  }
};

export default Course;