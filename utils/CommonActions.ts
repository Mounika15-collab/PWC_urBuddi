import { Page, Locator,expect } from '@playwright/test';
import {FullEmployee,SharedData} from '../controller/EmployeeController';
import testData from '../testdata/StaticData.json';
import fs from 'fs';
import path from 'path';

export async function fillInput(locator: Locator, value: string | undefined): Promise<void> {
  await locator.waitFor({ state: 'visible' });
  if (!value) {
    throw new Error('fillInput: value is undefined or empty');
  }
  await locator.fill(value);
}

export async function clickElement(locator: Locator): Promise<void> {
  await locator.waitFor({ state: 'visible' });
  await locator.focus();
  await locator.click({delay:1000});
}

export async function verifyToast(page: Page, message: string) 
{
  const toast = page.getByText(message, { exact: false }).first();
  await expect(toast).toBeVisible();
  await expect(toast).toContainText(message,{ timeout: 10000 });
  await expect(toast).toBeHidden({ timeout: 10000 });
}

export async function verifyToastMessage(page:Page,message:string)
{
  const toast=page.getByText(message,{ exact: false }).first();
  await expect(toast).not.toBeVisible();
}

export async function verifyStatus(locator:Locator,expectedValue:string):Promise<void>
{
  await locator.waitFor({state:'visible'});
  await expect(locator).toHaveText(expectedValue,{timeout:10000});
}

export async function scrollToRightAndClick(page: Page, element: Locator): Promise<void> 
{
  await page.evaluate(() => {
    const viewport = document.querySelector('.ag-body-horizontal-scroll-viewport') as HTMLElement | null;
    if (viewport) {
      viewport.scrollLeft = viewport.scrollWidth;
    }
  });
  await element.waitFor({ state: 'visible' });
  await page.waitForLoadState('networkidle');
   await element.scrollIntoViewIfNeeded();
  await element.focus();
  await clickElement(element);                                          
}

export function getCreatedEmployeeDetails(filePath: string): string 
{
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);

    if (!json.firstname || !json.lastname) {
        throw new Error('JSON does not contain firstname or lastname for employee');
    }
    return `${json.firstname} ${json.lastname}`;
}

export function getTodayDate(format: 'yyyy-mm-dd' | 'dd-mm-yyyy' = 'yyyy-mm-dd'): string 
{
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    if (format === 'yyyy-mm-dd') {
        return `${yyyy}-${mm}-${dd}`;
    }

    return `${dd}-${mm}-${yyyy}`;
}


export async function getErrorCount(locator:Locator):Promise<number>{
  return await locator.count();
}

export function updateSharedData(key: string, value: any, filePath: string) {
  const absolutePath = path.resolve(filePath);

  const existingData = fs.existsSync(absolutePath)
    ? JSON.parse(fs.readFileSync(absolutePath, 'utf-8'))
    : {};

  const keys = key.split('.');
  let temp = existingData;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!temp[keys[i]]) {
      temp[keys[i]] = {};
    }
    temp = temp[keys[i]];
  }

  temp[keys[keys.length - 1]] = value;

  fs.writeFileSync(absolutePath, JSON.stringify(existingData, null, 2));
}

export async function writeBackToSharedData(data: FullEmployee){
  const sharedData: SharedData = {
    empID: data.empID,
    email: data.email,
    personalEmail:data.personalEmail,
    password: data.employeePassword,
    firstname: data.firstname,
    lastname:data.lastname,
  };
  const filePath = path.join(process.cwd(),testData.employeeDetails.sharedEmployeeJsonFile);
  fs.writeFileSync(filePath, JSON.stringify(sharedData, null, 2));
}

export function getSharedData(filePath: string) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Data file not found at ${absolutePath}`);
    }
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileContent);
}
