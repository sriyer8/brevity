import React, { useEffect, useState } from "react";
import { supabaseClient } from "./supabClient"; // Ensure the correct import path

const LearnerDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    try {
      const { data, error } = await supabaseClient.from("courses").select("*");
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize SCORM tracking (only when a course is selected)
  const initializeSCORM = () => {
    if (!window.pipwerks) {
      console.error("SCORM API wrapper not loaded!");
      return;
    }
    const scorm = window.pipwerks.SCORM;
    scorm.version = "1.2"; // SCORM version
    const initSuccess = scorm.init();
    if (initSuccess) {
      console.log("SCORM initialized successfully!");
    } else {
      console.error("Failed to initialize SCORM.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      initializeSCORM(); // Initialize SCORM when a course is selected
    }
  }, [selectedCourse]);

  return (
    <div>
      <h1>Learner Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : selectedCourse ? (
        <div>
          <button onClick={() => setSelectedCourse(null)}>Back to Courses</button>
          <iframe
            src={selectedCourse.scorm_url}
            title={selectedCourse.title}
            style={{
              width: "100%",
              height: "90vh",
              border: "none",
            }}
            onLoad={initializeSCORM} // Ensure SCORM initializes on iframe load
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
              <button onClick={() => setSelectedCourse(course)}>Launch Course</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LearnerDashboard;
