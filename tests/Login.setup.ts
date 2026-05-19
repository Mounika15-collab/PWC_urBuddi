import { chromium } from '@playwright/test';
import { performGlobalLogin } from '../controller/LoginController';

export default async function globalSetup(): Promise<void> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();  

    await performGlobalLogin(page);
    await context.storageState({ path: 'auth.json' });
    await browser.close();
}