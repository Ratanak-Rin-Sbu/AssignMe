import { Box, Typography } from "@mui/material";
import CourseList from "components/CourseList";
import NavBar from "components/NavBar";

const TaskManager = ({ userId }) => {
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
          style={{color: "rgb(55, 53, 47)"}}
        >
            Click an existing task to add additional context or subtasks.
        </Typography>
        <CourseList userId={userId}/>
      </Box>
    </>
  )
}

export default TaskManager;