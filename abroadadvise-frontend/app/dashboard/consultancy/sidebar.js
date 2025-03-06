"use client";  // ✅ Ensures this is a Client Component

const Sidebar = () => {
    return (
        <div style={{ width: "250px", background: "#eee", padding: "10px" }}>
            <h2>Sidebar</h2>
            <ul>
                <li>Dashboard</li>
                <li>Profile</li>
                <li>Settings</li>
            </ul>
        </div>
    );
};

export default Sidebar;
