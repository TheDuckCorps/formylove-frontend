import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, 'public')

const variants = [
  { file: 'og-image-1x1.html',  out: 'og-image-1x1.png',  width: 1080, height: 1080 },
  { file: 'og-image-4x5.html',  out: 'og-image-4x5.png',  width: 1080, height: 1350 },
  { file: 'og-image-9x16.html', out: 'og-image-9x16.png', width: 1080, height: 1920 },
]

const browser = await chromium.launch()

for (const { file, out, width, height } of variants) {
  const page = await browser.newPage()
  await page.setViewportSize({ width, height })
  await page.goto(`file://${join(publicDir, file)}`)
  await page.waitForTimeout(300)
  await page.screenshot({
    path: join(publicDir, out),
    clip: { x: 0, y: 0, width, height },
  })
  await page.close()
  console.log(`✓ ${out} (${width}x${height})`)
}

await browser.close()
console.log('\nImagens geradas em public/')
