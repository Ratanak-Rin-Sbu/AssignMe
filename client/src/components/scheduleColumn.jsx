import ScheduleBox from "./scheduleBox";
import FlexBetween from "./FlexBetween";

const ScheduleColumn = ({ text, events, isDelete, isUpdate, userId }) => {
  if (events) {
    const event7_8 = events.filter((event) => {return (event.start === "7:00" && event.end === "8:00")});
    const event8_9 = events.filter((event) => {return (event.start === "8:00" && event.end === "9:00")});
    const event9_10 = events.filter((event) => {return (event.start === "9:00" && event.end === "10:00")});
    const event10_11 = events.filter((event) => {return (event.start === "10:00" && event.end === "11:00")});
    const event11_12 = events.filter((event) => {return (event.start === "11:00" && event.end === "12:00")});
    const event12_13 = events.filter((event) => {return (event.start === "12:00" && event.end === "13:00")});
    const event13_14 = events.filter((event) => {return (event.start === "13:00" && event.end === "14:00")});
    const event14_15 = events.filter((event) => {return (event.start === "14:00" && event.end === "15:00")});
    const event15_16 = events.filter((event) => {return (event.start === "15:00" && event.end === "16:00")});
    const event16_17 = events.filter((event) => {return (event.start === "16:00" && event.end === "17:00")});
    const event17_18 = events.filter((event) => {return (event.start === "17:00" && event.end === "18:00")});
    const event18_19 = events.filter((event) => {return (event.start === "18:00" && event.end === "19:00")});
    const event19_20 = events.filter((event) => {return (event.start === "19:00" && event.end === "20:00")});
    const event20_21 = events.filter((event) => {return (event.start === "20:00" && event.end === "21:00")});
    const event21_22 = events.filter((event) => {return (event.start === "21:00" && event.end === "22:00")});
    const event22_23 = events.filter((event) => {return (event.start === "22:00" && event.end === "23:00")});
    const event23_00 = events.filter((event) => {return (event.start === "23:00" && event.end === "00:00")});
    return (
      <>
        <FlexBetween flexDirection="column" sx={{maxHeight: "540px", minHeight: "540px"}}>
          <ScheduleBox text={text}/>
          <ScheduleBox event={event7_8[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event8_9[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event9_10[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event10_11[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event11_12[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event12_13[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event13_14[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event14_15[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event15_16[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event16_17[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event17_18[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event18_19[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event19_20[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event20_21[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event21_22[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event22_23[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
          <ScheduleBox event={event23_00[0]} isDelete={isDelete} isUpdate={isUpdate} userId={userId}/>
        </FlexBetween>
      </>
    )
  }
}

export default ScheduleColumn;