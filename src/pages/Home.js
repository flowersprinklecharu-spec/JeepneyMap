import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // For navigation links
import { database } from "../firebase"; // Firebase database import
import { toast } from "react-toastify"; // For showing success/error messages
import "./Home.css"; // Styles specific to this component

const Home = () => {
  // State to store all contact data
  const [data, setData] = useState({});
  // State to store filtered contact data (based on search)
  const [filteredData, setFilteredData] = useState({});
  // State to store the search term entered by the user
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect to fetch contact data from Firebase when component mounts
  useEffect(() => {
    // Listen for real-time updates to 'contacts' node
    database.ref("contacts").on("value", (snapshot) => {
      if (snapshot.exists()) {
        const contactData = snapshot.val();
        setData(contactData); // Store full contact data
        setFilteredData(contactData); // Also initialize filtered data
      } else {
        // If no data exists, clear state
        setData({});
        setFilteredData({});
      }
    });
  }, []);

  // Function to delete a contact by ID
  const onDelete = (id) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this contact?")) {
      // Remove the contact from Firebase
      database.ref(`contacts/${id}`).remove((err) => {
        if (err) {
          toast.error(err); // Show error if deletion fails
        } else {
          toast.success("Contact Deleted Successfully"); // Show success message
        }
      });
    }
  };

  // Function to filter contacts based on the search term
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase(); // Normalize search term
    setSearchTerm(term); // Update search state

    // Filter logic: check if ID, name, email, or contact contains the term
    const filtered = Object.keys(data).reduce((acc, key) => {
      const contact = data[key];
      const idMatch = key.toLowerCase().includes(term);
      const nameMatch = contact.name?.toLowerCase().includes(term);
      const emailMatch = contact.email?.toLowerCase().includes(term);
      const contactMatch = contact.contact?.toString().includes(term);

      // If any field matches, include it in the filtered results
      if (idMatch || nameMatch || emailMatch || contactMatch) {
        acc[key] = contact;
      }
      return acc;
    }, {});

    setFilteredData(filtered); // Update filtered data state
  };

  // Render UI
  return (
    <div style={{ marginTop: "20px", padding: "20px" }}>
      <h2>Contact List</h2>

      {/* Search input field */}
      <input
        type="text"
        placeholder="Search by ID, Name, Email, or Contact..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: "20px", padding: "10px", width: "300px" }}
      />

      {/* Table to display contacts */}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th> 
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* If there are filtered results, display them */}
          {Object.keys(filteredData).length > 0 ? (
            Object.keys(filteredData).map((id) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{filteredData[id].name}</td>
                <td>{filteredData[id].email}</td>
                <td>{filteredData[id].contact}</td>
                <td>
                  {/* Link to edit the contact */}
                  <Link to={`/update/${id}`}>
                    <button className="edit">Edit</button>
                  </Link>
                  {/* Button to delete the contact */}
                  <button className="delete" onClick={() => onDelete(id)}>Delete</button>
                  {/* Link to view contact details */}
                  <Link to={`/view/${id}`}>
                    <button className="view">View</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            // Show message if no records match the search
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
