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
        
        # -> Navigate to the Dashboard page by opening /dashboard (page title or dashboard content should appear).
        await page.goto("http://localhost:3000/dashboard")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # --> Assertions to verify final state
        
        # --> Verify executive KPI metrics are displayed
        await page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[1]").nth(0).scroll_into_view_if_needed()
        # Assert: Monthly Recurring Revenue KPI card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[1]").nth(0)).to_be_visible(timeout=15000), "Monthly Recurring Revenue KPI card is visible."
        await page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]").nth(0).scroll_into_view_if_needed()
        # Assert: Active Client Accounts KPI card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]").nth(0)).to_be_visible(timeout=15000), "Active Client Accounts KPI card is visible."
        await page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[3]").nth(0).scroll_into_view_if_needed()
        # Assert: Proposals Delivered KPI card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[3]").nth(0)).to_be_visible(timeout=15000), "Proposals Delivered KPI card is visible."
        await page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[4]").nth(0).scroll_into_view_if_needed()
        # Assert: Hours Saved by AI KPI card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[4]").nth(0)).to_be_visible(timeout=15000), "Hours Saved by AI KPI card is visible."
        
        # --> Verify active performance summary data is displayed
        # Assert: Active Agency Projects section is visible on the dashboard.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[4]/div[1]/div").nth(0)).to_contain_text("Active Agency Projects", timeout=15000), "Active Agency Projects section is visible on the dashboard."
        # Assert: AI System Activity Log panel is visible on the dashboard.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[4]/div[2]/div").nth(0)).to_contain_text("AI System Activity Log", timeout=15000), "AI System Activity Log panel is visible on the dashboard."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    