import React, { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import TeacherHeader from "../Dasboards/TeacherHeader";

export default function AddLessonToClassSession() {
  const [classSessions, setClassSessions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchClassSessions();
    fetchLessons();
  }, []);

  const fetchClassSessions = () => {
    axios.get("/api/ClassSession/getClassSessions")
      .then(response => {
        // Fetch the selected lesson for each class session
        const updatedClassSessions = response.data.map(session => {
          const selectedLesson = lessons.find(lesson => lesson.lesson_id === session.lesson_id);
          return { ...session, selectedLesson };
        });

        setClassSessions(updatedClassSessions);
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
      });
  };

  const handleLessonChange = (sessionClassId, lessonId) => {
    axios.post(`/api/ClassSession/addClassSessionLesson?classSessionId=${sessionClassId}&lesson_Id=${lessonId}`)
      .then(response => {
        // Update selected lesson for the class session
        const updatedClassSessions = classSessions.map(session => {
          if (session.sessionClassId === sessionClassId) {
            return { ...session, selectedLesson: lessonId };
          }
          return session;
        });
        setClassSessions(updatedClassSessions);
        alert(response.data.statusMessage);
      })
      .catch(error => {
        console.error('Error setting lesson:', error);
      });
  };

  return (
    <Fragment>
      <TeacherHeader />
      <section>
        <div className="card card-registration my-4">
          <div className="card-body p-md-5 text-black">
            <h3 className="mb-5 text-uppercase text-center">Class Sessions</h3>
            {isLoaded ? (
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Session ID</th>
                    <th scope="col">Start Time</th>
                    <th scope="col">Lesson</th>
                  </tr>
                </thead>
                <tbody>
                  {classSessions.map((session, index) => (
                    <tr key={index}>
                      <td>{session.sessionClassId}</td>
                      <td>{session.startTime}</td>
                      <td>
                      <select
                        className="form-select"
                        value={session.selectedLesson ? session.selectedLesson.lesson_id : ''} // Use selected lesson ID
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
        </div>
      </section>
    </Fragment>
  );
}
