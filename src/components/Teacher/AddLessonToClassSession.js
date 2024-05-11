import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import TeacherHeader from "../Dasboards/TeacherHeader";
import Swal from 'sweetalert2'

export default function AddLessonToClassSession() {
  const [classSessions, setClassSessions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [sessionLessonMap, setSessionLessonMap] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchClassSessions();
    fetchLessons();
  }, []);

  const fetchClassSessions = () => {
    axios.get("/api/ClassSession/getClassSessions")
      .then(response => {
        const sessions = response.data;
        setClassSessions(sessions);

        // Create a map to store session IDs with their associated lesson IDs
        const sessionLessonMap = {};
        sessions.forEach(session => {
          sessionLessonMap[session.sessionClassId] = session.lesson_id; // Ensure correct property name
        });
        console.log("Session Lesson Map:", sessionLessonMap); // Log the sessionLessonMap
        setSessionLessonMap(sessionLessonMap);

        setIsLoaded(true);
      })
      .catch(error => {
        console.error('Error fetching class sessions:', error);
      });
  };

  const fetchLessons = () => {
    axios.get("/api/Lesson/getAllLessons")
      .then(response => {
        setLessons(response.data);
      })
      .catch(error => {
        console.error('Error fetching lessons:', error);
      });
  };

  const handleLessonChange = (sessionClassId, lessonId) => {
    axios.post(`/api/ClassSession/addClassSessionLesson?classSessionId=${sessionClassId}&lesson_Id=${lessonId}`)
      .then(response => {
        Swal.fire({
          title: 'Success!',
          text: response.data.statusMessage
        });

        // Update sessionLessonMap with the new lesson ID
        setSessionLessonMap(prevState => ({
          ...prevState,
          [sessionClassId]: lessonId
        }));
      })
      .catch(error => {
        console.error('Error setting lesson:', error);
      });
  };

  return (
    <Fragment>
      <TeacherHeader />
      <section>
        <div class="testbox">
          <form>
            <div className="banner">
              <h1>Add Lesson to Classes</h1>
            </div>
            <div className="column-custom">
            {isLoaded ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Class Name</th>
                    <th scope="col">Start Time</th>
                    <th scope="col">Lesson</th>
                  </tr>
                </thead>
                <tbody>
                  {classSessions.map((session, index) => (
                    <tr key={index}>
                      <td>{session.name}</td>
                      <td>{session.startTime}</td>
                      <td>
                        <select
                          className="form-select"
                          value={sessionLessonMap[session.sessionClassId] || ''}
                          onChange={(e) => handleLessonChange(session.sessionClassId, e.target.value)}
                        >
                          <option value="">Select Lesson</option>
                          {lessons.map((lesson) => {
                            return (
                              <option key={lesson.lesson_id} value={lesson.lesson_id}>
                                {lesson.name}
                              </option>
                            );
                          })}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Loading...</div>
            )}
            </div>
          </form>
        </div>
      </section>

    </Fragment>
  );
}
