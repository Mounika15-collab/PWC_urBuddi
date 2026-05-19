import { Page, expect, test } from '@playwright/test';
import * as LoginPage from '../pages/LoginPage';
import config from '../playwright.config';
import employeeData from '../testdata/StaticData.json';
import fs from 'fs';
import path from 'path';

interface LoginData {
  url: string;
  username: string;
  password: string;
}

function getLoginData(): LoginData {
  const relativepath=employeeData.employeeDetails.employeeDataJsonFile;
  const filePath = path.join(process.cwd(), relativepath);
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return jsonData.login_Data;
}

export async function performGlobalLogin(page: Page): Promise<void> {
  const loginData = getLoginData();
  const baseURL = config.use?.baseURL;

  await page.goto(`${baseURL}${loginData.url}`, { waitUntil: 'domcontentloaded' });
  await LoginPage.enterUserName(page, loginData.username);
  await LoginPage.enterPassword(page, loginData.password);
  await LoginPage.clickOnLoginButton(page);
  await LoginPage.verifyDashboardVisibility(page);
}