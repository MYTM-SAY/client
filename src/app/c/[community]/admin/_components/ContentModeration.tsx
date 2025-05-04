"use client";

import { useState } from "react";
import { Search, Flag, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function ContentModeration() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in a real app, this would come from your database
  const reports = [
    { 
      id: 1, 
      contentType: "Post", 
      title: "Inappropriate content", 
      reporter: "user123", 
      reportedUser: "problematicUser", 
      status: "pending",
      date: "2023-05-15" 
    },
    { 
      id: 2, 
      contentType: "Comment", 
      title: "Harassment", 
      reporter: "concerned_user", 
      reportedUser: "harasser99", 
      status: "resolved",
      date: "2023-05-14" 
    },
    { 
      id: 3, 
      contentType: "Post", 
      title: "Spam content", 
      reporter: "moderator1", 
      reportedUser: "spammer123", 
      status: "pending",
      date: "2023-05-13" 
    },
  ];

  const filteredReports = filter === "all" 
    ? reports 
    : reports.filter(report => report.status === filter);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Content Moderation</h2>
      
      <div className="flex justify-between mb-6">
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${filter === "resolved" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setFilter("resolved")}
          >
            Resolved
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reports..."
            className="pl-10 pr-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <Flag className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium">{report.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    report.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                  }`}>
                    {report.status === "pending" ? "Pending" : "Resolved"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {report.contentType} reported by {report.reporter} against {report.reportedUser}
                </p>
                <p className="text-xs text-gray-400 mt-1">Reported on {report.date}</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <XCircle className="h-6 w-6 text-red-500" />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 