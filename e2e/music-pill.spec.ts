import { test, expect, type Page } from '@playwright/test'

const SITE_URL = '/site/8ed6c16f-b086-44c8-94a9-815a5850f908'

// ── helpers ────────────────────────────────────────────────────────────────

const pill = (page: Page) => page.locator('[data-testid="music-pill"]')
const playBtn = (page: Page) => page.locator('[data-testid="music-play-btn"]')

async function goToSite(page: Page) {
  await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' })
}

/** Wait for the pill to mount and then for the intro label to collapse */
async function waitForCollapsed(page: Page) {
  // 1. pill must appear first
  await expect(pill(page)).toBeVisible({ timeout: 5_000 })
  // 2. intro label appears, then disappears after ~2.2s
  await expect(page.getByText('Música')).toBeVisible({ timeout: 3_000 })
  await expect(page.getByText('Música')).not.toBeVisible({ timeout: 4_000 })
  // 3. small buffer so the exit animation fully completes before we interact
  await page.waitForTimeout(200)
}

/**
 * Simulate a mobile tap on the pill.
 * Playwright's .tap() doesn't reach framer-motion's onTap (different event stack).
 * Dispatching a real PointerEvent with pointerType='touch' triggers the component's
 * onPointerUp handler, which only responds to touch — matching real device behaviour.
 */
async function tapPill(page: Page) {
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="music-pill"]')
    const inner = el?.firstElementChild
    if (!inner) throw new Error('music-pill inner div not found')
    inner.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, pointerType: 'touch' }))
  })
  await page.waitForTimeout(350) // spring animation
}

async function expandPill(page: Page) {
  await tapPill(page)
}

// ── tests ──────────────────────────────────────────────────────────────────

test.describe('MusicaFundoDisplay — mobile pill', () => {

  test('1. pill aparece no topo-esquerdo com label "Música"', async ({ page }) => {
    await goToSite(page)

    const widget = pill(page)
    await expect(widget).toBeVisible({ timeout: 5_000 })

    // label intro visível logo após o mount
    await expect(page.getByText('Música')).toBeVisible()

    const box = await widget.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBeLessThan(80)   // topo
    expect(box!.x).toBeLessThan(80)   // esquerda

    await page.screenshot({ path: 'e2e/screenshots/01-intro-label.png' })
  })

  test('2. label "Música" some após ~2.2s e pill vira só o ícone', async ({ page }) => {
    await goToSite(page)

    await expect(page.getByText('Música')).toBeVisible({ timeout: 3_000 })
    await waitForCollapsed(page)

    await expect(pill(page)).toBeVisible()
    const box = await pill(page).boundingBox()
    expect(box!.width).toBeLessThan(90) // sem label = só ícone + padding

    await page.screenshot({ path: 'e2e/screenshots/02-collapsed.png' })
  })

  test('3. click expande o pill mostrando botão de play', async ({ page }) => {
    await goToSite(page)
    await waitForCollapsed(page)
    await expandPill(page)

    const btn = playBtn(page)
    await expect(btn).toBeVisible({ timeout: 2_000 })
    await expect(btn).toHaveAttribute('aria-label', 'Retomar música')

    const box = await pill(page).boundingBox()
    expect(box!.width).toBeGreaterThan(100) // expandido = mais largo

    await page.screenshot({ path: 'e2e/screenshots/03-expanded.png' })
  })

  test('4. segundo click fecha o pill novamente', async ({ page }) => {
    await goToSite(page)
    await waitForCollapsed(page)

    await expandPill(page)
    await expect(playBtn(page)).toBeVisible({ timeout: 2_000 })

    // fecha com segundo tap (area do ícone, fora dos controles)
    await tapPill(page)
    await expect(playBtn(page)).not.toBeVisible({ timeout: 2_000 })

    await page.screenshot({ path: 'e2e/screenshots/04-closed.png' })
  })

  test('5. click no botão de play muda label para "Pausar música"', async ({ page }) => {
    await goToSite(page)
    await waitForCollapsed(page)
    await expandPill(page)

    const btn = playBtn(page)
    await expect(btn).toBeVisible({ timeout: 2_000 })
    await btn.click()
    await page.waitForTimeout(400)

    await expect(btn).toHaveAttribute('aria-label', 'Pausar música')
    await page.screenshot({ path: 'e2e/screenshots/05-playing.png' })
  })

  test('6. play → pause toggle', async ({ page }) => {
    await goToSite(page)
    await waitForCollapsed(page)
    await expandPill(page)

    const btn = playBtn(page)
    await expect(btn).toBeVisible({ timeout: 2_000 })

    await btn.click()
    await expect(btn).toHaveAttribute('aria-label', 'Pausar música', { timeout: 2_000 })

    await btn.click()
    await expect(btn).toHaveAttribute('aria-label', 'Retomar música', { timeout: 2_000 })

    await page.screenshot({ path: 'e2e/screenshots/06-toggled.png' })
  })

  test('7. drag → snapa no canto inferior-direito', async ({ page }) => {
    await goToSite(page)
    await waitForCollapsed(page)

    const widget = pill(page)
    const before = await widget.boundingBox()
    expect(before).not.toBeNull()

    const vw = page.viewportSize()!.width
    const vh = page.viewportSize()!.height

    await page.mouse.move(before!.x + before!.width / 2, before!.y + before!.height / 2)
    await page.mouse.down()
    await page.mouse.move(vw - 40, vh - 40, { steps: 20 })
    await page.mouse.up()
    await page.waitForTimeout(900) // spring snap

    const after = await widget.boundingBox()
    expect(after).not.toBeNull()
    expect(after!.x + after!.width / 2).toBeGreaterThan(vw / 2)  // direita
    expect(after!.y + after!.height / 2).toBeGreaterThan(vh / 2) // baixo

    await page.screenshot({ path: 'e2e/screenshots/07-snap-br.png' })
  })

  test('8. drag → snapa no canto superior-direito', async ({ page }) => {
    await goToSite(page)
    await waitForCollapsed(page)

    const widget = pill(page)
    const before = await widget.boundingBox()
    const vw = page.viewportSize()!.width

    await page.mouse.move(before!.x + before!.width / 2, before!.y + before!.height / 2)
    await page.mouse.down()
    await page.mouse.move(vw - 40, 40, { steps: 20 })
    await page.mouse.up()
    await page.waitForTimeout(900)

    const after = await widget.boundingBox()
    expect(after!.x + after!.width / 2).toBeGreaterThan(vw / 2) // direita
    expect(after!.y).toBeLessThan(100)                           // topo

    await page.screenshot({ path: 'e2e/screenshots/08-snap-tr.png' })
  })

  test('9. iframe do YouTube configurado corretamente', async ({ page }) => {
    await goToSite(page)

    const iframe = page.locator('iframe[title="Música de fundo"]')
    await expect(iframe).toBeAttached({ timeout: 5_000 })

    const src = await iframe.getAttribute('src')
    expect(src).toContain('enablejsapi=1')
    expect(src).toContain('autoplay=1')
    expect(src).toContain('loop=1')
    expect(src).toContain('playsinline=1')
    expect(src).not.toContain('mute=1') // mute=1 quebra o JS API
  })
})
