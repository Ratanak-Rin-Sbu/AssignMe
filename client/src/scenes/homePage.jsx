import { Box, Typography, useMediaQuery, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import NavBar from "components/NavBar";
import CourseList from "components/CourseList";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

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
        <CourseList />
      </Box>
    </>
  );
};

export default HomePage;