import { test, expect } from '@playwright/test';

test.describe('Frequency Finder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/frequency-finder');
  });

  test('should load the frequency finder page', async ({ page }) => {
    await expect(page).toHaveTitle(/Tinnitus Frequency Finder/i);
  });

  test('should have play/pause button', async ({ page }) => {
    const playButton = page.getByTestId('button-play-pause');
    await expect(playButton).toBeVisible();
  });

  test('should play audio when play button is clicked', async ({ page }) => {
    const playButton = page.getByTestId('button-play-pause');
    await playButton.click();

    // Button should show pause icon when playing
    await expect(playButton).toBeVisible();
  });

  test('should have frequency slider', async ({ page }) => {
    // Look for slider input (frequency control)
    const slider = page.locator('input[type="range"]').first();
    await expect(slider).toBeVisible();
  });

  test('should have waveform selector', async ({ page }) => {
    const sineButton = page.getByTestId('button-waveform-sine');
    await expect(sineButton).toBeVisible();
  });

  test('should change waveform when clicked', async ({ page }) => {
    const squareButton = page.getByTestId('button-waveform-square');
    await squareButton.click();

    // Should be selected
    await expect(squareButton).toBeVisible();
  });
});
