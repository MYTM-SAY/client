export default function Loading() {
  return (
    <>
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-ping opacity-75"></div>
      </div>

      {/* Animated text with staggered letters */}
      <p className="mt-6 text-lg font-medium text-gray-700 flex justify-center space-x-1">
        {[
          'L',
          'o',
          'a',
          'd',
          'i',
          'n',
          'g',
          '',
          'C',
          'l',
          'a',
          's',
          's',
          'r',
          'o',
          'o',
          'm',
        ].map((char, i) => (
          <span
            key={i}
            className="animate-wave inline-block"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {char}
          </span>
        ))}
      </p>
    </>
  )
}
