import ScheduleBox from "./scheduleBox";
import FlexBetween from "./FlexBetween";

const ScheduleColumn = ({ text, height, events }) => {
  // console.log(typeof(events));
  console.log(events);
  
  if (!events) {
    return (
      <>
        <FlexBetween flexDirection="column" sx={{maxHeight: "540px", minHeight: "540px"}}>
        <ScheduleBox text={text} height={height}/>
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
        <ScheduleBox />
      </FlexBetween>
    </>
    )
  } if (events) {
    console.log(events[0]);
    return (
      <>
        <FlexBetween flexDirection="column" sx={{maxHeight: "540px", minHeight: "540px"}}>
          <ScheduleBox text={text} height={height} color={events[0] ? events[0].color : ""}/>
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
          <ScheduleBox />
        </FlexBetween>
      </>
    )
  }
}

export default ScheduleColumn;