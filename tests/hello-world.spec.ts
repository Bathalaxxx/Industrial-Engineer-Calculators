import { test, expect } from '@playwright/test';

test('hello world test', async ({ page }) => {
    await page.goto('https://example.com');
    const content = await page.textContent('h1');
    expect(content).toBe('Example Domain');
});