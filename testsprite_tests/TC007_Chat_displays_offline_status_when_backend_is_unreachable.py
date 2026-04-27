import asyncio
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
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process",
            ],
        )
        context = await browser.new_context()
        context.set_default_timeout(10000)
        page = await context.new_page()

        async def fail_session(route):
            await route.abort()

        await page.route("**/api/chat/session", fail_session)
        await page.goto(f"{BASE_URL}/chat.html", wait_until="domcontentloaded")

        status = page.locator(".chat-header-status")
        await expect(status).to_contain_text("Offline Mode", timeout=10000)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
