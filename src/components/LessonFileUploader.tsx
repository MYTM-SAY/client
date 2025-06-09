'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, File, FileVideo, FileAudio, FileImage, FileText } from 'lucide-react'
import { uploadMedia } from '@/lib/actions/upload'
import { toast } from 'react-hot-toast'
import { MaterialType } from '@/types'
import Image from 'next/image'

interface LessonFileUploaderProps {
  materialType: MaterialType
  currentFileUrl?: string
  onFileUpload: (fileUrl: string) => void
  onFileRemove: () => void
  disabled?: boolean
}

const getAcceptedTypes = (materialType: MaterialType): string => {
  switch (materialType) {
    case MaterialType.VIDEO:
      return 'video/*'
    case MaterialType.AUDIO:
      return 'audio/*'
    case MaterialType.IMG:
      return 'image/*'
    case MaterialType.DOC:
      return '.doc,.docx,.txt,.rtf'
    case MaterialType.FILE:
      return '.pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx,.xls,.xlsx'
    default:
      return '*'
  }
}

const getFileIcon = (materialType: MaterialType) => {
  switch (materialType) {
    case MaterialType.VIDEO:
      return <FileVideo className="h-12 w-12" />
    case MaterialType.AUDIO:
      return <FileAudio className="h-12 w-12" />
    case MaterialType.IMG:
      return <FileImage className="h-12 w-12" />
    case MaterialType.DOC:
      return <FileText className="h-12 w-12" />
    case MaterialType.FILE:
      return <File className="h-12 w-12" />
    default:
      return <File className="h-12 w-12" />
  }
}

const getMaxSize = (materialType: MaterialType): number => {
  switch (materialType) {
    case MaterialType.VIDEO:
      return 100 * 1024 * 1024 // 100MB for videos
    case MaterialType.AUDIO:
      return 50 * 1024 * 1024  // 50MB for audio
    case MaterialType.IMG:
      return 10 * 1024 * 1024  // 10MB for images
    case MaterialType.DOC:
    case MaterialType.FILE:
      return 25 * 1024 * 1024  // 25MB for documents
    default:
      return 10 * 1024 * 1024  // 10MB default
  }
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function LessonFileUploader({
  materialType,
  currentFileUrl,
  onFileUpload,
  onFileRemove,
  disabled = false,
}: LessonFileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentFileUrl || null)
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = getAcceptedTypes(materialType)
  const maxSize = getMaxSize(materialType)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${formatBytes(maxSize)}`)
      return
    }

    // Validate file type based on material type
    const fileType = file.type
    const fileName = file.name.toLowerCase()
    
    let isValidType = false
    
    switch (materialType) {
      case MaterialType.VIDEO:
        isValidType = fileType.startsWith('video/')
        break
      case MaterialType.AUDIO:
        isValidType = fileType.startsWith('audio/')
        break
      case MaterialType.IMG:
        isValidType = fileType.startsWith('image/')
        break
      case MaterialType.DOC:
        isValidType = fileType.includes('document') || fileType.includes('text') || 
                     fileName.endsWith('.doc') || fileName.endsWith('.docx') || 
                     fileName.endsWith('.txt') || fileName.endsWith('.rtf')
        break
      case MaterialType.FILE:
        isValidType = fileType.includes('pdf') || fileType.includes('document') || 
                     fileType.includes('text') || fileType.includes('spreadsheet') || 
                     fileType.includes('presentation') ||
                     fileName.endsWith('.pdf') || fileName.endsWith('.doc') || 
                     fileName.endsWith('.docx') || fileName.endsWith('.txt') || 
                     fileName.endsWith('.ppt') || fileName.endsWith('.pptx') || 
                     fileName.endsWith('.xls') || fileName.endsWith('.xlsx')
        break
    }

    if (!isValidType) {
      toast.error(`Please select a valid ${materialType.toLowerCase()} file`)
      return
    }

    setIsUploading(true)
    setFileName(file.name)
    
    try {
      // Create preview for images
      if (materialType === MaterialType.IMG) {
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)
      }

      // Upload file
      const result = await uploadMedia([file])
      if (result.success) {
        const uploadedUrl = result.data[0]
        onFileUpload(uploadedUrl)
        toast.success('File uploaded successfully')
        
        if (materialType === MaterialType.IMG && previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(uploadedUrl)
      } else {
        toast.error(result.message)
        if (materialType === MaterialType.IMG && previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(currentFileUrl || null)
        setFileName('')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file')
      if (materialType === MaterialType.IMG && previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(currentFileUrl || null)
      setFileName('')
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    setFileName('')
    onFileRemove()
    toast.success('File removed')
  }

  const renderPreview = () => {
    if (!previewUrl) return null

    switch (materialType) {
      case MaterialType.IMG:
        return (
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={previewUrl}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )
      case MaterialType.VIDEO:
        return (
          <div className="w-full">
            <video 
              controls 
              className="w-full h-48 rounded-lg"
              src={previewUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )
      case MaterialType.AUDIO:
        return (
          <div className="w-full">
            <audio 
              controls 
              className="w-full"
              src={previewUrl}
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        )
      default:
        return (
          <div className="flex items-center space-x-3 p-4 border rounded-lg">
            {getFileIcon(materialType)}
            <div className="flex-1">
              <p className="font-medium">{fileName || 'Uploaded file'}</p>
              <p className="text-sm text-muted-foreground">
                {materialType} file uploaded
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {previewUrl ? (
        <div className="space-y-3">
          {renderPreview()}
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveFile}
              disabled={isUploading}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Remove File</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-gray-400">
              {getFileIcon(materialType)}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes}
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || isUploading}
              />
              <Button
                type="button"
                variant="default"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>
                  {isUploading ? 'Uploading...' : `Upload ${materialType}`}
                </span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {materialType === MaterialType.VIDEO && 'MP4, AVI, MOV, etc. Max 100MB'}
              {materialType === MaterialType.AUDIO && 'MP3, WAV, AAC, etc. Max 50MB'}
              {materialType === MaterialType.IMG && 'JPG, PNG, GIF, etc. Max 10MB'}
              {materialType === MaterialType.DOC && 'DOC, DOCX, TXT, RTF. Max 25MB'}
              {materialType === MaterialType.FILE && 'PDF, DOC, PPT, XLS, etc. Max 25MB'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 