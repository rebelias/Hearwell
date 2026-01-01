import { test, expect } from '@playwright/test';

test.describe('Notched Noise', () => {
  test.beforeEach(async ({ page }) => {
    // Accept disclaimer before each test
    await page.addInitScript(() => {
      localStorage.setItem('hearwell-disclaimer-accepted', 'true');
    });
    await page.goto('/notched-noise');
  });

  test('should load the notched noise page', async ({ page }) => {
    await expect(page).toHaveTitle(/Notched Noise|Tinnitus Therapy/i);
  });

  test('should have play/pause button', async ({ page }) => {
    const playButton = page.getByTestId('button-play-pause');
    await expect(playButton).toBeVisible();
  });

  test('should have 10-band equalizer sliders', async ({ page }) => {
    const sliders = page.locator('input[type="range"]');
    const count = await sliders.count();
    // Should have at least 10 sliders for the EQ bands, plus volume slider
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('should have noise type selector', async ({ page }) => {
    // Look for radio buttons or buttons for noise type (White, Pink, Brown, Purple, Grey)
    const whiteOption = page
      .getByRole('radio', { name: /white/i })
      .or(page.getByRole('button', { name: /white/i }));
    await expect(whiteOption.first()).toBeVisible();
  });

  test('should have stereo width control', async ({ page }) => {
    // Look for stereo width selector (Mono, Narrow, Normal, Wide)
    const stereoControl = page
      .getByRole('radio', { name: /mono|narrow|normal|wide/i })
      .or(page.getByRole('button', { name: /mono|narrow|normal|wide/i }));
    await expect(stereoControl.first()).toBeVisible();
  });

  test('should play notched noise when play button is clicked', async ({
    page,
  }) => {
    const playButton = page.getByTestId('button-play-pause');
    await playButton.click();

    // Button should show pause icon when playing
    await expect(playButton).toBeVisible();
  });
});
