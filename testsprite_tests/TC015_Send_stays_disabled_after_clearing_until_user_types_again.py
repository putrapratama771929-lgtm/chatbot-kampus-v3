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

        await page.goto(f"{BASE_URL}/chat.html", wait_until="domcontentloaded")

        chat_input = page.locator("#chat-input")
        send_button = page.locator("#send-btn")
        clear_button = page.locator("#clear-btn")

        await expect(send_button).to_be_disabled()
        await chat_input.fill("Apa jam kerja kampus?")
        await expect(send_button).to_be_enabled()

        await clear_button.click()
        await expect(chat_input).to_have_value("")
        await expect(send_button).to_be_disabled()

        await chat_input.click()
        await expect(send_button).to_be_disabled()

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()


asyncio.run(run_test())
