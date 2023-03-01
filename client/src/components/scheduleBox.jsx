import { Typography, Box } from "@mui/material";
import { useState } from "react";

const ScheduleBox = ({ text, height, color }) => {
  // const [boxHeight, setBoxHeight] = useState(30);
  if (!height && !color) {
    return (
      <div 
        style={{
          // backgroundColor: {color},
          width: "150px",
          height: "30px",
          borderRight: "2px solid black",
          borderBottom: "2px solid black",
          borderTop: "2px solid black",
          textAlign: "center",
          verticalAlign: "center",
        }}
      >
        {text}
      </div>
    )
  } else {
    return (
      <div 
        style={{
          backgroundColor: `${color}`,
          width: "150px",
          height: {height},
          borderRight: "2px solid black",
          borderBottom: "2px solid black",
          borderTop: "2px solid black",
          textAlign: "center",
          verticalAlign: "center",
        }}
      >
        {text}
      </div>
    )
  }
}

export default ScheduleBox;