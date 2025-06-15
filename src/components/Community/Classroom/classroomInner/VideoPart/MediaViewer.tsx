import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { FaPlay, FaVolumeUp, FaFileAlt, FaFile, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface Material {
  id: number
  materialType: string
  fileUrl: string
  createdAt: string
  updatedAt: string
  lessonId: number
  duration?: number
}

interface Lesson {
  id: number
  title: string
  duration: number
  completed: boolean
  notes: string
  materials: Material[]
}

function isDirectVideoFile(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|m4v|avi|flv|wmv)$/i.test(url)
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:https?:\/\/(?:www\.)?)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  )
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
  }
  // Vimeo
  const vimeoMatch = url.match(
    /(?:https?:\/\/(?:www\.)?)?vimeo\.com\/(\d+)/
  )
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  }
  // Not a known embed, return original
  return url
}

const VideoViewer = ({ fileUrl }: { fileUrl: string }) => {
  if (isDirectVideoFile(fileUrl)) {
    return (
      <video
        src={fileUrl}
        controls
        autoPlay
        className="w-full h-full rounded-lg object-contain"
      >
        Sorry, your browser doesn&apos;t support embedded videos.
      </video>
    )
  } else {
    const embedUrl = getEmbedUrl(fileUrl) || ''
    return (
      <iframe
        src={embedUrl}
        title="Video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg object-contain"
      />
    )
  }
}

const AudioViewer = ({ fileUrl }: { fileUrl: string }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-full shadow-lg">
        <FaVolumeUp className="text-4xl text-blue-500" />
      </div>
      <audio
        src={fileUrl}
        controls
        className="w-full max-w-md"
        autoPlay
      >
        Your browser does not support the audio element.
      </audio>
      <p className="text-sm text-muted-foreground">Audio Content</p>
    </div>
  )
}

const ImageViewer = ({ fileUrl }: { fileUrl: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      <Image
        src={fileUrl}
        fill
        alt="Lesson content"
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
          const parent = (e.target as HTMLImageElement).parentElement
          if (parent) {
            parent.innerHTML = `
              <div class="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <div class="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <p>Failed to load image</p>
              </div>
            `
          }
        }}
      />
    </div>
  )
}

const DocumentViewer = ({ fileUrl }: { fileUrl: string }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-full shadow-lg">
        <FaFileAlt className="text-4xl text-green-500" />
      </div>
      <h3 className="text-lg font-semibold">Document Content</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        This lesson contains a document. Click the download button below to view the full content.
      </p>
      <div className="flex gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          View Document
        </a>
        <a
          href={fileUrl}
          download
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FaDownload className="w-4 h-4" />
          Download
        </a>
      </div>
    </div>
  )
}

const FileViewer = ({ fileUrl }: { fileUrl: string }) => {
  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toUpperCase() || 'FILE'
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-full shadow-lg">
        <FaFile className="text-4xl text-purple-500" />
      </div>
      <h3 className="text-lg font-semibold">{getFileExtension(fileUrl)} File</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        This lesson contains a file attachment. Download it to access the content.
      </p>
      <div className="flex gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
        >
          Open File
        </a>
        <a
          href={fileUrl}
          download
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FaDownload className="w-4 h-4" />
          Download
        </a>
      </div>
    </div>
  )
}

const EmptyState = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <FaPlay
        className="text-6xl text-muted-foreground"
      />
      <h3 className="text-lg font-semibold text-muted-foreground">No Content Available</h3>
      <p className="text-sm text-muted-foreground">
        Select a lesson to view its content
      </p>
    </div>
  )
}

const MediaViewer = ({ selectedLesson }: { selectedLesson: Lesson | null }) => {
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0)

  // Reset material index when lesson changes
  useEffect(() => {
    setSelectedMaterialIndex(0)
  }, [selectedLesson?.id])

  if (!selectedLesson || !selectedLesson.materials || selectedLesson.materials.length === 0) {
    return (
      <div>
        <div className="w-full h-[300px] bg-card rounded-lg relative flex items-center justify-center">
          <EmptyState />
        </div>
      </div>
    )
  }

  const materials = selectedLesson.materials
  const material = materials[selectedMaterialIndex]
  const { materialType, fileUrl } = material

  const renderContent = () => {
    switch (materialType) {
      case 'VIDEO':
        return <VideoViewer fileUrl={fileUrl} />
      case 'AUDIO':
        return <AudioViewer fileUrl={fileUrl} />
      case 'IMG':
        return <ImageViewer fileUrl={fileUrl} />
      case 'DOC':
        return <DocumentViewer fileUrl={fileUrl} />
      case 'FILE':
        return <FileViewer fileUrl={fileUrl} />
      default:
        return <EmptyState />
    }
  }

  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <FaPlay className="w-4 h-4" />
      case 'AUDIO':
        return <FaVolumeUp className="w-4 h-4" />
      case 'IMG':
        return <div className="w-4 h-4 bg-blue-400 rounded"></div>
      case 'DOC':
        return <FaFileAlt className="w-4 h-4" />
      case 'FILE':
        return <FaFile className="w-4 h-4" />
      default:
        return <FaFile className="w-4 h-4" />
    }
  }

  const nextMaterial = () => {
    setSelectedMaterialIndex((prev) => 
      prev < materials.length - 1 ? prev + 1 : 0
    )
  }

  const prevMaterial = () => {
    setSelectedMaterialIndex((prev) => 
      prev > 0 ? prev - 1 : materials.length - 1
    )
  }

  return (
    <div>
      <div className="w-full h-[300px] bg-card rounded-lg relative flex items-center justify-center overflow-hidden">
        {renderContent()}
        
        {/* Material navigation controls for multiple materials */}
        {materials.length > 1 && (
          <>
            <button
              onClick={prevMaterial}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={nextMaterial}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
            
            {/* Material indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {materials.map((mat, index) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterialIndex(index)}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs ${
                    index === selectedMaterialIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                  title={`${mat.materialType} content`}
                >
                  {getMaterialTypeIcon(mat.materialType)}
                  <span className="hidden sm:inline">{mat.materialType}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Material info below the viewer */}
      {materials.length > 1 && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Material {selectedMaterialIndex + 1} of {materials.length}: {materialType}
        </div>
      )}
    </div>
  )
}

export default MediaViewer
