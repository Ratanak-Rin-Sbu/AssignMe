import {
  Typography,
  Divider
} from "@mui/material"
import { useState } from "react";

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

  if (typeof(para) === "boolean") {
    return <>
      <input
        style={{width: "1.5rem", height: "1.5rem", marginTop:"10px"}}
        type="checkbox"
        defaultChecked={para}
        onChange={updateStatus}
      />
    </>
  } else {
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