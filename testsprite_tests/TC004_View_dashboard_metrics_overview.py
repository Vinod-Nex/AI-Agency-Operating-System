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
        
        # -> Open the Dashboard page by navigating to /dashboard so the KPI summary and agency performance metrics can be verified.
        await page.goto("http://localhost:3000/dashboard")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # --> Assertions to verify final state
        
        # --> Verify KPI summary content is visible
        # Assert: KPI card shows Monthly Recurring Revenue value $48,250.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[1]").nth(0)).to_contain_text("$48,250", timeout=15000), "KPI card shows Monthly Recurring Revenue value $48,250."
        # Assert: KPI card shows Active Client Accounts value 14 Accounts.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]").nth(0)).to_contain_text("14 Accounts", timeout=15000), "KPI card shows Active Client Accounts value 14 Accounts."
        # Assert: KPI card shows Proposals Delivered value 28 Generated.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[3]").nth(0)).to_contain_text("28 Generated", timeout=15000), "KPI card shows Proposals Delivered value 28 Generated."
        # Assert: KPI card shows Hours Saved by AI value 142 Hours.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[4]").nth(0)).to_contain_text("142 Hours", timeout=15000), "KPI card shows Hours Saved by AI value 142 Hours."
        
        # --> Verify overall agency performance metrics are visible
        # Assert: The Monthly Recurring Revenue KPI card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[1]").nth(0)).to_contain_text("Monthly Recurring Revenue", timeout=15000), "The Monthly Recurring Revenue KPI card is visible."
        # Assert: The Active Client Accounts KPI card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]").nth(0)).to_contain_text("Active Client Accounts", timeout=15000), "The Active Client Accounts KPI card is visible."
        # Assert: The Proposals Delivered KPI card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[3]").nth(0)).to_contain_text("Proposals Delivered", timeout=15000), "The Proposals Delivered KPI card is visible."
        # Assert: The Hours Saved by AI KPI card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[4]").nth(0)).to_contain_text("Hours Saved by AI", timeout=15000), "The Hours Saved by AI KPI card is visible."
        # Assert: The Active Agency Projects section is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[4]/div[1]/div").nth(0)).to_contain_text("Active Agency Projects", timeout=15000), "The Active Agency Projects section is visible."
        # Assert: The AI System Activity Log section is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[4]/div[2]/div").nth(0)).to_contain_text("AI System Activity Log", timeout=15000), "The AI System Activity Log section is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    