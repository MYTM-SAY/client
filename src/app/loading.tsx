export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      {/* Circle Animation */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-60"></div>
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
      </div>

      {/* Animated Text */}
      <p className="text-xl font-semibold text-gray-700 flex space-x-1">
        {'Loading'.split('').map((char, i) => (
          <span
            key={i}
            className="wave-animation inline-block"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  )
}
