import asyncio
import re
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
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Verify the landing page headline 'The Complete AI Operating System for Modern Agencies' is visible on the page.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify product value proposition content is displayed
        # Assert: The product tagline 'AI Operating System' is visible in the sidebar.
        await expect(page.locator("xpath=/html/body/div[2]/aside/div[1]/a").nth(0)).to_contain_text("AI Operating System", timeout=15000), "The product tagline 'AI Operating System' is visible in the sidebar."
        # Assert: The product feature 'Proposal Generator' is visible on the page.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[3]/div[2]/a[1]").nth(0)).to_contain_text("Proposal Generator", timeout=15000), "The product feature 'Proposal Generator' is visible on the page."
        
        # --> Verify pricing or testimonial content is displayed
        # Assert: The Monthly Recurring Revenue pricing information is visible on the page.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[1]").nth(0)).to_contain_text("Monthly Recurring Revenue", timeout=15000), "The Monthly Recurring Revenue pricing information is visible on the page."
        
        # --> Verify the dashboard is displayed
        # Assert: Verify the browser navigated to the dashboard URL.
        await expect(page).to_have_url(re.compile("dashboard"), timeout=15000), "Verify the browser navigated to the dashboard URL."
        # Assert: Verify the dashboard welcome header 'Welcome back, Vinod' is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[1]").nth(0)).to_contain_text("Welcome back, Vinod", timeout=15000), "Verify the dashboard welcome header 'Welcome back, Vinod' is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    