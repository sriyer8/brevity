import React, { useState } from "react";
import { supabClient } from "./supabClient";

function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !file) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      // Upload file to Supabase Storage
      const filePath = `${Date.now()}-${file.name}`;
      const { data, error } = await supabClient.storage
        .from("scorm-packages")
        .upload(filePath, file);

      if (error) throw error;

      const scormUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/scorm-packages/${data.path}`;

      // Insert record in Supabase
      const { error: insertError } = await supabClient
        .from("courses")
        .insert([{ title, description, scorm_url: scormUrl }]);

      if (insertError) throw insertError;

      alert("SCORM package uploaded successfully.");
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading SCORM package:", error);
      alert("Failed to upload SCORM package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".zip"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload SCORM Package"}
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;
