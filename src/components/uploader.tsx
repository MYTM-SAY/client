'use client'

import { useCallback, Dispatch, SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'

type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void
  imageUrls: string[] | undefined
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploader({ imageUrls, onFieldChange, setFiles }: FileUploaderProps) {
  // Track created object URLs to clean them up later
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  
  const convertFileToUrl = (file: File): string => {
    const url = URL.createObjectURL(file)
    setObjectUrls(prev => [...prev, url])
    return url
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [objectUrls])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
      const urls = acceptedFiles.map((file) => convertFileToUrl(file))
      onFieldChange(urls)
    },
    [onFieldChange, setFiles],
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files)
      onDrop(filesArray)
      // Reset the input value to allow selecting the same file again
      event.target.value = ''
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files) {
      const filesArray = Array.from(event.dataTransfer.files)
      onDrop(filesArray)
    }
  }

  // Helper function to determine if a file is a video
  const isVideoFile = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.mkv'];
    const lowerCaseUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
  }
  console.log({
    imageUrls,
  });
  

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-center bg-dark-3 flex border p-2 cursor-pointer flex-col overflow-hidden rounded-md bg-grey-50"
    >
      <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" accept="image/*,video/*" multiple />

      {imageUrls && imageUrls.length > 0 ? (
        <div className="flex h-full w-full flex-1 justify-center flex-wrap">
          {imageUrls.map((url, index) => (
            isVideoFile(url) ? (
              <div key={index} className="relative m-2 w-full">
                <video 
                  src={url} 
                  controls 
                  className="w-full h-auto rounded"
                />
              </div>
            ) : (
              <Image
                key={index}
                src={url}
                alt={`media-${index}`}
                width={250}
                height={250}
                className="w-full object-cover object-center m-2"
              />
            )
          ))}
        </div>
      ) : (
        <label htmlFor="file-upload" className="w-full cursor-pointer">
          <div className="flex-center flex-col py-5 text-grey-500 justify-center items-center flex">
            <Image src="/upload.svg" width={77} height={77} alt="file upload" />
            <h3 className="mb-2 mt-2 text-[#a9a9a9]">Drag media here or Click and select</h3>
            <p className="text-xs text-[#a9a9a9]">Supports images and videos</p>
          </div>
        </label>
      )}
    </div>
  )
}
