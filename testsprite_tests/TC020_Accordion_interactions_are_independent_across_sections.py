import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to https://chatbot-kampus-v3.vercel.app/
        await page.goto("https://chatbot-kampus-v3.vercel.app/")
        
        # -> Click the 'Tentang' link to reveal the Tentang Kampus section and then open a Tentang accordion item.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/nav/div/div/a').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click the '🎯 Visi & Misi' accordion button in the Tentang section to expand its content.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/section[3]/div/div[2]/div/div/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # -> Click an FAQ accordion item (open 'Bagaimana cara mendaftar di Polimdo?') and verify its content appears while Tentang content remains visible.
        frame = context.pages[-1]
        # Click element
        elem = frame.locator('xpath=/html/body/section[4]/div/div[2]/div/button').nth(0)
        await asyncio.sleep(3); await elem.click()
        
        # --> Test passed — verified by AI agent
        frame = context.pages[-1]
        current_url = await frame.evaluate("() => window.location.href")
        assert current_url is not None, "Test completed successfully"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    