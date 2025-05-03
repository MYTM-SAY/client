import CalendarHolder from '../components/HomePage/CalendarHolder'

export default async function Page() {

  return (
    <div className="grid grid-cols-8 gap-5">

      <div className="col-span-6">
        <div className="space-y-5">Awaiting the feed generatation from the backend team</div>
      </div>

      <CalendarHolder />
    </div>
  )
}

