import NavBar from "components/NavBar";
import { Typography, Box, Modal } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import ScheduleWrapper from "components/scheduleWrapper";
import { Button } from 'react-bootstrap';
import { useState } from "react";
import ToggleDays from "components/dayToggle";

const Schedule = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <NavBar />
      <Box m="0 6% 0 6%">

        <ScheduleWrapper />
      </Box>
      <Box m="1% 6% 0 6%">
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
        <Modal
          open={openModal}
          onClose={() => {setOpenModal(false)}}
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
            />
            <input
              className="myschedule-modal-input"
              type="text"
              placeholder="Location"
            />
            <FlexBetween>
              <input
                className="myschedule-modal-input"
                type="text"
                placeholder="Start time"
                style={{marginRight: "10px"}}
              />
              <input
                className="myschedule-modal-input"
                type="text"
                placeholder="End Time"
              />
            </FlexBetween>
            <ToggleDays />
            <button
              className="btn-add"
              onClick={() => {setOpenModal(false)}}
            >
              ADD EVENT
            </button>
          </Box>
        </Modal>
      </Box>
    </>
  )
}

export default Schedule;