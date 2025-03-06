"use client"; // Make sure this is a client-side rendered component

import { useState, useEffect } from "react";

export default function ConsultancyDashboard() {
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Using localStorage only on the client side
        setToken(localStorage.getItem("token"));
    }, []); // Empty dependency ensures this runs once on the client side

    if (!token) {
        return <p>Loading...</p>; // Prevent hydration mismatch by rendering a loading state
    }

    return (
        <div>
            <h1>Welcome to the Consultancy Dashboard</h1>
            <p>Your token: {token}</p>
        </div>
    );
}
