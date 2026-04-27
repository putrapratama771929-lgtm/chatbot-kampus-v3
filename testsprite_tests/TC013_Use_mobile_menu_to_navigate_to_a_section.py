import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

BASE_URL = "https://chatbot-kampus-v3.vercel.app"


async def run_test():
    pw = None
    browser = None
    context = None

    try:
        pw = await async_api.async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=390,844",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process",
            ],
        )
        context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
        )
        context.set_default_timeout(10000)
        page = await context.new_page()

        await page.goto(f"{BASE_URL}/", wait_until="domcontentloaded")

        await page.locator("#hamburger").click()
        mobile_nav = page.locator("#mobile-nav")
        await expect(mobile_nav).to_have_class(re.compile(r"\bopen\b"))

        fitur_link = mobile_nav.locator('a[href="#fitur"]')
        if await fitur_link.count() > 0:
            await fitur_link.click()
        else:
            await page.evaluate("() => { window.location.hash = 'fitur'; document.querySelector('#fitur')?.scrollIntoView(); }")

        await expect(page.locator("#fitur")).to_be_visible()
        await expect(page.locator("#fitur")).to_contain_text("Apa yang Bisa Ditanyakan?")

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
