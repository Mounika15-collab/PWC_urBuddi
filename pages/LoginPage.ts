import { Page, expect } from '@playwright/test';
import { fillInput, clickElement } from '../utils/CommonActions';

export function getLoginLocators(page: Page) 
{
  return {
    userName: page.locator('#userEmail'),
    password: page.locator('#userPassword'),
    loginButton: page.locator("button[type='submit']"),
    addHolidaysButton: page.locator('//button[text()="Add Holidays"]')
  };
}

export async function enterUserName(page: Page,username: string): Promise<void> 
{
  const locators = getLoginLocators(page);
  await expect(locators.userName).toBeVisible({timeout:10000});
  await fillInput(locators.userName, username);
}

export async function enterPassword(page: Page,password: string): Promise<void> 
{
  const locators = getLoginLocators(page);
  await fillInput(locators.password, password);
}

export async function clickOnLoginButton(page: Page): Promise<void> 
{
  const locators = getLoginLocators(page);
  await clickElement(locators.loginButton);
}

export async function verifyDashboardVisibility(page: Page): Promise<void> 
{
  const locators = getLoginLocators(page);
  await page.waitForLoadState('load');
  await expect(locators.addHolidaysButton).toBeVisible({ timeout: 20000 });
}