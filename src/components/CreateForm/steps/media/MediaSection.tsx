"use client";
// components/create-form/steps/media/MediaSection.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { X, PlayCircle, Maximize2 } from "lucide-react";
import { BannerUpload } from "./BannerUpload";
import { AdditionalMedia } from "./AdditionalMedia";

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  file?: File;
}

interface SelectedMedia {
  type: "image" | "video";
  url: string;
}

export const MediaSection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(
    null
  );
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleBannerSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleMediaUpload = (files: FileList, type: "image" | "video") => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaItems((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            type,
            url: reader.result as string,
            file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <BannerUpload
        selectedImage={selectedImage}
        onImageSelect={handleBannerSelect}
        onImageRemove={() => setSelectedImage(null)}
      />
      <AdditionalMedia
        onVideoUpload={() => videoInputRef.current?.click()}
        onGalleryUpload={() => galleryInputRef.current?.click()}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={(e) =>
          e.target.files && handleMediaUpload(e.target.files, "video")
        }
      />
      <input
        type="file"
        ref={galleryInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={(e) =>
          e.target.files && handleMediaUpload(e.target.files, "image")
        }
      />

      {/* Media Preview Section */}
      {mediaItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Media Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mediaItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.type === "image" ? (
                  <div className="relative w-full h-48">
                    <img
                      src={item.url}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() =>
                        setSelectedMedia({ type: "image", url: item.url })
                      }
                    >
                      <Maximize2 className="w-12 h-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-48">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover rounded-lg"
                      controls={false}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() =>
                        setSelectedMedia({ type: "video", url: item.url })
                      }
                    >
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
                {/* Separate overlay for delete button and badge */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMedia(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Badge variant="secondary">
                    {item.type === "image" ? "Image" : "Video"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Dialog */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="max-w-4xl ">
          <DialogHeader>
            <DialogTitle className="sr-only">
              {selectedMedia?.type === "image"
                ? "Image Preview"
                : "Video Preview"}
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm !bg-destructive" />
          </DialogHeader>
          <div className="mt-2 ">
            {selectedMedia?.type === "image" ? (
              <img
                src={selectedMedia.url}
                alt="Preview"
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <video
                src={selectedMedia?.url}
                className="w-full h-auto rounded-lg"
                controls
                autoPlay
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
