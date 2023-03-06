import FlexBetween from "components/FlexBetween";
import NavBar from "components/NavBar";
import { 
  Person,
  NoteAdd, 
  NotificationAdd, 
  PersonAddAlt, 
  Delete,
  Search } 
from "@mui/icons-material"
import { Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [tags, setTags] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  const setActive = (note) => {
    note.active = true;
  };

  const activeNote = notes.filter((note) => {return (note.active === true)});

  const sortedNotes = notes.map(
    ({lastUpdated}, index) => [Date.parse(lastUpdated),index]).sort((a,b) => b[0] - a[0]).reduce((all, [_,index]) =>
    all.concat([notes[index]]), []);

  const removeActive = () => {
    activeNote[0].active = false;
  };

  const getNotes = async () => {
    const response = await fetch('http://localhost:8000/api/notes');
    const data = await response.json();
    setNotes(data);
  }

  useEffect(() => {
    getNotes()
  }, [notes])

  const addNote = async () => {
    await fetch('http://localhost:8000/api/note', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'POST',
      body: JSON.stringify({
        note: "",
        tags: [],
        lastUpdated: new Date().toLocaleString('en-US', { 
          year: 'numeric',
          month: 'numeric',
          day: 'numeric', 
          hour: 'numeric', 
          hour12: true, 
          minute: 'numeric', 
          second: 'numeric' 
        }),
        active: false
      })
    }).then((response) => {
      console.log('note created');
    });
    removeActive();
  };

  return (
    <>
      <NavBar />
      <FlexBetween>
        <FlexBetween flex="0 0 20%" p="5px"
          sx={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            borderRight: "1px solid black",
          }}
        >
          <Person style={{fontSize: 30}}/>
          <Typography sx={{fontSize: 20}}>My Notes</Typography>
          <NoteAdd style={{fontSize: 30}} onClick={addNote}/>
        </FlexBetween>
        <FlexBetween flex="0 0 80%" p="5px"
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
      <FlexBetween
        sx={{
          borderTop: "1px solid black",
          justifyContent: "flex-start",
          height:"100%"
        }}
      >
        <Box flex="0 0 20%" borderRight="1px solid black">
          <FlexBetween p="10px" width="50%">
            <Search flex="0 0 20%" style={{fontSize: 30}}/>
            <input
              flex="0 0 80%"
              type="text"
              placeholder="Search all notes"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 16,
              }}
            />
          </FlexBetween>
          {sortedNotes.map((note) => (
            <Box
              key={note.id}
              sx={{
                borderTop: "1px dashed black",
                borderBottom: "1px dashed black",
                padding: "5px 10px",
                ...(note.active === true && {
                  backgroundColor: "rgb(229, 241, 253)",
                }),
              }}
              onClick={() => {removeActive(); setActive(note)}}
            >
              <div style={{fontSize: "18px"}}>{note.note ? note.note : "New Note"}</div>
              <div style={{fontSize: "14px"}}>{note.lastUpdated}</div>
            </Box>
          ))}
        </Box>
        <Box fontSize="18px" sx={{textAlign: "center"}} p="10px">
          {activeNote.length !== 0 && (activeNote[0].note)}
        </Box>
      </FlexBetween>
    </>
  )
}

export default Note;