import CalendarHolder from '../components/HomePage/CalendarHolder'
import Post from '../components/Post/Post'

export default async function Page() {
  const posts = Array.from({ length: 40 }, (_, i) => <Post key={i} />)

  return (
    <div className="grid grid-cols-8 gap-5">

      <div className="col-span-6">
        <div className="space-y-5">{posts}</div>
      </div>

      <CalendarHolder />
    </div>
  )
}

