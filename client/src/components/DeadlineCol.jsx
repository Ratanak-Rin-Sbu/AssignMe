import { Box, Typography } from "@mui/material";
import FlexBetween from "./FlexBetween";
import Course from "./Course";
import { CalendarMonth } from "@mui/icons-material";

const DeadlineCol = ({ tasks }) => {

  return <FlexBetween flexDirection="column">
    <Box m="2rem 10rem 0 0">
      <FlexBetween>
        <Typography
          mr="0.5rem"
          fontSize="clamp(1rem, 1rem, 0.25rem)"
          style={{color: "rgb(55, 53, 47)"}}
        >
          Deadline
        </Typography>
        <CalendarMonth />
      </FlexBetween>
    </Box>
    {tasks.map((task) => (
      <Course
        key={task._id}
        para={task.deadline}
      />
    ))}
  </FlexBetween>
};

export default DeadlineCol;