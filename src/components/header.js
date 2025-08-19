import React, {useEffect, useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import "./header.css";

const Header = () => {
    const [activeTab, setActiveTab] = useState("Home");

    const location = useLocation();

    useEffect(() =>{
        if (location.pathname === "/"){
            setActiveTab("Home");
        } else if (location.pathname  === "/add"){
            setActiveTab("AddContact");
        } else if (location.pathname === "/about"){
            setActiveTab("About");
        }
    }, [location]);

    return (
        <div className="header">
            <p className="logo">Contact App</p>
            <div className="header-right">
                
                <Link to="/" onClick={() =>setActiveTab("Home")}>
                <p
                    className={`${activeTab === "Home" ? "active" : ""}`}
                >
                    Home
                </p>
                </Link>

                <Link to="/add" onClick={() =>setActiveTab("AddContact")}>
                <p
                    className={`${activeTab === "AddContact" ? "active" : ""}`}
                >
                    AddContact
                </p>
                </Link>

                <Link to="/about" onClick={() =>setActiveTab("About")}>
                <p
                    className={`${activeTab === "About" ? "active" : ""}`}
                >
                    About
                </p>
                </Link>

                <Link to="/scan" onClick={() =>setActiveTab("Scanner")}>
                <p
                    className={`${activeTab === "Scanner" ? "active" : ""}`}
                >
                    Scan
                </p>
                </Link>

            </div>
        </div>
    )
    }

    export default Header;