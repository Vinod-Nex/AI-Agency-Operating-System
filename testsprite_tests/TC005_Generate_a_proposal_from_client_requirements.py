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
        
        # -> Open the 'Proposals' page (the Proposals section of the app).
        await page.goto("http://localhost:3000/proposals")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Generate Proposal' button to generate (or regenerate) the proposal preview.
        # Generate Proposal button
        elem = page.get_by_role('button', name='Generate Proposal', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify a generated proposal preview is displayed
        await page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]/div").nth(0).scroll_into_view_if_needed()
        # Assert: The Live Document Preview panel is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]/div").nth(0)).to_be_visible(timeout=15000), "The Live Document Preview panel is visible."
        # Assert: The generated proposal header shows '# ENTERPRISE PROJECT PROPOSAL: ACME GLOBAL SYSTEMS'.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]/div/div[2]").nth(0)).to_contain_text("# ENTERPRISE PROJECT PROPOSAL: ACME GLOBAL SYSTEMS", timeout=15000), "The generated proposal header shows '# ENTERPRISE PROJECT PROPOSAL: ACME GLOBAL SYSTEMS'."
        
        # --> Verify the proposal preview includes the entered requirements
        # Assert: Proposal preview contains the header '# ENTERPRISE PROJECT PROPOSAL: ACME GLOBAL SYSTEMS'.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]/div/div[2]").nth(0)).to_contain_text("# ENTERPRISE PROJECT PROPOSAL: ACME GLOBAL SYSTEMS", timeout=15000), "Proposal preview contains the header '# ENTERPRISE PROJECT PROPOSAL: ACME GLOBAL SYSTEMS'."
        # Assert: Proposal preview shows the estimated budget '**Estimated Budget**: $45,000'.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]/div/div[2]").nth(0)).to_contain_text("**Estimated Budget**: $45,000", timeout=15000), "Proposal preview shows the estimated budget '**Estimated Budget**: $45,000'."
        # Assert: Proposal preview shows the timeline '**Timeline**: 8 Weeks'.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]/div/div[2]").nth(0)).to_contain_text("**Timeline**: 8 Weeks", timeout=15000), "Proposal preview shows the timeline '**Timeline**: 8 Weeks'."
        # Assert: Proposal preview includes the full project scope sentence as entered.
        await expect(page.locator("xpath=/html/body/div[2]/div/main/div/div[2]/div[2]/div/div[2]").nth(0)).to_contain_text("Client requires an enterprise web application portal for multi-tenant analytics, AI automated reporting, SOC2 security compliance, and billing integration.", timeout=15000), "Proposal preview includes the full project scope sentence as entered."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    