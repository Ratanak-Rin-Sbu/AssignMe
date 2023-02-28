import NavBar from "components/NavBar";
import { Typography, Box, Modal } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import ScheduleWrapper from "components/scheduleWrapper";
import { Button } from 'react-bootstrap';
import { useState } from "react";

const Schedule = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <NavBar />
      <Box m="0 6% 0 6%">
        <Typography
          fontSize="clamp(1rem, 1rem, 0.25rem)"
          m="1rem 0 0 0"
          style={{color: "rgb(55, 53, 47)"}}
        >
            Use this template to track your personal tasks.
        </Typography>
        <Typography
          fontSize="clamp(1rem, 1rem, 0.25rem)"
          style={{color: "rgb(55, 53, 47)"}}
        >
            Click + New to create a new task directly on this board.
        </Typography>
        <Typography
          fontSize="clamp(1rem, 1rem, 0.25rem)"
          style={{color: "rgb(55, 53, 47)", marginBottom: "20px"}}
        >
            Click an existing task to add additional context or subtasks.
        </Typography>
        <ScheduleWrapper />
      </Box>
    </>
  )
}

export default Schedule;