import NavBar from "components/NavBar";
import { Typography, Box, Modal } from "@mui/material";
import { List } from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import ScheduleWrapper from "components/scheduleWrapper";
import { Button } from 'react-bootstrap';
import { useState, useEffect } from "react";

// for this part, taken from https://codesandbox.io/s/days-of-the-week-picker-forked-h15q8q?file=/src/ToggleDays.js:41-221
import { withStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const DAYS = [
  {
    key: "Sunday",
    label: "S"
  },
  {
    key: "Monday",
    label: "M"
  },
  {
    key: "Tuesday",
    label: "T"
  },
  {
    key: "Wednesday",
    label: "W"
  },
  {
    key: "Thursday",
    label: "T"
  },
  {
    key: "Friday",
    label: "F"
  },
  {
    key: "Saturday",
    label: "S"
  }
];

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(2),
    padding: theme.spacing(0, 1),
    "&:not(:first-child)": {
      border: "1px solid",
      borderColor: "#692B7C",
      borderRadius: "50%"
    },
    "&:first-child": {
      border: "1px solid",
      borderColor: "#692B7C",
      borderRadius: "50%"
    }
  }
}))(ToggleButtonGroup);

const StyledToggle = withStyles({
  root: {
    color: "#692B7C",
    "&$selected": {
      color: "white",
      background: "#692B7C"
    },
    "&:hover": {
      borderColor: "#BA9BC3",
      background: "#BA9BC3"
    },
    "&:hover$selected": {
      borderColor: "#BA9BC3",
      background: "#BA9BC3"
    },
    minWidth: 32,
    maxWidth: 32,
    height: 32,
    textTransform: "unset",
    fontSize: "0.75rem"
  },
  selected: {}
})(ToggleButton);
// -------------------------------------------------------------------------------------------------------------until this part

const Schedule = ({ userId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState([]);
  const [isInvalidAdd, setIsInvalidAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const addEvent = async () => {
    if (name && location && color && startTime && endTime && days) {
      await fetch(`http://localhost:8000/api/${userId}/event`, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        },
        method: 'POST',
        body: JSON.stringify({
          name: name,
          place: location,
          color: color,
          start: startTime,
          end: endTime,
          days: days
        })
      }).then((response) => {
        console.log('event created');
      });
      setIsInvalidAdd(false);
      setOpenModal(false);
    } else {
      setIsInvalidAdd(true);
    }
  };

  return (
    <>
      <NavBar />
      <Box m="0 6% 0 6%">
        <Typography
          fontSize="clamp(1rem, 1rem, 0.25rem)"
          style={{color: "rgb(55, 53, 47)"}}
          m="1rem 0 0 0"
        >
            Click an existing task to add additional context or subtasks.
        </Typography>
        <Typography
          fontSize="clamp(1rem, 1rem, 0.25rem)"
          mb="1rem"
          style={{color: "rgb(55, 53, 47)"}}
        >
            Use this template to track your personal tasks.
        </Typography>
        <ScheduleWrapper isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
      </Box>
      <Box m="1% 6% 0 6%" width="180px">
        <FlexBetween>
          <Button
            style={{
              backgroundColor: "#48abe0",
              color: "white",
              border: "none",
              padding: "5px",
              fontSize: "31px",
              height: "50px",
              width: "50px",
              boxShadow: "0 2px 4px darkslategray",
              cursor: "pointer",
              transition: "all 0.2s ease",
              borderRadius: "50%",
              '&:active': {
                backgroundColor: "#48abe0",
                boxShadow: "0 0 2px darkslategray",
                transform: "translateY(2px)",
              }
            }}
            onClick={() => {setOpenModal(true)}}
          >
            +
          </Button>
          <Button
            style={{
              backgroundColor: "#48abe0",
              color: "white",
              border: "none",
              padding: "5px",
              fontSize: "31px",
              height: "50px",
              width: "50px",
              boxShadow: "0 2px 4px darkslategray",
              cursor: "pointer",
              transition: "all 0.2s ease",
              borderRadius: "50%",
              '&:active': {
                backgroundColor: "#48abe0",
                boxShadow: "0 0 2px darkslategray",
                transform: "translateY(2px)",
              }
            }}
            onClick={() => {setIsDelete((prevIsDelete) => !prevIsDelete)}}
          >
            -
          </Button>
          <Button
            style={{
              backgroundColor: "#48abe0",
              color: "white",
              border: "none",
              padding: "5px",
              fontSize: "31px",
              height: "50px",
              width: "50px",
              boxShadow: "0 2px 4px darkslategray",
              cursor: "pointer",
              transition: "all 0.2s ease",
              borderRadius: "50%",
              '&:active': {
                backgroundColor: "#48abe0",
                boxShadow: "0 0 2px darkslategray",
                transform: "translateY(2px)",
              }
            }}
            onClick={(e) => {setIsUpdate((prevIsUpdate) => !prevIsUpdate)}}
          >
            <List/>
          </Button>
        </FlexBetween>
      </Box>
      <Modal
        m="1% 6% 0 6%"
        open={openModal}
        onClose={() => {setOpenModal(false); setIsInvalidAdd(false)}}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            height: "auto",
            backgroundColor: "#DDDDDD",
            boxShadow: 24,
            borderRadius: "10px",
            p: 4,
          }}
        >
          <input
            className="myschedule-modal-input"
            type="text"
            placeholder="Event Name"
            onChange={event => setName(event.target.value)}
          />
          <FlexBetween>
            <input
              className="myschedule-modal-input"
              type="text"
              placeholder="Location"
              style={{marginRight: "10px"}}
              onChange={event => setLocation(event.target.value)}
            />
            <input
              className="myschedule-modal-input"
              type="text"
              placeholder="Color"
              onChange={event => setColor(event.target.value)}
            />
          </FlexBetween>
          <FlexBetween>
            <input
              className="myschedule-modal-input"
              type="text"
              placeholder="Start time"
              style={{marginRight: "10px"}}
              onChange={event => setStartTime(event.target.value)}
            />
            <input
              className="myschedule-modal-input"
              type="text"
              placeholder="End Time"
              onChange={event => setEndTime(event.target.value)}
            />
          </FlexBetween>
          
          {/* toggleDay */}
          <input
            className="myschedule-modal-input"
            type="text"
            placeholder="Pick a day(s)"
            defaultValue={days}
          />
          <StyledToggleButtonGroup
            size="small"
            arial-label="Days of the week"
            value={days}
            onChange={(event, value) => setDays(value)}
          >
            {DAYS.map((day) => (
              <StyledToggle key={day.key} value={day.key} aria-label={day.key}>
                {day.label}
              </StyledToggle>
            ))}
          </StyledToggleButtonGroup>

          {isInvalidAdd && (
            <Typography sx={{color: "red"}}>Please fill in all the required values</Typography>
          )}
          {/* ADD BUTTON */}
          <button
            className="btn-add"
            onClick={(e) => {addEvent()}}
          >
            ADD EVENT
          </button>
        </Box>
      </Modal>
    </>
  )
}

export default Schedule;