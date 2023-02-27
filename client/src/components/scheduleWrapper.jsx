import FlexBetween from "./FlexBetween";
import ScheduleBox from "./scheduleBox";

const ScheduleWrapper = () => {
  const dayTime = "Day / Time"
  return (
    <>
      <FlexBetween  display="inline-flex !important" flexWrap="wrap !important">
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

        <FlexBetween flexDirection="column">
          <ScheduleBox text={'Monday'}/>
        </FlexBetween>

        <FlexBetween flexDirection="column">
          <ScheduleBox text={'Tuesday'}/>
        </FlexBetween>

        <FlexBetween flexDirection="column">
          <ScheduleBox text={'Wednesday'}/>
        </FlexBetween>

        <FlexBetween flexDirection="column">
          <ScheduleBox text={'Thursday'}/>
        </FlexBetween>

        <FlexBetween flexDirection="column">
          <ScheduleBox text={'Friday'}/>
        </FlexBetween>

        <FlexBetween flexDirection="column">
          <ScheduleBox text={'Saturday'}/>
        </FlexBetween>

        <FlexBetween flexDirection="column">
          <ScheduleBox text={'Sunday'}/>
        </FlexBetween>
      </FlexBetween>
    </>
  )
}

export default ScheduleWrapper;