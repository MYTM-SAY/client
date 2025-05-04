"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Shield, Ban, UserPlus } from "lucide-react";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app, this would come from your database
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Member", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Moderator", status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Member", status: "Suspended" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Admin", status: "Active" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <UserPlus size={18} />
          <span>Invite User</span>
        </button>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          className="pl-10 pr-4 py-2 border rounded-md w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-gray-700">
                      <Shield size={18} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <Ban size={18} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 