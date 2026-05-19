import { Expenditure } from '../fixtures/Fixture';
import * as expenditurePage from '../pages/ExpediturePage';
import expenditureData from '../testdata/StaticData.json';
import { getTodayDate } from '../utils/CommonActions';
import { Page,expect } from '@playwright/test';
import { getGridDataAdvanced, getExcelData, compareData } from '../utils/CommonUtils';

type GridColumn = { key: string; colId: string };
type ExcelColumn = { key: string; header: string };

export async function uploadBill(page:Page,expenditure:Expenditure)
{
    const date=getTodayDate();
    await expenditurePage.clickOnExpenditureModule(expenditure);
    await expenditurePage.verifyPageHeader(expenditure);
    await expenditurePage.clickOnUploadBillButton(expenditure);
    await expenditurePage.verifyAddExpenditureFrameHeading(expenditure);
    await expenditurePage.selectExpenditureType(expenditure,expenditureData.ExpenditureDetails.expenditureType);
    await expenditurePage.enterDescription(expenditure,expenditureData.ExpenditureDetails.description);
    await expenditurePage.enterDate(expenditure,date),
    await expenditurePage.enterAmount(expenditure,expenditureData.ExpenditureDetails.amount);
    const filePath = expenditureData.ExpenditureDetails.samplePdf;
    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        expenditurePage.clickOnUploadButton(expenditure)
    ]);

    await fileChooser.setFiles(filePath);
    await expenditurePage.clickOnSubmitButton(expenditure);
}

export async function downloadFiles(page: Page, expenditure: Expenditure) {
    await expenditurePage.clickOnExpenditureModule(expenditure);
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        expenditurePage.clickOndownloadFilesButton(expenditure)
    ]);
    const fileName = download.suggestedFilename();
    expect(fileName).toBeTruthy();
    expect(fileName).toContain('.');
    await download.saveAs(`downloads/${fileName}`);
}

export async function exportAndValidate(page: Page,expenditure: Expenditure,gridColumns: GridColumn[],excelColumns: ExcelColumn[])
{
    await expenditurePage.clickOnExpenditureModule(expenditure);
    const uiData = await getGridDataAdvanced(page, gridColumns, {rowLocator: expenditure.rows, fetchAll: true});
    const [download] = await Promise.all([ page.waitForEvent('download'),expenditurePage.clickOnExportButton(expenditure)]);
    const filePath = `downloads/${download.suggestedFilename()}`;
    await download.saveAs(filePath);
    const excelData = getExcelData(filePath, excelColumns);
    compareData(uiData, excelData);
}

export async function exportDataForSelectedMonths(page: Page,expenditure: Expenditure,gridColumns: GridColumn[],excelColumns: ExcelColumn[]){
    await expenditurePage.clickOnExpenditureModule(expenditure);
    await expenditurePage.enterStartMonthcontainer(expenditure,expenditureData.ExpenditureDetails.startMonth);
    await expenditurePage.enterEndMonthcontainer(expenditure,expenditureData.ExpenditureDetails.endMonth);
    await page.waitForLoadState("domcontentloaded");
    const uiData = await getGridDataAdvanced(page, gridColumns, {rowLocator: expenditure.rows, fetchAll: true});
    const [download] = await Promise.all([page.waitForEvent('download'),expenditurePage.clickOnExportButton(expenditure)]);
    const filePath = `downloads/${download.suggestedFilename()}`;
    await download.saveAs(filePath);
    const excelData = getExcelData(filePath, excelColumns);
    compareData(uiData, excelData);
}

export async function selectAndValidateMonths(page: Page,expenditure:Expenditure,data: any){
    await expenditurePage.clickOnExpenditureModule(expenditure);
    await expenditurePage.enterStartMonthcontainer(expenditure,expenditureData.ExpenditureDetails.startMonth);
    await expenditurePage.enterEndMonthcontainer(expenditure,expenditureData.ExpenditureDetails.endMonth);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState('networkidle');
    await expenditurePage.validateExpenditureListByDate(page,expenditure,data)
}