// PostContent.tsx
interface Props {
  title: string
  content: string
}

export default function PostContent({ title, content }: Props) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
        {title}
      </h2>
      <div className="relative">
        <p
          className={`text-gray-700 dark:text-gray-300 text-base break-words line-clamp-3`}
        >
          {content}
        </p>
        {content.length > 200 && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent dark:from-gray-900 pointer-events-none" />
        )}
      </div>
    </div>
  )
}
