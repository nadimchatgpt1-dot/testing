import React, { useRef, useState } from 'react'
import html2canvas from 'html2canvas'

export default function App() {
  const [name, setName] = useState('Your Name')
  const [number, setNumber] = useState('1234 5678 9012 3456')
  const [expiry, setExpiry] = useState('12/34')
  const [cvv, setCvv] = useState('123')
  const [theme, setTheme] = useState('Vibrant')
  const cardRef = useRef(null)

  const themes = {
    Vibrant: {
      card: 'text-white bg-gradient-to-br from-indigo-500 to-pink-500',
      accentOpacity: 'opacity-70',
      chipCvvBg: 'bg-white/20 text-white',
    },
    Midnight: {
      card: 'text-white bg-gradient-to-br from-slate-800 to-slate-600',
      accentOpacity: 'opacity-60',
      chipCvvBg: 'bg-white/20 text-white',
    },
    Glass: {
      card: 'text-slate-900 bg-white/30 backdrop-blur-sm',
      accentOpacity: 'opacity-40',
      chipCvvBg: 'bg-white/40 text-slate-900',
    },
  }

  const formatNumber = (val) => {
    return val.replace(/[^0-9]/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim()
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { scale: 2 })
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    const safeName = (name || 'virtual-card').replace(/\s+/g, '-').toLowerCase()
    link.download = `virtual-card-${safeName}.png`
    link.href = dataUrl
    link.click()
  }

  const t = themes[theme]

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-1">Virtual Card Creator</h2>
          <p className="text-sm text-slate-500 mb-6">Fill the form to design your virtual card. Preview updates live.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cardholder Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Your Name"
                maxLength={26}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                value={number}
                onChange={(e) => setNumber(formatNumber(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Expiry</label>
                <input
                  value={expiry}
                  onChange={(e) => {
                    let v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2)
                    setExpiry(v)
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0,4))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Template</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {Object.keys(themes).map((th) => (
                    <option key={th} value={th}>{th}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setName('John Doe')
                  setNumber('4444 3333 2222 1111')
                  setExpiry('12/34')
                  setCvv('123')
                  setTheme('Midnight')
                }}
                className="px-4 py-2 rounded-lg border bg-slate-50 hover:bg-slate-100"
              >
                Sample
              </button>

              <button
                onClick={handleDownload}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              >
                {/* download icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export PNG
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Preview</h3>
            <span className="text-sm text-slate-500">Live preview — responsive & printable</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div
              ref={cardRef}
              className={"w-[360px] h-[220px] rounded-2xl p-6 relative overflow-hidden transform-gpu shadow-2xl " + t.card}
            >
              {/* top row: accent + CVV + label */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={"w-8 h-8 rounded-full bg-white/20 " + t.accentOpacity}></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={"px-2 py-1 rounded-md text-xs font-medium " + t.chipCvvBg}>CVV: {cvv || '---'}</div>
                  <div className="text-sm opacity-90">VIRTUAL</div>
                </div>
              </div>

              {/* number */}
              <div className="mt-8">
                <div className="text-xl tracking-widest font-mono">{number || '#### #### #### ####'}</div>
              </div>

              {/* bottom row */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase opacity-80">Cardholder</div>
                  <div className="font-semibold">{name || 'Your Name'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase opacity-80">Valid Thru</div>
                  <div className="font-semibold">{expiry || 'MM/YY'}</div>
                </div>
              </div>
            </div>

            <div className="w-[360px] bg-white rounded-xl p-4 shadow">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-slate-500">Card Details</div>
                  <div className="font-mono mt-1">{number}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">CVV</div>
                  <div className="font-semibold">{cvv}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-sm text-slate-600">
                <div className="col-span-2">Template: {theme}</div>
                <div className="text-right">Preview: Digital</div>
              </div>
            </div>

            <div className="text-xs text-slate-500">Design/demo only — never use real card data.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
