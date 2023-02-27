import NavBar from "components/NavBar";
import { Typography, Box } from "@mui/material";
import ScheduleWrapper from "components/scheduleWrapper";

const Schedule = () => {
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