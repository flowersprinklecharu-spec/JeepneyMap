import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { database } from "../firebase";
import { QRCodeCanvas } from "qrcode.react"; // Import QR code component
import "./View.css";

const View = () => {
 const [user, setUser] = useState({});
 const { id } = useParams();
 const qrRef = useRef();

 useEffect(() => {
  database.ref(`contacts/${id}`).once("value", (snapshot) => {
   if (snapshot.exists()) {
    setUser(snapshot.val());
   }
  });
 }, [id]);

 const qrValue = id; // QR Code value based in ID number

 const handleDownload = () => {
  const canvas = qrRef.current.querySelector("canvas");
  const url = canvas.toDataURL("image/jpeg");
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${id}.jpg`;
  link.click();
 };

 return (
  <div className="view-container">
   <h2>View Contact</h2>
   <div className="contact-info">
    {user.imageUrl && (
        <div className="image-container">
            <img 
            src={user.imageUrl}
            alt="Contact"
            style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "200%"}}
            />
        </div>
    )}
    <p><strong>Name:</strong> {user.name || "N/A"}</p>
    <p><strong>Email:</strong> {user.email || "N/A"}</p>
    <p><strong>Contact:</strong> {user.contact || "N/A"}</p>
   </div>

  {/* Show QR code if contact exists also add download QR Option*/}
   {id && (
    <div className="qr-section">
     <h3>QR Code</h3>
     <div ref={qrRef}>
      <QRCodeCanvas value={qrValue} size={180} />
     </div>
     <p style={{ marginTop: "10px" }}><strong>ID Number:</strong> {qrValue}</p>
     <button onClick={handleDownload} className="download-btn">
      Download QR Code
     </button>
    </div>
   )}
   <Link to="/" className="back-btn">
    Go Back
   </Link>
  </div>
 );
};

export default View;