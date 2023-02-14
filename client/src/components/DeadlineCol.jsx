import { Box, Typography } from "@mui/material";
import FlexBetween from "./FlexBetween";
import Course from "./Course";
import { CalendarMonth } from "@mui/icons-material";

const DeadlineCol = ({ courses }) => {

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
    {courses.map((course) => (
      <Course
        key={course._id}
        para={course.deadline}
      />
    ))}
  </FlexBetween>
};

export default DeadlineCol;