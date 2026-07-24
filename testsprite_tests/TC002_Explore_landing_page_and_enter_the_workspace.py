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
        
        # -> Scroll the landing page to reveal section content and the Pricing area.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the landing page to reveal section content and the Pricing area.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the landing page to reveal section content and the Pricing area.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the homepage and scroll to reveal the Pricing section on the landing page.
        await page.goto("http://localhost:3000/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Scroll the landing page to reveal the Pricing section and confirm Pricing content is visible.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the landing page to reveal the Pricing section and confirm Pricing content is visible.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the landing page to reveal the Pricing section and confirm Pricing content is visible.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Navigate to the homepage and prepare to scroll the page to reveal the Pricing section.
        await page.goto("http://localhost:3000/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Scroll the landing page to reveal the Pricing section and locate the visible 'Pricing' text on the page.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the page to reveal the 'Pricing' section content so that its details are visible.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the page to reveal the 'Pricing' section content so that its details are visible.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the homepage (http://localhost:3000/) so the landing page can be scrolled to reveal the Pricing section.
        await page.goto("http://localhost:3000/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Scroll the landing page to reveal the 'Pricing' section content so pricing plans and headings become visible.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the top of the landing page so the hero and the 'Launch Agency Workspace' primary call to action become visible.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Launch Agency Workspace' button to open the workspace/dashboard.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the dashboard is displayed
        # Assert: The URL contains '/dashboard', confirming navigation to the dashboard.
        await expect(page).to_have_url(re.compile("/dashboard"), timeout=15000), "The URL contains '/dashboard', confirming navigation to the dashboard."
        # Assert: The sidebar 'Dashboard' link is visible, confirming the dashboard view is active.
        await expect(page.locator("xpath=/html/body/div[3]/aside/nav/a[1]").nth(0)).to_have_text("Dashboard", timeout=15000), "The sidebar 'Dashboard' link is visible, confirming the dashboard view is active."
        # Assert: The dashboard welcome header containing 'Welcome back, Vinod' is visible.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[1]").nth(0)).to_contain_text("Welcome back, Vinod", timeout=15000), "The dashboard welcome header containing 'Welcome back, Vinod' is visible."
        
        # --> Verify executive KPI content is visible
        # Assert: Monthly Recurring Revenue value $48,250 is visible.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[2]/div[1]").nth(0)).to_contain_text("$48,250", timeout=15000), "Monthly Recurring Revenue value $48,250 is visible."
        # Assert: Active Client Accounts shows 14 Accounts.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[2]/div[2]").nth(0)).to_contain_text("14 Accounts", timeout=15000), "Active Client Accounts shows 14 Accounts."
        # Assert: Proposals Delivered displays 28 Generated.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[2]/div[3]").nth(0)).to_contain_text("28 Generated", timeout=15000), "Proposals Delivered displays 28 Generated."
        # Assert: Hours Saved by AI shows 142 Hours.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[2]/div[4]").nth(0)).to_contain_text("142 Hours", timeout=15000), "Hours Saved by AI shows 142 Hours."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    