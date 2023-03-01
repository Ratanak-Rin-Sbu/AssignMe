import ScheduleBox from "./scheduleBox";
import FlexBetween from "./FlexBetween";

const ScheduleDayTime = () => {
  return (
    <>
      <FlexBetween flexDirection="column">
        <ScheduleBox text={'Day / Time'}/>
        <ScheduleBox text={'7:00 - 8:00'}/>
        <ScheduleBox text={'8:00 - 9:00'}/>
        <ScheduleBox text={'9:00 - 10:00'}/>
        <ScheduleBox text={'10:00 - 11:00'}/>
        <ScheduleBox text={'11:00 - 12:00'}/>
        <ScheduleBox text={'12:00 - 13:00'}/>
        <ScheduleBox text={'13:00 - 14:00'}/>
        <ScheduleBox text={'14:00 - 15:00'}/>
        <ScheduleBox text={'15:00 - 16:00'}/>
        <ScheduleBox text={'16:00 - 17:00'}/>
        <ScheduleBox text={'17:00 - 18:00'}/>
        <ScheduleBox text={'18:00 - 19:00'}/>
        <ScheduleBox text={'19:00 - 20:00'}/>
        <ScheduleBox text={'20:00 - 21:00'}/>
        <ScheduleBox text={'21:00 - 22:00'}/>
        <ScheduleBox text={'22:00 - 23:00'}/>
        <ScheduleBox text={'23:00 - 00:00'}/>
      </FlexBetween>
    </>
  )
}

export default ScheduleDayTime;