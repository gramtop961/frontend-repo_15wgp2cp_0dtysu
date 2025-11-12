import React from 'react'

function Header({ onSeed }) {
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-pink-500 via-fuchsia-600 to-indigo-600 text-white grid place-items-center font-black tracking-tight shadow-md">
            KT
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800 leading-none group-hover:text-gray-900">Karnataka Trails</p>
            <p className="text-xs text-gray-500 leading-none">Heritage • Culture • Monuments</p>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-4">
          <a href="#explore" className="text-sm text-gray-600 hover:text-fuchsia-700">Explore</a>
          <a href="#map" className="text-sm text-gray-600 hover:text-fuchsia-700">Map</a>
          <a href="#plan" className="text-sm text-gray-600 hover:text-fuchsia-700">Plan Trip</a>
          <a href="#vision" className="text-sm text-gray-600 hover:text-fuchsia-700">Vision</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="/test" className="hidden sm:inline-block text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">System Check</a>
          <button onClick={onSeed} className="text-sm bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm">Seed demo data</button>
        </div>
      </div>
    </header>
  )
}

export default Header
