import { useEffect, useState } from "react";
import SubjectCol from "./SubjectCol";
import DescCol from "./DescCol";
import FlexBetween from "./FlexBetween";
import DeadlineCol from "./DeadlineCol";

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    const response = await fetch('http://localhost:8000/api/todo')
    const data = await response.json()  
    setCourses(data)
  }

  useEffect(() => {
    getCourses()
  }, [])

  return <FlexBetween>
      {/* {courses.map((course) => (
        <Course
          key={course._id}
          subject={course.subject}
          description={course.description}
          deadline={course.deadline}
          status={course.status}
        />
      ))} */}
      <SubjectCol courses={courses}/>
      <DescCol courses={courses}/>
      <DeadlineCol courses={courses}/>
    </FlexBetween>
};

export default CourseList;