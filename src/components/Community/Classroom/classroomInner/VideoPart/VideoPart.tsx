import React from 'react'
import { FaPlay } from 'react-icons/fa6'

interface Material {
  id: number
  materialType: string
  fileUrl: string
  createdAt: string
  updatedAt: string
  lessonId: number
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

const VideoPart = ({ selectedLesson }: { selectedLesson: Lesson | null }) => {
  const videoUrl = selectedLesson?.materials?.find((m) => m.materialType === 'VIDEO')?.fileUrl

  let content = (
    <>
      <FaPlay
        className="cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        fontSize={40}
      />
      <span className="absolute text-background bottom-2 right-2 bg-foreground rounded-md px-2 py-1 text-sm">
        1:30
      </span>
    </>
  )

  if (videoUrl) {
    if (isDirectVideoFile(videoUrl)) {
      content = (
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full rounded-lg object-contain"
        >
          Sorry, your browser doesn&apos;t support embedded videos.
        </video>
      )
    } else {
      const embedUrl = getEmbedUrl(videoUrl) || ''
      content = (
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

  return (
    <div>
      <div className="w-full h-[300px] bg-card rounded-lg relative flex items-center justify-center">
        {content}
      </div>
    </div>
  )
}

export default VideoPart
