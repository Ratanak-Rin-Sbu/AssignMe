import { Typography, Box, Modal } from "@mui/material";
import { Delete, Create } from "@mui/icons-material"
import { useState } from "react";
import FlexBetween from "./FlexBetween";

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

const ScheduleBox = ({ text, event, isDelete, isUpdate }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState([]);

  const updateName = (e) => {
    setName(e);
  }

  const updateLocation = (e) => {
    setLocation(e);
  }

  const updateColor = (e) => {
    setColor(e);
  }

  const updateStartTime = (e) => {
    setStartTime(e);
  }

  const updateEndTime = (e) => {
    setEndTime(e);
  }

  const updateDays = (e) => {
    setDays(e);
  }

  const opennModal = (event) => {
    setName(event.name);
    setLocation(event.place);
    setColor(event.color);
    setStartTime(event.start);
    setEndTime(event.end);
    setDays(event.days);
    setOpenModal(true);
  }

  const closeModal = () => {
    setOpenModal(false);
  }

  const updateEvent = async () => {
    await fetch(`http://localhost:8000/api/event/${event.id}`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'PUT',
      body: JSON.stringify({
        name: name,
        place: location,
        color: color,
        start: startTime,
        end: endTime,
        days: days
      })
    }).then((response) => {
      console.log('event updated');
    });
    setOpenModal(false);
  };

  const deleteEvent = async () => {
    await fetch(`http://localhost:8000/api/event/${event.id}`, {
      method: 'DELETE',
    }).then((response) => {
      console.log("Deleted a task");
    })
  };

  if (event && isDelete && !isUpdate) {
    return (
      <div 
        style={{
          backgroundColor: "#F16767",
          width: "150px",
          height: "30px",
          borderRight: "2px solid",
          borderBottom: "2px solid",
          borderTop: "2px solid",
          textAlign: "center",
          verticalAlign: "center",
        }}
      >
        <FlexBetween>
          <Typography>{event.name}</Typography>
          <Delete onClick={deleteEvent}/>
        </FlexBetween>
      </div>
    )
  } else if (event && isUpdate && !isDelete) {

    return (
      <>
        <div 
          style={{
            backgroundColor: "#FFE15D",
            width: "150px",
            height: "30px",
            borderRight: "2px solid",
            borderBottom: "2px solid",
            borderTop: "2px solid",
            textAlign: "center",
            verticalAlign: "center",
          }}
        >
          <FlexBetween>
            <Typography>{event.name}</Typography>
            <Create  onClick={() => {opennModal(event)}}/>
          </FlexBetween>
        </div>
        <Modal
          m="1% 6% 0 6%"
          open={openModal}
          onClose={closeModal}
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
              defaultValue={name}
              // onChange={event => setName(event.target.value)}
              onChange={(e) => {updateName(e.target.value)}}
            />
            <FlexBetween>
              <input
                className="myschedule-modal-input"
                type="text"
                placeholder="Location"
                defaultValue={location}
                style={{marginRight: "10px"}}
                // onChange={event => setLocation(event.target.value)}
                onChange={(e) => {updateLocation(e.target.value)}}
              />
              <input
                className="myschedule-modal-input"
                type="text"
                placeholder="Color"
                defaultValue={color}
                // onChange={event => setColor(event.target.value)}
                onChange={(e) => {updateColor(e.target.value)}}
              />
            </FlexBetween>
            <FlexBetween>
              <input
                className="myschedule-modal-input"
                type="text"
                placeholder="Start time"
                defaultValue={startTime}
                style={{marginRight: "10px"}}
                // onChange={event => setStartTime(event.target.value)}
                onChange={(e) => {updateStartTime(e.target.value)}}
              />
              <input
                className="myschedule-modal-input"
                type="text"
                placeholder="End Time"
                defaultValue={endTime}
                // onChange={event => setEndTime(event.target.value)}
                onChange={(e) => {updateEndTime(e.target.value)}}
              />
            </FlexBetween>
            
            {/* toggleDay */}
            <input
              className="myschedule-modal-input"
              type="text"
              placeholder="Pick a day(s)"
              // defaultValue={days}
              value={days}
            />
            <StyledToggleButtonGroup
              size="small"
              arial-label="Days of the week"
              value={days}
              onChange={(event, value) => updateDays(value)}
            >
              {DAYS.map((day) => (
                <StyledToggle key={day.key} value={day.key} aria-label={day.key}>
                  {day.label}
                </StyledToggle>
              ))}
            </StyledToggleButtonGroup>

            {/* ADD BUTTON */}
            <button
              className="btn-add"
              onClick={updateEvent}
            >
              ADD EVENT
            </button>
          </Box>
        </Modal>
      </>
    )
  } else if (event && !isDelete && !isUpdate) {
    return (
      <div 
        style={{
          backgroundColor: `${event.color}`,
          width: "150px",
          height: "30px",
          borderRight: "2px solid",
          borderBottom: "2px solid",
          borderTop: "2px solid",
          textAlign: "center",
          verticalAlign: "center",
        }}
      >
        <Typography>{event.name}</Typography>
      </div>
    )
  } else {
    return (
      <div 
        style={{
          width: "150px",
          height: "30px",
          borderRight: "2px solid",
          borderBottom: "2px solid",
          borderTop: "2px solid",
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