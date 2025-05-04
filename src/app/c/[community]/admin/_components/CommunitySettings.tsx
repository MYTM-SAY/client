"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function CommunitySettings() {
  const [settings, setSettings] = useState({
    name: "Tech Enthusiasts",
    description: "A community for technology lovers and professionals.",
    isPrivate: false,
    requireApproval: true,
    allowGuests: false,
    primaryColor: "#3b82f6",
    logo: "/logo.png"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({ ...prev, [name]: checked }));
    } else {
      setSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings to database
    alert("Settings saved successfully!");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Community Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Community Name
            </label>
            <input
              type="text"
              name="name"
              value={settings.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                name="primaryColor"
                value={settings.primaryColor}
                onChange={handleChange}
                className="w-10 h-10 border-0"
              />
              <input
                type="text"
                name="primaryColor"
                value={settings.primaryColor}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Community Description
          </label>
          <textarea
            name="description"
            value={settings.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Privacy Settings</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              name="isPrivate"
              checked={settings.isPrivate}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
              Private Community (only visible to members)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireApproval"
              name="requireApproval"
              checked={settings.requireApproval}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="requireApproval" className="ml-2 text-sm text-gray-700">
              Require approval for new members
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowGuests"
              name="allowGuests"
              checked={settings.allowGuests}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="allowGuests" className="ml-2 text-sm text-gray-700">
              Allow guest viewing (non-members can view but not post)
            </label>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Community Logo</h3>
          <div className="flex items-center space-x-4">
            <img 
              src={settings.logo} 
              alt="Community logo" 
              className="w-16 h-16 rounded-full object-cover border"
            />
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Change Logo
            </button>
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Save size={18} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
} 