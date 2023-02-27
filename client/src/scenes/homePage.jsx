import { Assignment, EventNote } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import NavBar from "components/NavBar";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div style={{
        margin: "10% auto",
        padding: "10px",
        // backgroundColor: "blue",
        height: "auto",
        width: "600px"
      }}>
        {/* FIRST ROW - AssignME */}
        <Box
          sx={{
            borderRadius: "23px",
            border: "1px solid lightpink",
            // backgroundColor: "red",
            margin: "auto auto 20px auto",
            padding: "20px",
            width: "100%",
            height: "80px",
            fontSize: "27px",
            '&:hover': {
              backgroundColor: "#E7556E",
              opacity: [0.9, 0.8, 0.7],
              cursor: "pointer"
            },
          }}
          onClick={() => navigate('/taskManager')}
        >
          <FlexBetween justifyContent="flex-start !important">
            <Assignment style={{
              fontSize: "42px",
              marginRight: "25px"
            }}/>
            Task Manager
          </FlexBetween>
        </Box>

        {/* SECOND ROW - MY SCHEDULE */}
        <Box
          sx={{
            borderRadius: "23px",
            border: "1px solid lightpink",
            // backgroundColor: "red",
            margin: "auto",
            padding: "20px",
            width: "100%",
            height: "80px",
            fontSize: "27px",
            '&:hover': {
              backgroundColor: "#E7556E",
              opacity: [0.9, 0.8, 0.7],
              cursor: "pointer"
            },
          }}
        >
          <FlexBetween justifyContent="flex-start !important">
            <EventNote style={{
              fontSize: "42px",
              marginRight: "25px"
            }}/>
            My Schedule
          </FlexBetween>
        </Box>
      </div>
      {/* <TaskManager /> */}
    </>
  );
};

export default HomePage;