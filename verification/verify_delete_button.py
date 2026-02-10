from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 720})
    page = context.new_page()

    print("Navigating to Price Estimation page...")
    try:
        page.goto("http://localhost:8081/sales/price-estimation", timeout=30000)
    except Exception as e:
        print(f"Error navigating: {e}")
        browser.close()
        return

    print("Waiting for table...")
    try:
        page.wait_for_selector("table", timeout=15000)
    except Exception as e:
        print(f"Table not found: {e}")
        page.screenshot(path="verification/error_screenshot.png")
        browser.close()
        return

    # Wait a bit for data to populate if it's async
    page.wait_for_timeout(2000)

    print("Taking screenshot...")
    page.screenshot(path="verification/price_estimation_list.png")

    # Check for Delete buttons
    # The Trash2 icon usually renders as an svg with class "lucide-trash-2"
    delete_buttons = page.locator("button svg.lucide-trash-2")
    count = delete_buttons.count()
    print(f"Found {count} delete buttons")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
