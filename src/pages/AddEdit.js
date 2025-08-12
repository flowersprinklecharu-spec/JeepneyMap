import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // For navigation and accessing route parameters
import "./AddEdit.css"; // Styles specific to this component
import { database } from "../firebase"; // Firebase database instance
import { toast } from "react-toastify"; // For showing toast messages

// Initial state structure for the contact form
const initialState = {
  name: "",
  email: "",
  contact: "",
  id: ""
};

const AddEdit = () => {
  // State to manage form input values
  const [state, setState] = useState(initialState);

  // State to store all contacts from Firebase
  const [data, setData] = useState({});

  const [imageFile,setImageFile] = useState(null);

  // Get the dynamic `id` from the URL (used when editing a contact)
  const { id } = useParams();

  // For navigating between routes programmatically
  const navigate = useNavigate();

  // Destructure individual fields from the current state
  const { name, email, contact, id: contactId } = state;

  // useEffect to either generate a new ID or load contact data (for update)
  useEffect(() => {
    // If there's no ID in URL, generate a new unique ID
    if (!id) {
      database.ref("contacts").once("value", (snapshot) => {
        const contacts = snapshot.val() || {};

        // Get numeric keys only, sort them, and find the next available ID
        const numericIds = Object.keys(contacts)
          .filter((key) => /^\d+$/.test(key))
          .map((key) => parseInt(key, 10))
          .sort((a, b) => b - a);

        const nextId = numericIds.length > 0 ? numericIds[0] + 1 : 1;
        const formattedId = String(nextId).padStart(6, "0"); // Pad with zeros

        // Set the generated ID in the state
        setState((prevState) => ({ ...prevState, id: formattedId }));
      });
    }

    // If editing an existing contact, load its data into the form
    if (id && data[id]) {
      setState({ ...data[id], id });
    }
  }, [id, data]);

  // Handle input change for all form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission for both add and update
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !contact) {
      toast.error("Please provide values for all fields.");
    } else {
      // If editing an existing contact
      if (id) {
        database.ref(`contacts/${id}`).set(state, (err) => {
          if (err) {
            toast.error(err); // Show error toast
          } else {
            toast.success("Contact Updated Successfully"); // Show success toast
            setTimeout(() => navigate("/"), 500); // Navigate back to home
          }
        });
      } else {
        // If adding a new contact
        database.ref("contacts").once("value", (snapshot) => {
          const contacts = snapshot.val() || {};

          // Generate a new unique ID
          const numericIds = Object.keys(contacts)
            .filter((key) => /^\d+$/.test(key))
            .map((key) => parseInt(key, 10))
            .sort((a, b) => b - a);

          const nextId = numericIds.length > 0 ? numericIds[0] + 1 : 1;
          const formattedId = String(nextId).padStart(6, "0");

          // Save new contact with generated ID
          database.ref(`contacts/${formattedId}`).set(state, (err) => {
            if (err) {
              toast.error(err); // Show error toast
            } else {
              toast.success(`Contact Added with ID: ${formattedId}`); // Show success toast
              setTimeout(() => navigate("/"), 500); // Navigate back to home
            }
          });
        });
      }
    }
  };

const HandleFileUpload = async (event) => {
  const file = event.target.files[0];// Gets the first selected file
  if (!file) return;
  setImageFile(file);
  const customFilename = state.id ? state.id: `custom-${Date.now()}`;

  const data = new FormData();
  data.append("file",file);
  data.append("upload_preset", "image-upload");
  data.append("cloud_name", "dzmhaks5c");
  data.append("public_id", customFilename);
  const res = await fetch (
    "https://api.cloudinary.com/v1_1/dzmhaks5c/image/upload",
    {
      method:"POST",
      body: data,
    }
  );
  const uploadImageURL =await res.json();
  console.log(uploadImageURL.url);
  setState((prevState) => ({...prevState,imageUrl: uploadImageURL.url}));
};
  
  // console.log(file);


  // Render the Add/Edit form
  return (
    <div className="container">
      <h2>{id ? "Update Contact" : "Add Contact"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Display the contact ID (either generated or existing) */}
        <label htmlFor="id">
          ID Number: {contactId ? contactId : "Generating ID..."}
        </label>

        {/* Name input field */}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your Name..."
          value={name}
          onChange={handleInputChange}
        />

        {/* Email input field */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Input Email..."
          value={email}
          onChange={handleInputChange}
        />

        {/* Contact input field */}
        <label htmlFor="contact">Contact</label>
        <input
          type="number"
          id="contact"
          name="contact"
          placeholder="Input Contact Number..."
          value={contact}
          onChange={handleInputChange}
        />
        {/* Image upload section */}
        <label htmlFor="image">Profile Image</label>
        <input
        type="file"
        className="file-input"
        id="image"
        name="image"
        accept="image/*"
        onChange={HandleFileUpload}
        />
        {/* Submit button - changes text based on mode (add or update) */}
        <input
          type="submit"
          value={id ? "Update" : "Save"}
          className="submit-btn"
        />
      </form>
    </div>
  );
};

export default AddEdit;