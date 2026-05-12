// Generate PWA placeholder icons as minimal valid PNGs
// Run: node scripts/generate-icons.js
import { createWriteStream } from 'fs'
import { deflateSync } from 'zlib'

function crc32(buf) {
  let c
  const table = []
  for (let n = 0; n < 256; n++) {
    c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeB = Buffer.from(type, 'ascii')
  const crcIn = Buffer.concat([typeB, data])
  const crcB = Buffer.alloc(4)
  crcB.writeUInt32BE(crc32(crcIn))
  return Buffer.concat([len, typeB, data, crcB])
}

function generatePNG(size, outputPath) {
  // Build raw image data with comic-style "TH" text
  const rawData = []
  for (let y = 0; y < size; y++) {
    rawData.push(0) // filter byte
    for (let x = 0; x < size; x++) {
      const cx = x / size, cy = y / size
      // Yellow background
      let r = 0xfd, g = 0xd8, b = 0x35
      // Black border
      const border = 4 / size
      if (cx < border || cx > 1 - border || cy < border || cy > 1 - border) {
        r = 0x1a; g = 0x1a; b = 0x1a
      }
      // Simple "TH" letter shapes
      const lx = (cx - 0.15) / 0.7, ly = (cy - 0.18) / 0.64
      if (lx > 0 && lx < 1 && ly > 0 && ly < 1) {
        // T: horizontal bar + vertical stem
        const inT = (ly < 0.22 && lx < 0.54) || (lx > 0.1 && lx < 0.35)
        // H: two vertical bars + horizontal middle
        const inH = (lx > 0.48 && lx < 0.90) && ((lx < 0.56) || (lx > 0.80) || (ly > 0.35 && ly < 0.52))
        if (inT || inH) { r = 0xe5; g = 0x39; b = 0x35 }
      }
      rawData.push(r, g, b, 255) // RGBA
    }
  }
  const raw = Buffer.from(rawData)

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)  // width
  ihdrData.writeUInt32BE(size, 4)  // height
  ihdrData[8] = 8   // bit depth
  ihdrData[9] = 6   // color type (RGBA)
  ihdrData[10] = 0  // compression
  ihdrData[11] = 0  // filter
  ihdrData[12] = 0  // interlace

  const idatData = deflateSync(raw)
  const iendData = Buffer.alloc(0)

  const buf = Buffer.concat([
    signature,
    chunk('IHDR', ihdrData),
    chunk('IDAT', idatData),
    chunk('IEND', iendData),
  ])

  const ws = createWriteStream(outputPath)
  ws.write(buf)
  ws.end()
  console.log(`Generated ${outputPath} (${size}x${size})`)
}

generatePNG(192, 'public/pwa-192x192.png')
generatePNG(512, 'public/pwa-512x512.png')
