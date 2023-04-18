import { Box, Typography } from "@mui/material";
import FlexBetween from "./FlexBetween";
import Course from "./Course";
import { Description } from "@mui/icons-material";

const DescCol = ({ tasks, userId }) => {

  return <FlexBetween flexDirection="column">
    <Box m="2rem 10rem 0 0">
      <FlexBetween>
        <Typography
          mr="0.5rem"
          fontSize="clamp(1rem, 1rem, 0.25rem)"
          style={{color: "rgb(55, 53, 47)"}}
        >
            Description
        </Typography>
        <Description />
      </FlexBetween>
    </Box>
    {tasks.map((task) => (
      <Course
        key={task.id}
        para={task.description}
        task={task}
        userId={userId}
      />
    ))}
  </FlexBetween>
};

export default DescCol;