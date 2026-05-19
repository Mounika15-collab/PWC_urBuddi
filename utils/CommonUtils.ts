import {Page, Locator,expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import testData from '../testdata/StaticData.json';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

let lastGeneratedDate: Date | null = null;

export interface GeneratedEmployee {
  empID: string;
  invalidEmpID:string;
  firstname: string;
  lastname: string;
  email: string;
  personalEmail:string;
  invalidPersonalEMail:string;
  invalidEmail:string;
}


function onlyAlphabets(value: string): string {
  return value.replace(/[^A-Za-z]/g, '');
}

//faker employee data
export function getGenerateEmployee(): GeneratedEmployee {
  const rawFirstName = faker.person.firstName();
  const rawLastName = faker.person.lastName();
  const letters = faker.string.alpha({ length: 3, casing: 'upper' }).replace(/[^A-Z]/g, '');
  const numbers = faker.string.numeric(2);

  return {
    empID: `L${letters}${numbers}`,
    invalidEmpID:`JKLMNAARE${letters}${numbers}`,
    firstname: onlyAlphabets(rawFirstName),
    lastname: onlyAlphabets(rawLastName),
    email: faker.internet.email(), 
    personalEmail:faker.internet.email(),
    invalidPersonalEMail:faker.internet.email().replace("@","$"),
    invalidEmail:faker.internet.email().replace("@","$"),
  };
}

//unique dates for applying leave
export async function generateUniqueDates(duration: number = 1): Promise<{ start: string; end: string }> {
  
  const today = new Date();
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  if (!lastGeneratedDate) {
    lastGeneratedDate = new Date(today);
  }

  do {
    lastGeneratedDate.setDate(lastGeneratedDate.getDate() + 3);
  } while (isWeekend(lastGeneratedDate));

  const fromDate = new Date(lastGeneratedDate);
  const toDate = new Date(fromDate);

  let daysAdded = 1;

  while (daysAdded < duration) {
    toDate.setDate(toDate.getDate() + 1);
    if (!isWeekend(toDate)) {
      daysAdded++;
    }
  }

  const formatDate = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return {
    start: formatDate(fromDate),
    end: formatDate(toDate),
  };
}


//select dropdown option 
export async function selectDropdownOption(dropdownLocator: Locator,optionToSelect: string): Promise<void> {

  await dropdownLocator.waitFor({ state: 'attached' });
  const options = await dropdownLocator.locator('option').all();
  for (const option of options) {
    const value = await option.getAttribute('value');
    const text = (await option.textContent())?.trim();

    if (text === optionToSelect || value === optionToSelect) {
      await dropdownLocator.selectOption({ value: value ?? undefined });
      return;
    }
  }
  throw new Error(`Option "${optionToSelect}" not found in dropdown`);
}

//select checkbox
export async function handleCheckboxes(page: Page,selectedOptions: string | string[]): Promise<void> {

  if (!selectedOptions) return;

  const optionsArray = Array.isArray(selectedOptions)
    ? selectedOptions
    : [selectedOptions];

  for (const option of optionsArray) {
    const checkbox = page.getByRole('checkbox', { name: option, exact: true });
    await checkbox.waitFor({ state: 'visible' });

    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }
}

//calculate the leave applied days correctly displayed on UI 
export function calculateExpectedDays(startDate: string,endDate: string): string {
  let count = 0;
  let curDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (curDate <= lastDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count.toString();
}

//store the leave or wfh applied dates
const FILE_PATH = path.join(process.cwd(), testData.employeeDetails.sharedEmployeeJsonFile);

function readData() {
  const raw = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: any) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

export function storeAppliedLeave(startDate: string,endDate: string,) {
  const data = readData();
  data.appliedLeave = {startDate,endDate,};
  writeData(data);
}

export function storeAppliedWFH(startDate: string,endDate: string,) {
  const data = readData();
  data.appliedWFH = {startDate,endDate,};
  writeData(data);
} 

//select drop down value
export async function selectDropdownValue(dropdown: Locator,value: string) {
  await dropdown.selectOption({ label: value });
}


const usedDates = new Set<string>();

//generate holiday name with faker
export function getUniqueHolidayData() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDate = today.getDate();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
 
  let formattedDate: string;
  if (usedDates.size >= (lastDateOfMonth - todayDate + 1)) {
    throw new Error('All future dates in this month are already used');
  }
  do {
    const day = faker.number.int({
      min: todayDate,    
      max: lastDateOfMonth
    });
    const date = new Date(year, month, day);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    formattedDate = `${yyyy}-${mm}-${dd}`;

  } while (usedDates.has(formattedDate));
  usedDates.add(formattedDate);
  return {
    event: faker.word.words(2),
    occasion: faker.word.words(2) + ' Holiday',
    date: formattedDate,
  };
}

//widgets in dashboard
export async function getWidgetItems(widget: Locator,itemSelector: string,nameSelector: string): Promise<string[]> 
{
  const noData = widget.locator('text=No');
  if (await noData.first().isVisible().catch(() => false)) {
    return [];
  }

  const items = widget.locator(itemSelector);
  await expect(items.first()).toBeVisible({ timeout: 10000 });
  const count = await items.count();
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    const name = await item.locator(nameSelector).innerText();
    list.push(name.trim());
  }
  return list;
}

