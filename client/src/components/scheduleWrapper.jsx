import FlexBetween from "./FlexBetween";
import ScheduleBox from "./scheduleBox";
import ScheduleDayTime from "./scheduleDayTime";
import ScheduleColumn from "./scheduleColumn";
import { useState, useEffect } from "react";

const ScheduleWrapper = ({ isDelete, isUpdate }) => {
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    const response = await fetch('http://localhost:8000/api/events');
    const data = await response.json();
    setEvents(data);
  }

  useEffect(() => {
    getEvents()
  }, [events])
  
  const mondayEvents = events.filter((event) => {return event.days.indexOf("Monday") > -1});
  const tuesdayEvents = events.filter((event) => {return event.days.indexOf("Tuesday") > -1});
  const wednesdayEvents = events.filter((event) => {return event.days.indexOf("Wednesday") > -1});
  const thursdayEvents = events.filter((event) => {return event.days.indexOf("Thursday") > -1});
  const fridayEvents = events.filter((event) => {return event.days.indexOf("Friday") > -1});
  const saturdayEvents = events.filter((event) => {return event.days.indexOf("Saturday") > -1});
  const sundayEvents = events.filter((event) => {return event.days.indexOf("Sunday") > -1});

  return (
    <>
      <FlexBetween  display="inline-flex !important" flexWrap="wrap !important">
        <ScheduleDayTime events={mondayEvents}/>
        <ScheduleColumn text={'Monday'} events={mondayEvents} isDelete={isDelete} isUpdate={isUpdate}/>
        <ScheduleColumn text={'Tuesday'} events={tuesdayEvents} isDelete={isDelete} isUpdate={isUpdate}/>
        <ScheduleColumn text={'Wednesday'} events={wednesdayEvents} isDelete={isDelete} isUpdate={isUpdate}/>
        <ScheduleColumn text={'Thursday'} events={thursdayEvents} isDelete={isDelete} isUpdate={isUpdate}/>
        <ScheduleColumn text={'Friday'} events={fridayEvents} isDelete={isDelete} isUpdate={isUpdate}/>
        <ScheduleColumn text={'Saturday'} events={saturdayEvents} isDelete={isDelete} isUpdate={isUpdate}/>
        <ScheduleColumn text={'Sunday'} events={sundayEvents} isDelete={isDelete} isUpdate={isUpdate}/>
      </FlexBetween>
    </>
  )
}

export default ScheduleWrapper;