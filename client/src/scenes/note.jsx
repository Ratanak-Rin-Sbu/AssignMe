import FlexBetween from "components/FlexBetween";
import NavBar from "components/NavBar";
import { Person, NoteAdd, NotificationAdd, PersonAddAlt, Delete } from "@mui/icons-material"
import { Typography } from "@mui/material";

const Note = () => {
  return (
    <>
      <NavBar />
      <FlexBetween>
        <FlexBetween flex="0 0 30%" p="5px"
          sx={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            borderRight: "1px solid black",
          }}
        >
          <Person style={{fontSize: 30}}/>
          <Typography sx={{fontSize: 20}}>My Notes</Typography>
          <NoteAdd style={{fontSize: 30}}/>
        </FlexBetween>
        <FlexBetween flex="0 0 70%" p="5px"
          sx={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
          }}
        >
          <NotificationAdd style={{fontSize: 30}}/>
          <PersonAddAlt style={{fontSize: 30}}/>
          <Delete style={{fontSize: 30}}/>
        </FlexBetween>
      </FlexBetween>
    </>
  )
}

export default Note;