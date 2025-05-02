interface Props {
  title: string
  content: string
}

export default function PostContent({ title, content }: Props) {
  return (
    <>
      <h2 className="h4 mt-3">{title}</h2>
      <p className={`mt-2 p-lg-muted text-foreground relative`}>
        {content.substring(0, 100)} {content.length > 100 && '...'}
      </p>
    </>
  )
}
