"use client";

import React from "react";
// import { Users, FileText, Settings, BarChart2 } from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    // { id: "users", label: "User Management" },
    // { id: "content", label: "Content Moderation" },
    { id: "classroom", label: "Classroom Management" },
    // { id: "settings", label: "Community Settings" },
    // { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Admin Panel</h2>
      </div>
      <nav className="p-4">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id} className="mb-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar; 