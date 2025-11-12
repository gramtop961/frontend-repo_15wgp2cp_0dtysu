import { useEffect, useMemo, useState } from 'react'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [view, setView] = useState('grid')
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchPlaces = async () => {
    setLoading(true)
    setError('')
    try {
      const url = new URL(`${backend}/places`)
      const res = await fetch(url.toString())
      if (!res.ok) throw new Error(`Failed to load places (${res.status})`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const seedData = async () => {
    try {
      const res = await fetch(`${backend}/seed`, { method: 'POST' })
      if (!res.ok) throw new Error('Seeding failed')
      await fetchPlaces()
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    fetchPlaces()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [items])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return items.filter(i => {
      const matchQ = !term || [i.name, i.city, i.region, i.description, (i.tags||[]).join(' ')].some(v => (v||'').toLowerCase().includes(term))
      const matchCat = !category || category === 'All' || i.category === category
      return matchQ && matchCat
    })
  }, [items, q, category])

  const PlaceCard = ({ place }) => (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="relative h-48 overflow-hidden">
        <img
          src={(place.images && place.images[0]) || 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff'}
          alt={place.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/90 text-gray-800 font-medium">
          {place.category}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
            <p className="text-sm text-gray-600">{place.city}{place.region ? ` • ${place.region}` : ''}</p>
          </div>
          {place.era && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{place.era}</span>}
        </div>
        {place.description && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">{place.description}</p>
        )}
        {place.tags && place.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {place.tags.slice(0,4).map(t => (
              <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700">#{t}</span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + (place.city||''))}`} target="_blank" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View on Maps →</a>
          {place.opening_hours && <span className="text-xs text-gray-500">{place.opening_hours}</span>}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white grid place-items-center font-bold">KT</div>
            <div>
              <p className="text-lg font-semibold text-gray-800 leading-none">Karnataka Trails</p>
              <p className="text-xs text-gray-500 leading-none">Heritage & Monuments</p>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-3">
            <a href="#explore" className="text-sm text-gray-600 hover:text-blue-700">Explore</a>
            <a href="#map" className="text-sm text-gray-600 hover:text-blue-700">Map</a>
            <a href="#plan" className="text-sm text-gray-600 hover:text-blue-700">Plan Trip</a>
          </div>
          <button onClick={seedData} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg">Seed demo data</button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf" className="w-full h-full object-cover" alt="Mysore Palace" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white/0" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Discover Karnataka's Timeless Heritage</h1>
            <p className="mt-3 text-white/90 text-lg">From the stone carvings of Hoysala to the royal grandeur of Mysuru – plan immersive journeys through history.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white/90 backdrop-blur rounded-xl p-2">
              <div className="sm:col-span-7">
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search places, cities, eras…" className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-3">
                <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full h-11 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.map(c => (<option key={c} value={c === 'All' ? '' : c}>{c}</option>))}
                </select>
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <button onClick={fetchPlaces} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">Search</button>
                <button onClick={()=>{setQ('');setCategory('')}} className="px-3 h-11 border border-gray-200 rounded-lg text-sm">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section id="explore" className="relative -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Explore Highlights</h2>
              <div className="flex items-center gap-2">
                <button onClick={()=>setView('grid')} className={`px-3 py-1.5 text-sm rounded-md border ${view==='grid'?'bg-gray-900 text-white border-gray-900':'border-gray-200 text-gray-700'}`}>Grid</button>
                <button onClick={()=>setView('list')} className={`px-3 py-1.5 text-sm rounded-md border ${view==='list'?'bg-gray-900 text-white border-gray-900':'border-gray-200 text-gray-700'}`}>List</button>
              </div>
            </div>

            {loading && (
              <div className="py-16 text-center text-gray-600">Loading places…</div>
            )}
            {error && (
              <div className="py-4 px-4 my-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{error}. Ensure the backend is running and VITE_BACKEND_URL is set.</div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="py-16 text-center text-gray-600">No places found. Try seeding demo data.</div>
            )}

            {!loading && !error && filtered.length > 0 && (
              view === 'grid' ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(p => <PlaceCard key={p._id || p.name} place={p} />)}
                </div>
              ) : (
                <div className="mt-4 divide-y">
                  {filtered.map(p => (
                    <div key={p._id || p.name} className="py-4 flex gap-4 items-start">
                      <img src={(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff'} alt={p.name} className="w-28 h-20 object-cover rounded-lg border" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{p.name}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{p.category}</span>
                        </div>
                        <p className="text-sm text-gray-600">{p.city}{p.region ? ` • ${p.region}` : ''}</p>
                        {p.description && <p className="mt-1 text-sm text-gray-700 line-clamp-2">{p.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section id="map" className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Interactive Map</h2>
              <span className="text-xs text-gray-500">Static preview</span>
            </div>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-8">
                <div className="relative h-80 rounded-xl overflow-hidden border border-blue-200">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff" alt="Karnataka landscape" />
                  <div className="absolute inset-0 bg-blue-600/10" />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md text-sm text-gray-700">Add a live map later (Mapbox/Leaflet)</div>
                </div>
              </div>
              <div className="lg:col-span-4">
                <ul className="space-y-3">
                  {filtered.slice(0,6).map(p => (
                    <li key={p._id || p.name} className="p-3 rounded-lg bg-white border border-blue-100 hover:border-blue-300 transition">
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-600">{p.city} • {p.category}</p>
                    </li>
                  ))}
                  {filtered.length === 0 && (
                    <li className="p-3 rounded-lg bg-white border text-sm text-gray-600">No points to show.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan section */}
      <section id="plan" className="mt-10 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold text-gray-900">Plan a weekend heritage trail</h3>
              <p className="mt-1 text-gray-600">Pick 3–5 sites, add timings and travel distances. Save your route to revisit later.</p>
            </div>
            <a href="#explore" className="px-5 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black">Start Exploring</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} Karnataka Trails. For demo purposes.</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <a href="/test" className="hover:text-blue-700">System Check</a>
            <a href="#" className="hover:text-blue-700">Privacy</a>
            <a href="#" className="hover:text-blue-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
