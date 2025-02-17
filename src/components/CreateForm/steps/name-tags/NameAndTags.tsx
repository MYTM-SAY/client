"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagInput } from "./TagInput";

export const NameAndTags = () => {
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="communityName">Community Name</Label>
        <Input
          id="communityName"
          placeholder="Enter your community name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="max-w-md"
        />
      </div>
      <TagInput
        tags={tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />
    </div>
  );
};
