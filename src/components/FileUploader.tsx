'use client'

import { useCallback, Dispatch, SetStateAction } from 'react'
import { useDropzone } from '@uploadthing/react'
import { generateClientDropzoneAccept } from 'uploadthing/client'

import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'

type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void
  imageUrls: string[] | undefined
  setFiles: Dispatch<SetStateAction<File[]>>
}

export function FileUploader({
  imageUrls,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    const urls = acceptedFiles.map((file) => convertFileToUrl(file))
    onFieldChange(urls)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*']),
    multiple: true,
  })

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex border p-2 cursor-pointer flex-col overflow-hidden rounded-md bg-grey-50"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrls && imageUrls.length > 0 ? (
        <div className="flex h-full w-full flex-1 justify-center flex-wrap">
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`image-${index}`}
              width={250}
              height={250}
              className="w-full object-cover object-center m-2"
            />
          ))}
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500 justify-center items-center flex">
          <Image src="/upload.svg" width={77} height={77} alt="file upload" />
          <h3 className="mb-2 mt-2 text-[#a9a9a9]">
            Drag photos here or Click and select
          </h3>
        </div>
      )}
    </div>
  )
}
