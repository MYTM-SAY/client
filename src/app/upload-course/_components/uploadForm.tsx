"use client";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/FileUploader";
import { useUploadThing } from "@/components/uploadthing";

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");
  const uploadFileSchema = z.object({
    image: z.array(z.string()).optional(),
  });
  const form = useForm<z.infer<typeof uploadFileSchema>>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      image: [],
    },
  });

  async function onSubmit(data: z.infer<typeof uploadFileSchema>) {
    setLoading(true);
    if (files.length > 0) {
      try {
        console.log("1");
        const uploadedImage = await startUpload(files);
        console.log("2");
        console.log({ data, uploadedImage });
      } catch (error) {
        console.error(error);
        toast.error("Error uploading image");
      } finally {
        setLoading(false);
      }
    }
    toast.success("File Uploaded successfully");
    setLoading(false);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="font-mono p-4 flex flex-col gap-5 h-full justify-center items-center w-[90%] m-auto shadow-md my-4 rounded-md border-green-200 border"
      >
        <div className="w-[90%]">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Upload File <span className="text-gray-400">(optional)</span>
                </FormLabel>
                <FormControl>
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrls={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 16MB
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-[90%] bg-green-400 hover:bg-green-600 mt-4"
        >
          {loading ? "Uploading File..." : "Upload File"}
        </Button>
      </form>
    </Form>
  );
}
