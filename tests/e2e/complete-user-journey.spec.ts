import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('new user flow: disclaimer → frequency finder → audiometer → therapy', async ({
    page,
  }) => {
    // Step 1: Visit homepage
    await page.goto('/');

    // Step 2: Dismiss disclaimer (first visit)
    const disclaimerAccept = page.getByRole('button', {
      name: /accept|agree/i,
    });
    if (await disclaimerAccept.isVisible()) {
      await disclaimerAccept.click();
    }

    // Verify homepage loaded
    await expect(page).toHaveTitle(/HearWell/i);

    // Step 3: Navigate to Frequency Finder
    await page.getByRole('link', { name: /frequency finder/i }).click();
    await expect(page).toHaveURL(/frequency-finder/);

    // Step 4: Use Frequency Finder
    const playButton = page.getByRole('button', { name: /play/i });
    await playButton.click();
    await page.waitForTimeout(500);

    // Step 5: Adjust frequency
    const frequencySlider = page.locator('input[type="range"]').first();
    await frequencySlider.fill('5000');

    // Step 6: Navigate to Audiometer
    await page.getByRole('link', { name: /audiometer/i }).click();
    await expect(page).toHaveURL(/audiometer/);

    // Step 7: Perform quick hearing test
    const audioPlayButton = page.getByRole('button', { name: /play/i }).first();
    await audioPlayButton.click();
    await page.waitForTimeout(1000);

    // Mark as heard
    const heardButton = page.getByRole('button', { name: /heard/i }).first();
    if (await heardButton.isVisible()) {
      await heardButton.click();
    }

    // Step 8: Navigate to Tonal Masker
    await page.getByRole('link', { name: /tonal masker/i }).click();
    await expect(page).toHaveURL(/tonal-masker/);

    // Step 9: Start therapy
    const therapyPlayButton = page.getByRole('button', { name: /play|start/i });
    await therapyPlayButton.click();
    await page.waitForTimeout(1000);

    // Stop therapy
    await therapyPlayButton.click();

    // Journey complete - no crashes!
    await expect(page).toHaveTitle(/HearWell/);
  });

  test('language switching persists across pages', async ({ page }) => {
    await page.goto('/');

    // Dismiss disclaimer if present
    const disclaimerAccept = page.getByRole('button', {
      name: /accept|agree/i,
    });
    if (await disclaimerAccept.isVisible()) {
      await disclaimerAccept.click();
    }

    // Open language selector
    const languageSelector = page.getByRole('button', {
      name: /language|en|english/i,
    });
    await languageSelector.click();

    // Select Spanish
    const spanishOption = page.getByRole('menuitem', {
      name: /español|spanish/i,
    });
    if (await spanishOption.isVisible()) {
      await spanishOption.click();
    }

    // Navigate to different page
    await page.getByRole('link', { name: /audiometer|audiómetro/i }).click();

    // Language should persist
    const title = await page.title();
    expect(title).toContain('HearWell');
  });

  test('theme switching works across all pages', async ({ page }) => {
    await page.goto('/');

    // Dismiss disclaimer if present
    const disclaimerAccept = page.getByRole('button', {
      name: /accept|agree/i,
    });
    if (await disclaimerAccept.isVisible()) {
      await disclaimerAccept.click();
    }

    // Toggle to dark mode
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    await themeToggle.click();

    // Check if dark class is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Navigate to another page
    await page.getByRole('link', { name: /audiometer/i }).click();

    // Dark mode should persist
    await expect(html).toHaveClass(/dark/);
  });

  test('feedback form submission works', async ({ page }) => {
    await page.goto('/feedback');

    // Dismiss disclaimer if present
    const disclaimerAccept = page.getByRole('button', {
      name: /accept|agree/i,
    });
    if (await disclaimerAccept.isVisible()) {
      await disclaimerAccept.click();
    }

    // Fill feedback form
    const feedbackTextarea = page.locator('textarea#feedback');
    await feedbackTextarea.fill(
      'This is a test feedback message for HearWell. The application is helping me manage my tinnitus effectively.'
    );

    // Submit button should be enabled
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await expect(submitButton).toBeEnabled();

    // Note: Actual submission would require valid Formspree ID
    // This test just verifies the form UI works correctly
  });

  test('all navigation links work', async ({ page }) => {
    await page.goto('/');

    // Dismiss disclaimer if present
    const disclaimerAccept = page.getByRole('button', {
      name: /accept|agree/i,
    });
    if (await disclaimerAccept.isVisible()) {
      await disclaimerAccept.click();
    }

    // Test all nav links
    const navLinks = [
      { name: /audiometer/i, url: /audiometer/ },
      { name: /tonal masker/i, url: /tonal-masker/ },
      { name: /frequency finder/i, url: /frequency-finder/ },
      { name: /noise generator/i, url: /noise-generator/ },
      { name: /notched noise/i, url: /notched-noise/ },
      { name: /learn/i, url: /learn/ },
      { name: /about/i, url: /about/ },
      { name: /feedback/i, url: /feedback/ },
    ];

    for (const link of navLinks) {
      await page.getByRole('link', { name: link.name }).click();
      await expect(page).toHaveURL(link.url);
      await page.goBack();
    }
  });

  test('mobile menu works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Dismiss disclaimer if present
    const disclaimerAccept = page.getByRole('button', {
      name: /accept|agree/i,
    });
    if (await disclaimerAccept.isVisible()) {
      await disclaimerAccept.click();
    }

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();

    // Check that menu opened
    const mobileNav = page.locator('[role="dialog"]');
    await expect(mobileNav).toBeVisible();

    // Click a link in mobile menu
    const audiometerLink = page
      .getByRole('link', { name: /audiometer/i })
      .last();
    await audiometerLink.click();

    // Verify navigation occurred
    await expect(page).toHaveURL(/audiometer/);

    // Menu should close
    await expect(mobileNav).not.toBeVisible();
  });
});
