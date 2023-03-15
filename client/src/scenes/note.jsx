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
import debounce from "lodash.debounce";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);

  let activeNote = notes.filter((note) => {return (note.active === true)});

  const setActive = async (note) => {
    console.log(note)
    await fetch(`http://localhost:8000/api/note/${note.id}`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'PUT',
      body: JSON.stringify({
        active: true
      }),
    }).then((response) => {
      console.log("Update a todo");
    });
  };

  const sortedNotes = notes.map(
    ({lastUpdated}, index) => [Date.parse(lastUpdated),index]).sort((a,b) => b[0] - a[0]).reduce((all, [_,index]) =>
    all.concat([notes[index]]), []);

  const removeActive = async () => {
    await fetch(`http://localhost:8000/api/note/${activeNote[0].id}`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'PUT',
      body: JSON.stringify({
        active: false
      }),
    }).then((response) => {
      console.log("Update a todo");
    });
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
    removeActive();
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
        active: true
      })
    }).then((response) => {
      console.log('note created');
    });
  };

  const updateNote = async (e) => {
    await fetch(`http://localhost:8000/api/note/${activeNote[0].id}`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'PUT',
      body: JSON.stringify({
        note: e?.target?.value,
        tags: tags,
        lastUpdated: new Date().toLocaleString('en-US', { 
          year: 'numeric',
          month: 'numeric',
          day: 'numeric', 
          hour: 'numeric', 
          hour12: true, 
          minute: 'numeric', 
          second: 'numeric' 
        }),
        active: true
      }),
    }).then((response) => {
      console.log("Update a todo");
    });
  };

  const debounceOnChange = debounce(updateNote, 500);

  const deleteNote = async () => {
    await fetch(`http://localhost:8000/api/note/${activeNote[0].id}`, {
      method: 'DELETE',
    }).then((response) => {
      console.log("Deleted a task");
    });
    setActive(sortedNotes[1]);
  };

  return (
    <>
      <NavBar />
        <FlexBetween justifyContent="flex-start !important">
          <Box minHeight="90vh" borderRight="1px solid black" width="20%">
            <FlexBetween flexDirection="column" justifyContent="flex-start !important">
              <FlexBetween
                sx={{
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black",
                }}
              >
                <Person style={{fontSize: 30}}/>
                <Typography sx={{fontSize: 20}}>My Notes</Typography>
                <NoteAdd style={{fontSize: 30}} onClick={addNote}/>
              </FlexBetween>

              <Box>
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
                    <div 
                      style={{
                        fontSize: "18px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordWrap: "break-word",
                      }}
                    >
                      {note.note ? note.note : "New Note"}
                    </div>
                    <div style={{fontSize: "14px"}}>{note.lastUpdated}</div>
                  </Box>
                ))}
              </Box>
            </FlexBetween>
          </Box>
          <FlexBetween flexDirection="column" justifyContent="flex-start !important" width="80%">
            <FlexBetween
              sx={{
                borderTop: "1px solid black",
                borderBottom: "1px solid black",
              }}
            >
              <NotificationAdd style={{fontSize: 30}}/>
              <PersonAddAlt style={{fontSize: 30}}/>
              <Delete style={{fontSize: 30}} onClick={deleteNote}/>
            </FlexBetween>

            {notes.map((note) => {
              return note.active === true ? (
                <textarea
                  style={{
                    border: "none",
                    outline: "none",
                    resize: "none",
                    background: "transparent",
                    fontSize: "18px",
                    padding: "10px",
                    height: "80vh"
                  }}
                  defaultValue={note.note}
                  onChange={debounceOnChange}
                >
                </textarea>
              ) : (<></>)
            })}
          </FlexBetween>
        </FlexBetween>
    </>
  )
}

export default Note;