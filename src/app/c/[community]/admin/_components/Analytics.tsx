"use client";

import { useState } from "react";
import { Users, MessageSquare, TrendingUp, Calendar } from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("month");
  
  // Mock data - in a real app, this would come from your database
  const stats = {
    totalUsers: 1245,
    activeUsers: 782,
    totalPosts: 3567,
    totalComments: 12893,
    newUsersToday: 23,
    postsToday: 78
  };
  
  // Mock chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Users",
        data: [120, 150, 180, 220, 250, 280]
      },
      {
        label: "Posts",
        data: [250, 300, 280, 350, 380, 420]
      }
    ]
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Community Analytics</h2>
        
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-md ${timeRange === "week" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTimeRange("week")}
          >
            Week
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${timeRange === "month" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTimeRange("month")}
          >
            Month
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${timeRange === "year" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTimeRange("year")}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+{stats.newUsersToday} today</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">{stats.activeUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="text-2xl font-bold">{stats.totalPosts}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+{stats.postsToday} today</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Comments</p>
              <p className="text-2xl font-bold">{stats.totalComments}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">~{Math.round(stats.totalComments / stats.totalPosts)} per post</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Growth Trends
          </h3>
          <div className="h-64 flex items-center justify-center border rounded">
            <p className="text-gray-500">Chart visualization would go here</p>
            {/* In a real app, you would use a chart library like Chart.js or Recharts */}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Activity Calendar
          </h3>
          <div className="h-64 flex items-center justify-center border rounded">
            <p className="text-gray-500">Activity heatmap would go here</p>
            {/* In a real app, you would use a calendar heatmap visualization */}
          </div>
        </div>
      </div>
    </div>
  );
} 