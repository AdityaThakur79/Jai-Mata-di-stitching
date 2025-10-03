import React, { useMemo, useState } from 'react'
import { useGetCataloguesQuery } from '@/features/api/catalogueApi'
import { BlurFade } from '@/components/magicui/blur-fade'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Loader2, Eye, Download, X } from 'lucide-react'

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border rounded-lg shadow-sm ${className}`}>{children}</div>
)

const toPreviewUrl = (url) => {
  if (!url) return ''
  const m1 = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (m1 && m1[1]) return `https://drive.google.com/file/d/${m1[1]}/preview`
  const m2 = url.match(/[?&]id=([^&]+)/)
  if (m2 && m2[1]) return `https://drive.google.com/file/d/${m2[1]}/preview`
  return `https://drive.google.com/viewerng/viewer?embedded=1&url=${encodeURIComponent(url)}`
}

const CatalogueCard = ({ item, onView }) => {
  return (
    <Card className="p-4 flex flex-col group overflow-hidden">
      {item.featuredImageUrl && (
        <div className="mb-3 relative">
          <img src={item.featuredImageUrl} alt={item.name} className="w-full h-48 object-cover rounded" />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => onView(item)}>
              <Eye className="w-4 h-4 mr-2"/> View
            </Button>
            <a href={item.driveUrl} target="_blank" rel="noreferrer" className="inline-block">
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4 mr-2"/> Download
              </Button>
            </a>
          </div>
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          <span className="text-xs capitalize bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{item.category}</span>
        </div>
        <p className="text-xs text-gray-500 mb-3 truncate">{item.type}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:hidden">
        <Button variant="outline" size="sm" onClick={() => onView(item)}>
          <Eye className="w-4 h-4 mr-2"/> View
        </Button>
        <a href={item.driveUrl} target="_blank" rel="noreferrer" className="inline-block">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2"/> Download
          </Button>
        </a>
      </div>
    </Card>
  )
}

const CatalogueViewerModal = ({ item, onClose }) => {
  if (!item) return null
  const src = toPreviewUrl(item?.driveUrl)
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{item.name}</h4>
            <p className="text-xs text-gray-500 capitalize">{item.category} · {item.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={item.driveUrl} target="_blank" rel="noreferrer" className="inline-block">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white" size="sm">
                <Download className="w-4 h-4 mr-2"/> Download
              </Button>
            </a>
            <Button variant="outline" size="sm" onClick={onClose}><X className="w-4 h-4"/></Button>
          </div>
        </div>
        <div className="flex-1">
          <iframe title="Catalogue PDF" src={src} className="w-full h-full" style={{ border: 0 }} />
        </div>
      </div>
    </div>
  )
}

const Catalogues = () => {
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  // Fetch many (show all). If backend supports pagination, set a high limit
  const { data, isLoading } = useGetCataloguesQuery({ page: 1, limit: 500 })
  const items = useMemo(() => data?.catalogues || [], [data])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((it) => {
      const matchCategory = category === 'all' ? true : (it.category === category)
      const matchText = !q ? true : (
        (it.name || '').toLowerCase().includes(q) ||
        (it.type || '').toLowerCase().includes(q)
      )
      return matchCategory && matchText
    })
  }, [items, search, category])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Page Header (hero) */}
      <div className="relative h-[40vh] md:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/gallery-banner.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        <nav className="absolute top-16 sm:top-12 md:top-16 left-1/2 -translate-x-1/2 z-20" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm md:text-base">
            <li>
              <a href="/" className="text-white/80 hover:text-amber-300 transition-colors">Home</a>
            </li>
            <li className="text-white/60">/</li>
            <li className="text-amber-200 font-semibold">Catalogues</li>
          </ol>
        </nav>
        <div className="relative z-10 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center text-center">
          <BlurFade>
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-2 sm:mb-3 md:mb-4 font-serif leading-tight drop-shadow-lg">
              Explore Our Catalogues
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
              Discover curated lookbooks and style edits crafted for you.
            </p>
          </BlurFade>
        </div>
      </div>

      {/* Content */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-3 md:px-6">
          {/* Header + Filters */}
          <div className="max-w-4xl mx-auto text-center mb-6 md:mb-10">
            <BlurFade direction="up" offset={24}>
              <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 font-serif">CURATED COLLECTIONS</h2>
              <h3 className="text-2xl md:text-4xl font-light text-gray-800 mb-4 font-serif leading-tight">All Catalogues</h3>
            </BlurFade>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input placeholder="Search by name or type..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="text-center text-gray-500 py-12"><Loader2 className="w-6 h-6 animate-spin inline mr-2"/> Loading catalogues...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filtered.map((item, idx) => (
                <BlurFade key={item._id} delay={0.2 + idx * 0.05}>
                  <CatalogueCard item={item} onView={setSelected} />
                </BlurFade>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-10">No catalogues found</div>
              )}
            </div>
          )}

          <CatalogueViewerModal item={selected} onClose={() => setSelected(null)} />
        </div>
      </section>
    </div>
  )
}

export default Catalogues
