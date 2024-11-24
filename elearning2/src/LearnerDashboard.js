import React, { useEffect, useState } from "react";
import { supabaseClient } from "./supabClient";
import pipwerks from "pipwerks-scorm-api-wrapper";
// Import pipwerks SCORM API wrapper

const LearnerDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    try {
      console.log("Supabase Client in LearnerDashboard:", supabaseClient);
      const { data, error } = await supabaseClient.from("courses").select("*");
      if (error) throw error;
      console.log("Fetched courses:", data);
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize SCORM
  const initializeSCORM = (course) => {
    try {
      const initialized = pipwerks.SCORM.init();
      if (initialized) {
        console.log("SCORM initialized successfully.");
        const lessonStatus = pipwerks.SCORM.get("cmi.core.lesson_status");
        console.log(`Lesson Status: ${lessonStatus}`);
        setSelectedCourse(course);
      } else {
        console.error("SCORM initialization failed.");
      }
    } catch (error) {
      console.error("Error initializing SCORM:", error);
    }
  };

  // Load courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>Learner Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : selectedCourse ? (
        <div>
          <button
            onClick={() => {
              pipwerks.SCORM.finish(); // End SCORM session when returning to courses
              setSelectedCourse(null);
            }}
          >
            Back to Courses
          </button>
          <iframe
            src={selectedCourse.scorm_url}
            title={selectedCourse.title}
            style={{
              width: "100%",
              height: "90vh",
              border: "none",
            }}
          />
        </div>
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id} style={{ marginBottom: "20px" }}>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <button onClick={() => initializeSCORM(course)}>
                Launch Course
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LearnerDashboard;
