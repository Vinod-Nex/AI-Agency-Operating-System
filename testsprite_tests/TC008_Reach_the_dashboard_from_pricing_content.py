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
        
        # -> Scroll to the Pricing section and click the 'Launch Agency Workspace' button on the landing page.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the Pricing section and click the 'Launch Agency Workspace' button on the landing page.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Return to the landing page by clicking the 'AgencyOS' logo so the Pricing section can be located and reviewed.
        # AgencyOS PRO AI Operating System link
        elem = page.get_by_role('link', name='AgencyOS PRO AI Operating System', exact=True)
        await elem.click(timeout=10000)
        
        # -> Scroll to the Pricing section on the landing page so pricing can be reviewed.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the Pricing section on the landing page so pricing can be reviewed.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'AgencyOS' logo to return to the landing page so the Pricing section can be scrolled into view and reviewed.
        # AgencyOS PRO AI Operating System link
        elem = page.get_by_role('link', name='AgencyOS PRO AI Operating System', exact=True)
        await elem.click(timeout=10000)
        
        # -> Scroll to the 'Pricing' section on the landing page so the pricing can be reviewed, then click the 'Launch Agency Workspace' button.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the 'Pricing' section on the landing page so the pricing can be reviewed, then click the 'Launch Agency Workspace' button.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'AgencyOS' logo to return to the landing page so the Pricing section can be scrolled into view.
        # AgencyOS PRO AI Operating System link
        elem = page.get_by_role('link', name='AgencyOS PRO AI Operating System', exact=True)
        await elem.click(timeout=10000)
        
        # -> Scroll to the 'Pricing' section on the landing page so pricing can be reviewed.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the top of the landing page so the 'Launch Agency Workspace' button in the hero is visible.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the Pricing section and click the 'Launch Agency Workspace' button on the landing page.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the Pricing section and click the 'Launch Agency Workspace' button on the landing page.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'AgencyOS' logo to return to the landing page so the Pricing section can be reviewed.
        # AgencyOS PRO AI Operating System link
        elem = page.get_by_role('link', name='AgencyOS PRO AI Operating System', exact=True)
        await elem.click(timeout=10000)
        
        # -> Scroll to the 'Pricing' section on the landing page so pricing can be reviewed.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the 'Pricing' section on the landing page so pricing can be reviewed.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Navigate to the landing page (Home) so the Pricing section can be scrolled into view and reviewed.
        await page.goto("http://localhost:3000/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Scroll to the 'Pricing' section on the landing page so the pricing cards are visible, then click the 'Launch Agency Workspace' button.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll to the 'Pricing' section on the landing page so the pricing cards are visible, then click the 'Launch Agency Workspace' button.
        # Launch Agency Workspace link
        elem = page.get_by_role('link', name='Launch Agency Workspace', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'AgencyOS' logo to return to the landing page so the Pricing section can be reviewed.
        # AgencyOS PRO AI Operating System link
        elem = page.get_by_role('link', name='AgencyOS PRO AI Operating System', exact=True)
        await elem.click(timeout=10000)
        
        # -> Scroll to the 'Pricing' section on the landing page so the pricing cards are visible.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Start Free 14-Day Trial' button in the Professional pricing card to launch the workspace.
        # Start Free 14-Day Trial link
        elem = page.get_by_role('link', name='Start Free 14-Day Trial', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the dashboard is displayed
        # Assert: The URL contains 'dashboard', confirming we navigated to the Dashboard page.
        await expect(page).to_have_url(re.compile("dashboard"), timeout=15000), "The URL contains 'dashboard', confirming we navigated to the Dashboard page."
        # Assert: The Dashboard welcome header with the user and studio name is visible.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[1]").nth(0)).to_have_text("Welcome back, Vinod\nAgency Owner\nApex Digital Studio \u2022 80.4%", timeout=15000), "The Dashboard welcome header with the user and studio name is visible."
        
        # --> Verify executive KPI content is visible
        # Assert: Monthly Recurring Revenue KPI is visible on the dashboard.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[2]/div[1]").nth(0)).to_have_text("Monthly Recurring Revenue\n$48,250\n+18.4% from last month", timeout=15000), "Monthly Recurring Revenue KPI is visible on the dashboard."
        # Assert: Active Client Accounts KPI is visible on the dashboard.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[2]/div[2]").nth(0)).to_have_text("Active Client Accounts\n14 Accounts\n3 onboarding this week", timeout=15000), "Active Client Accounts KPI is visible on the dashboard."
        # Assert: Proposals Delivered KPI is visible on the dashboard.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[2]/div[3]").nth(0)).to_have_text("Proposals Delivered\n28 Generated\n85% Win Rate", timeout=15000), "Proposals Delivered KPI is visible on the dashboard."
        # Assert: Hours Saved by AI KPI is visible on the dashboard.
        await expect(page.locator("xpath=/html/body/div[3]/div/main/div/div[2]/div[4]").nth(0)).to_have_text("Hours Saved by AI\n142 Hours\n~$11,300 labor value", timeout=15000), "Hours Saved by AI KPI is visible on the dashboard."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    