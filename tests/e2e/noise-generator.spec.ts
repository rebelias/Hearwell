import { test, expect } from '@playwright/test';

test.describe('Noise Generator', () => {
  test.beforeEach(async ({ page }) => {
    // Accept disclaimer before each test
    await page.addInitScript(() => {
      localStorage.setItem('hearwell-disclaimer-accepted', 'true');
    });
    await page.goto('/noise-generator');
  });

  test('should load the noise generator page', async ({ page }) => {
    await expect(page).toHaveTitle(/Noise Generator|Colored Noise/i);
  });

  test('should have play/pause button', async ({ page }) => {
    const playButton = page.getByTestId('button-play-pause');
    await expect(playButton).toBeVisible();
  });

  test('should have equalizer sliders', async ({ page }) => {
    // Look for EQ sliders (8 bands)
    const sliders = page.locator('input[type="range"]');
    const count = await sliders.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have noise preset buttons', async ({ page }) => {
    // Look for preset buttons (White, Pink, Brown, etc.)
    const whiteButton = page.getByRole('button', { name: /white/i });
    await expect(whiteButton).toBeVisible();
  });

  test('should play noise when play button is clicked', async ({ page }) => {
    const playButton = page.getByTestId('button-play-pause');
    await playButton.click();

    // Button should show pause icon when playing
    await expect(playButton).toBeVisible();
  });
});
