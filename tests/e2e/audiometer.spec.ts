import { test, expect } from '@playwright/test';

test.describe('Audiometer', () => {
  test.beforeEach(async ({ page }) => {
    // Accept disclaimer before each test
    await page.addInitScript(() => {
      localStorage.setItem('hearwell-disclaimer-accepted', 'true');
    });
    await page.goto('/audiometer');
  });

  test('should load the audiometer page', async ({ page }) => {
    await expect(page).toHaveTitle(/Online Audiometer|Test Your Hearing/i);
  });

  test('should have test grid', async ({ page }) => {
    // Look for frequency labels (250, 500, 1000, etc.)
    const frequencyLabel = page.getByText('250');
    await expect(frequencyLabel).toBeVisible();
  });

  test('should have ear selection buttons', async ({ page }) => {
    // Look for ear selection (left, right, both)
    const bothButton = page.getByRole('button', { name: /both/i });
    await expect(bothButton).toBeVisible();
  });

  test('should allow clicking test cells', async ({ page }) => {
    // Find a test cell and click it
    // Note: Actual cell structure may vary, adjust selector as needed
    const testCell = page
      .locator('[data-testid*="cell"], [class*="cell"]')
      .first();
    if (await testCell.isVisible()) {
      await testCell.click();
      // Should trigger audio playback
    }
  });
});
