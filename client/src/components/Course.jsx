import FlexBetween from "./FlexBetween";
import {
  Box,
  Typography,
} from "@mui/material"

// const Course = ({ subject, description, deadline, status }) => {

//   return <Box
//     m="2rem 10rem 0 6.5rem"
//   >
//     <FlexBetween
//     >
//       <Typography
//         mr="0.5rem"
//         fontSize="clamp(1rem, 1rem, 0.25rem)"
//         style={{color: "rgb(55, 53, 47)"}}
//       >
//           {subject}
//       </Typography>

//       <Typography
//         mr="0.5rem"
//         fontSize="clamp(1rem, 1rem, 0.25rem)"
//         style={{color: "rgb(55, 53, 47)"}}
//       >
//           {description}
//       </Typography>
    
//       <Typography
//         mr="0.5rem"
//         fontSize="clamp(1rem, 1rem, 0.25rem)"
//         style={{color: "rgb(55, 53, 47)"}}
//       >
//           {deadline}
//       </Typography>
    
//       <Typography
//         mr="0.5rem"
//         fontSize="clamp(1rem, 1rem, 0.25rem)"
//         style={{color: "rgb(55, 53, 47)"}}
//       >
//           {deadline}
//       </Typography>
//     </FlexBetween>
//   </Box>
// };

const Course = ({ para }) => {
  return <Typography
    fontSize="clamp(1rem, 1rem, 0.25rem)"
    style={{color: "rgb(55, 53, 47)"}}
  >
    {para}
  </Typography>
};

export default Course;