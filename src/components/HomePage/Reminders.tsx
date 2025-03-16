import { IoIosNotificationsOutline } from 'react-icons/io'

const Reminders = () => {
  return (
    <div className="space-y-2 border rounded-md p-2">
      <h2 className="text-center h4 my-5">Reminders</h2>

      <div className="px-5 divide-y">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <IoIosNotificationsOutline className="w-6 h-6" />
              <div>
                <p>AI Geeks - New lecture</p>
                <small className="text-gray-500 font-bold">20 September 2021</small>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Reminders
