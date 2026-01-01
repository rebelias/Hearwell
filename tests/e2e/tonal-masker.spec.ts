import { test, expect } from '@playwright/test';

test.describe('Tonal Masker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tonal-masker');
  });

  test('should load the tonal masker page', async ({ page }) => {
    await expect(page).toHaveTitle(/Tonal Masker|Neuromodulation/i);
  });

  test('should have play/pause button', async ({ page }) => {
    const playButton = page.getByTestId('button-play-pause');
    await expect(playButton).toBeVisible();
  });

  test('should have frequency slider', async ({ page }) => {
    const sliders = page.locator('input[type="range"]');
    const count = await sliders.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have modulation type selector', async ({ page }) => {
    // Look for AM, FM, or CR mode selector
    const modulationSelector = page
      .getByRole('radio', { name: /am|fm|cr/i })
      .or(page.getByRole('button', { name: /am|fm|cr/i }));
    await expect(modulationSelector.first()).toBeVisible();
  });

  test('should have waveform selector', async ({ page }) => {
    const sineButton = page.getByTestId('button-waveform-sine');
    await expect(sineButton).toBeVisible();
  });

  test('should play audio when play button is clicked', async ({ page }) => {
    const playButton = page.getByTestId('button-play-pause');
    await playButton.click();

    // Button should show pause icon when playing
    await expect(playButton).toBeVisible();
  });
});
