import React, { useEffect, useRef, useState } from "react"; // React core and hooks
import { Html5QrcodeScanner } from "html5-qrcode"; // QR scanner library
import { database } from "../firebase"; // Firebase database instance
import "./Scanner.css"; // Optional: custom styles
import { useNavigate } from "react-router-dom"; // Hook to navigate to different routes

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null); // State to store scanned QR code text
  const scannerRef = useRef(null); // Ref to reference the scanner DOM container
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    // Initialize QR code scanner with configuration
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,      // Frames per second
      qrbox: 250    // Size of the QR scanning area
    });

    // Render scanner with success and error callbacks
    scanner.render(
      async (decodedText, decodedResult) => {
        scanner.clear(); // Stop scanning after a QR code is successfully read
        setScanResult(decodedText); // Save the scanned text (expected to be a contact ID)

        // Look for contact in Firebase Realtime Database using the scanned ID
        const contactRef = database.ref(`contacts/${decodedText}`);
        contactRef.once("value", (snapshot) => {
          if (snapshot.exists()) {
            // If contact exists, navigate to view page with that ID
            navigate(`/view/${decodedText}`);
          } else {
            // If contact doesn't exist, alert the user
            alert("Contact not found for ID: " + decodedText);
          }
        });
      },
      (error) => {
        // Handle scan failure or camera issues
        console.warn("QR Code Scan Error: ", error);
      }
    );

    // Cleanup scanner when component unmounts to prevent memory leaks
    return () => {
      scanner.clear().catch((e) => console.error("Scanner cleanup error", e));
    };
  }, [navigate]); // Only re-run if the `navigate` function changes

  return (
    <div className="scanner-container"> {/* Container for styling */}
      <h2>Scan QR Code</h2> {/* Title/header */}
      <div id="reader" ref={scannerRef} style={{ width: "100%" }}></div> {/* QR scanner UI container */}
      {scanResult && <p>Scanned ID: {scanResult}</p>} {/*display of the scanned result */}
    </div>
  );
};

export default Scanner;