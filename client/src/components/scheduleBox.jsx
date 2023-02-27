import { Typography } from "@mui/material";

const ScheduleBox = ({ text }) => {
  return <Typography
    sx={{
      width: "150px",
      // height: "50px",
      border: "2px solid black",
      textAlign: "center",
      verticalAlign: "center",
      // padding: "38px 10px"
    }}
  >
    {text}
  </Typography>
}

export default ScheduleBox;