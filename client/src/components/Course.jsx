import FlexBetween from "./FlexBetween";
import {
  Box,
  Typography,
  Divider
} from "@mui/material"

const Course = ({ para }) => {
  if (typeof(para) === "boolean") {
    return <>
      <input
        style={{width: "1.5rem", height: "1.5rem", marginTop:"10px"}}
        type="checkbox"
        defaultChecked={para}
        // onChange={}
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