//pagination
export async function validateAllRowsAreActive(page: Page,statusLocator: Locator,nextButton: Locator,projectstatus:string)
{
  while (true) {
    await statusLocator.first().waitFor({ state: 'visible', timeout: 10000 });
    const statuses = await statusLocator.allTextContents();

    for (const status of statuses) {
      expect(status.trim()).toBe(projectstatus);
    }

    const isDisabled =(await nextButton.getAttribute('aria-disabled')) === 'true' ||(await nextButton.isDisabled().catch(() => false));

    if (isDisabled) break;
    await nextButton.click();
    await page.waitForLoadState('networkidle');
  }
}

//getlistofrecords
export type ColumnConfig = {key: string; colId: string;};

// export async function getGridData(page: Page,rowLocator: string | Locator,columns: ColumnConfig[]) {
//     const rows = typeof rowLocator === 'string' ? page.locator(rowLocator) : rowLocator;
//     const count = await rows.count();

//     const data: any[] = [];

//     for (let i = 0; i < count; i++) {
//         const row = rows.nth(i);
//         const rowData: any = {};

//         for (const col of columns) {
//             const value = await row.locator(`[col-id="${col.colId}"]`).textContent({ timeout: 10000 });
//             rowData[col.key] = value?.trim();
//         }

//         data.push(rowData);
//     }
//     return data;
// }
type GetGridOptions = { limit?: number;fetchAll?: boolean; rowLocator: string | Locator;nextButtonLocator?: string | Locator;};

export async function getGridDataAdvanced(page: Page,columns: ColumnConfig[],options: GetGridOptions) {
  const { limit, fetchAll = false, rowLocator, nextButtonLocator } = options;

  const rows = typeof rowLocator === 'string'? page.locator(rowLocator): rowLocator;
  const nextButton = nextButtonLocator? (typeof nextButtonLocator === 'string'? page.locator(nextButtonLocator): nextButtonLocator): null;
  const allData: any[] = [];

  while (true) {
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      if (limit && allData.length >= limit) break;

      const row = rows.nth(i);
      const rowData: any = {};

      for (const col of columns) {
        const value = await row.locator(`[col-id="${col.colId}"]`).textContent();
        rowData[col.key] = value?.trim();
      }
      allData.push(rowData);
    }

    if (limit && allData.length >= limit) break;
    if (!fetchAll && !limit) break;
    if (!nextButton) break;
    if (await nextButton.isDisabled()) break;
    await nextButton.click();
    await page.waitForLoadState('networkidle');
  }
  return limit ? allData.slice(0, limit) : allData;
}

