"use client"; // Ensures this component runs only on the client

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check login status only on the client
        setIsLoggedIn(localStorage.getItem("token") !== null);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");  // Remove token on logout
        router.push("/login");  // Redirect to login page
    };

    return (
        <nav>
            <h1>Consultancy Dashboard</h1>
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
};

export default Navbar;
