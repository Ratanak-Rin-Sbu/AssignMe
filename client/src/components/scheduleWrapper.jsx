import FlexBetween from "./FlexBetween";
import ScheduleBox from "./scheduleBox";
import ScheduleDayTime from "./scheduleDayTime";
import ScheduleColumn from "./scheduleColumn";
import { useState, useEffect } from "react";

const ScheduleWrapper = () => {
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    const response = await fetch('http://localhost:8000/api/events');
    const data = await response.json();
    setEvents(data);
  }

  useEffect(() => {
    getEvents()
  }, [])

  const mondayEvents = events.filter((event) => {return event.days[0] === "Monday"})

  return (
    <>
      <FlexBetween  display="inline-flex !important" flexWrap="wrap !important">
        <ScheduleDayTime />
        <ScheduleColumn text={'Monday'} events={mondayEvents}/>
        <ScheduleColumn text={'Tuesday'}/>
        <ScheduleColumn text={'Wednesday'}/>
        <ScheduleColumn text={'Thursday'}/>
        <ScheduleColumn text={'Friday'}/>
        <ScheduleColumn text={'Saturday'}/>
        <ScheduleColumn text={'Sunday'}/>
      </FlexBetween>
    </>
  )
}

export default ScheduleWrapper;