// export async function getGridData(page: Page, rowSelector: string, columns: { key: string; colId: string }[]) {
//     const rows = page.locator(rowSelector);
//     const count = await rows.count();
//     const data: any[] = [];

//     for (let i = 0; i < count; i++) {
//         const row = rows.nth(i);
        
//         // 1. Scroll the ROW into view (Fixes Vertical Virtualization/Row 11 error)
//         await row.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});

//         // 2. Validate it's a data row by checking for an ID cell
//         const idCell = row.locator(`[col-id="id"]`);
//         if (await idCell.count() === 0) continue; 

//         const rowData: any = {};
//         for (const col of columns) {
//             const cell = row.locator(`[col-id="${col.colId}"]`);
            
//             try {
//                 // 3. Scroll the CELL into view (Fixes Horizontal Virtualization)
//                 await cell.scrollIntoViewIfNeeded({ timeout: 2000 }).catch(() => {});
                
//                 // 4. Wait for the cell to be attached and get text
//                 await cell.waitFor({ state: 'attached', timeout: 5000 });
//                 const value = await cell.textContent();
//                 rowData[col.key] = value?.trim() || "";
//             } catch (e) {
//                 throw new Error(`Column "${col.colId}" not found in row ${i}.`);
//             }
//         }
//         data.push(rowData);
//     }
//     return data;
// }

//excel list 
type ExcelColumnConfig = {key: string;header: string;};

export function getExcelData(filePath: string, columns: ExcelColumnConfig[]) {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet, { raw: true });

    return rawData.map((row: any) => {
        const rowData: any = {};
        for (const col of columns) {
            let value = row[col.header];
            if (col.key === 'date' && typeof value === 'number') {
                const excelDate = XLSX.SSF.parse_date_code(value);
                const dd = String(excelDate.d).padStart(2, '0');
                const mm = String(excelDate.m).padStart(2, '0');
                const yyyy = excelDate.y;
                value = `${dd}-${mm}-${yyyy}`;
            }

            rowData[col.key] = value?.toString().trim();
        }
        return rowData;
    });
}


//comapre ui and excel data
export function compareData(uiData: any[], excelData: any[]) {
    uiData.sort((a, b) => a.description.localeCompare(b.description));
    excelData.sort((a, b) => a.description.localeCompare(b.description));

    expect(uiData.length).toBe(excelData.length);

    for (let i = 0; i < uiData.length; i++) {
        expect(uiData[i]).toEqual(excelData[i]);
    }
}

//validate month picker dates range
export function verifyDateIsInRange(dateStr: string, startMonthStr: string, endMonthStr: string) {
    const monthMap: { [key: string]: number } = {
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    const [d, m, y] = dateStr.split('-').map(Number);
    const actualDate = new Date(y, m - 1, d);
    const [sName, sYear] = startMonthStr.split(' ');
    const startDate = new Date(parseInt(sYear), monthMap[sName], 1);
    const [eName, eYear] = endMonthStr.split(' ');
    const endDate = new Date(parseInt(eYear), monthMap[eName] + 1, 0);

    return actualDate >= startDate && actualDate <= endDate;
}

//download files
export async function downloadFile(page: Page, triggerAction: () => Promise<void>) {
  const [download] = await Promise.all([
    page.waitForEvent("download",{timeout:120000}),
    triggerAction()
  ]);

  const fileName = await download.suggestedFilename();
  const filePath = `downloads/${fileName}`;

  await download.saveAs(filePath);
  return filePath;
}

//validate exported data with emp IDs
export function validateEmployeeIds(exportedData: any[], employees: any[]) {
  const exportedIDs = exportedData.map((e) =>
    String(e["Employee Id"] ?? e["Employee ID"] ?? "").trim()
  );

  for (const emp of employees) {
    const expectedID = String(emp.ID).trim();
    expect(exportedIDs).toContain(expectedID);
  }
}