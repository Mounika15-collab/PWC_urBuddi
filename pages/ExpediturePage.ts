import {Page,expect} from '@playwright/test';
import { Expenditure } from '../fixtures/Fixture';
import { clickElement, fillInput } from '../utils/CommonActions';
import { selectDropdownValue,getGridDataAdvanced,ColumnConfig,verifyDateIsInRange } from '../utils/CommonUtils';
import expenditureData from '../testdata/StaticData.json';

export function getExpenditureLocators(page:Page){
    return{
        expenditureMenu:page.locator('//p[text()="Expenditure"]/../..//li'),
        pageHeader:page.locator('//div[@class="page-header-container"]'),
        uploadBillButton:page.locator('//button[text()="Upload Bill"]'),
        addExpenditureFrameHEading:page.locator('//p[text()="Add Expenditure"]/..'),
        downloadFilesButton:page.locator('//button[text()="Download Files"]'),
        ExportButton:page.locator('//button[text()="Export"]'),
        selectExpenditureTypeDrodown:page.locator('select[name="expenditureType"]'),
        descriptionField:page.locator('textarea[name="description"]'),
        dateField:page.locator('input[name="date"]'),
        amountField:page.locator('#amount'),
        uploadButton:page.locator('#uploadBtn'),
        submitButton:page.locator('//button[text()="Submit Bill"]'),
        rows:page.locator('.ag-row'),
        nextPageButton:page.locator('div[aria-label="Next Page"]'),
        startMonth:page.locator('(//div[@class="react-datepicker__input-container"]//input)[1]'),
        endMonth:page.locator('(//div[@class="react-datepicker__input-container"]//input)[2]')
    }
}

export async function clickOnExpenditureModule(expenditure:Expenditure){
    await expect(expenditure.expenditureMenu).toBeVisible();
    await clickElement(expenditure.expenditureMenu);
}

export async function verifyPageHeader(expenditure:Expenditure){
    await expect(expenditure.pageHeader).toBeVisible();
}

export async function clickOnUploadBillButton(expenditure:Expenditure){
    await expect(expenditure.uploadBillButton).toBeVisible();
    await clickElement(expenditure.uploadBillButton);
}

export async function verifyAddExpenditureFrameHeading(expenditure:Expenditure){
    await expect(expenditure.addExpenditureFrameHEading).toBeVisible();
}

export async function selectExpenditureType(expenditure:Expenditure,expenditureType:string){
    await expect(expenditure.selectExpenditureTypeDrodown).toBeVisible();
    await selectDropdownValue(expenditure.selectExpenditureTypeDrodown,expenditureType);
}

export async function enterDescription(expenditure:Expenditure,description:string){
    await expect(expenditure.descriptionField).toBeVisible();
    await fillInput(expenditure.descriptionField,description);
}

export async function enterDate(expenditure:Expenditure,date:string){
    await expect(expenditure.dateField).toBeVisible();
    await fillInput(expenditure.dateField,date);
}

export async function enterAmount(expenditure:Expenditure,amount:string){
    await expect(expenditure.amountField).toBeVisible();
    await fillInput(expenditure.amountField,amount);
}

export async function clickOnUploadButton(expenditure:Expenditure){
    await expect(expenditure.uploadButton).toBeVisible();
    await clickElement(expenditure.uploadButton);
}

export async function clickOnSubmitButton(expenditure:Expenditure){
    await expect(expenditure.submitButton).toBeEnabled();
    await clickElement(expenditure.submitButton);
}

export async function clickOndownloadFilesButton(expenditure:Expenditure){
    await expect(expenditure.downloadFilesButton).toBeVisible();
    await clickElement(expenditure.downloadFilesButton);
}

export async function clickOnExportButton(expenditure:Expenditure){
    await expect(expenditure.ExportButton).toBeVisible();
    await clickElement(expenditure.ExportButton);
}

export async function enterStartMonthcontainer(expenditure:Expenditure,month:string){
    await expect(expenditure.startMonth).toBeVisible();
    await fillInput(expenditure.startMonth,month)
}

export async function enterEndMonthcontainer(expenditure:Expenditure,month:string){
    await expect(expenditure.endMonth).toBeVisible();
    await fillInput(expenditure.endMonth,month)
}

export async function validateExpenditureListByDate(page: Page,expenditure: Expenditure, expenditureData: any) {
    const columns: ColumnConfig[] = [{ key: 'date', colId: 'date' }];
    const gridData = await getGridDataAdvanced(page, columns, {rowLocator: expenditure.rows,fetchAll: true});    
    const { startMonth, endMonth } = expenditureData.ExpenditureDetails;
    expect(gridData.length, `No records found in UI`).toBeGreaterThan(0);
    gridData.forEach((row, index) => {
        const isValid = verifyDateIsInRange(row.date, startMonth, endMonth);        
        expect(isValid, 
            `Row ${index} (${row.date}) is outside range ${startMonth} - ${endMonth}`
        ).toBe(true);
    });
}