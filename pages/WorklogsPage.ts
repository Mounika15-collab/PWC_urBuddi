import { expect,Page} from '@playwright/test';
import { WorklogBilling } from '../fixtures/Fixture';
import { clickElement, fillInput, verifyToast } from '../utils/CommonActions';
import { selectDropdownValue,validateAllRowsAreActive } from '../utils/CommonUtils';
import worklogData from '../testdata/StaticData.json';

export function getWorklogLocators(page:Page){
    return{
        billingMenu: page.locator('//p[text()="Billing"]'),
        worklogMenu:page.locator('//p[text()="WorkLogs"]/../..'),
        addWorklogButton:page.locator('//button[text()="Add Worklog"]/..'),
        activeStatus:page.locator('//label[text()="Active"]'),
        pausedStatus:page.locator('//label[text()="Paused"]'),
        closedStatus:page.locator('//label[text()="Closed"]'),
        addWorklogButtonInWorklogDashboard:page.locator('//button[text()="Add WorkLog"]/..'),
        allProjectsDropdown:page.locator('//select[@class="selectElement" and option[normalize-space()="All Projects"]]'),
        selectYearDropdown:page.locator('//select[@class="selectElement"][2]'),
        addWorklogFrameHeading:page.locator('//p[@class="modal-heading"]/..'),
        projectNameDrodown:page.locator('select[name="projectId"]'),
        workDateField:page.locator('input[name="workDate"]'),
        workingHoursField:page.getByPlaceholder('Enter hours'),
        attendanceTypeDropdown:page.locator('select[name="attendanceType"]'),
        workDescriptionField:page.getByPlaceholder('Describe your work in detail...'),
        addButton:page.locator('//button[text()="Add"]'),
        cancelButton:page.locator('//button[text()="Cancel"]'),
        exportButton:page.locator('//button[text()="Export"]/..'),
        thisMonthButton:page.locator('//button[text()="This Month"]'),
        fromDateField:page.locator('//label[text()="From Date*"]/..'),
        toDateField:page.locator('//label[text()="To Date*"]/..'),
        submitbutton:page.locator('//button[text()="Submit"]'), 
        activeStatusLocator:page.locator('[col-id="status"] .ag-cell-value'),
        nextpageButton:page.locator('div[aria-label="Next Page"]'), 
        editWorklogButton:page.locator('//div[@title="Edit"]').first(),
        updateWorklogFrameHeading:page.locator('//p[text()="Update WorkLog"]/..'),
        updateButton:page.locator('//button[text()="Update"]'),
        deleteWorklogButton:page.locator('div[title="Delete"]'),
        confirmPopupHeading:page.locator('//p[text()="Confirm Delete"]/..'),
        confirmDeleteButton:page.locator('//button[text()="Yes"]')
    }
}

export async function clickOnBillingMenu(worklog:WorklogBilling)
{
    await expect( worklog.billingMenu).toBeVisible();
    await clickElement( worklog.billingMenu);
}

export async function clickOnWorklogMenu(worklog:WorklogBilling){
    await expect(worklog.worklogMenu).toBeVisible();
    await clickElement(worklog.worklogMenu);
}

export async function clickOnAddWorklogButtonInWorklogsPage(worklog:WorklogBilling){
    await expect(worklog.addWorklogButton).toBeVisible({timeout:10000});
    await clickElement(worklog.addWorklogButton);
}

export async function clickOnAddWorklogButtonInWorklogDashboard(worklog:WorklogBilling){
    await expect(worklog.addWorklogButtonInWorklogDashboard).toBeEnabled({timeout:10000});
    await clickElement(worklog.addWorklogButtonInWorklogDashboard);
}

export async function selectProjectFromAllProjectsropdown(worklog:WorklogBilling,projectName:string){
    await expect(worklog.allProjectsDropdown).toBeVisible({timeout:10000});
    await clickElement(worklog.allProjectsDropdown);
    await selectDropdownValue(worklog.allProjectsDropdown,projectName); 
}

export async function selectYearfromDropDown(worklog:WorklogBilling,year:string){
    await expect(worklog.selectYearDropdown).toBeVisible();
    await selectDropdownValue(worklog.selectYearDropdown,year);
}

export async function clickOnActiveStatusCheckbox(worklog:WorklogBilling){
    await expect(worklog.activeStatus).toBeVisible();
    await clickElement(worklog.activeStatus);
}

export async function clickOnPausedStatusCheckbox(worklog:WorklogBilling){
    await expect(worklog.pausedStatus).toBeVisible();
    await clickElement(worklog.pausedStatus);
}

export async function clickOnClosedStatusCheckBox(worklog:WorklogBilling){
    await expect(worklog.closedStatus).toBeVisible();
    await clickElement(worklog.closedStatus);
}

export async function verifyAddWorkLogframeHeading(worklog:WorklogBilling){
    await expect(worklog.addWorklogButtonInWorklogDashboard).toBeVisible();
}

export async function selectProjectName(worklog:WorklogBilling,projectName:string){
    await expect(worklog.projectNameDrodown).toBeVisible();
    await selectDropdownValue(worklog.projectNameDrodown,projectName);
}

export async function enterWorkDate(worklog:WorklogBilling,workDate:string){
    await expect(worklog.workDateField).toBeVisible();
    await fillInput(worklog.workDateField,workDate);
}

export async function enterWorkingHours(worklog:WorklogBilling,workingHours:string){
    await expect(worklog.workingHoursField).toBeVisible();
    await fillInput(worklog.workingHoursField,workingHours)
}

export async function selectAttendaceTypefromdropdown(worklog:WorklogBilling,workStatus:string){
    await expect(worklog.attendanceTypeDropdown).toBeVisible();
    await selectDropdownValue(worklog.attendanceTypeDropdown,workStatus)
}

export async function enterWorkDescription(worklog:WorklogBilling,description:string){
    await expect(worklog.workDescriptionField).toBeVisible();
    await fillInput(worklog.workDescriptionField,description);
}

export async function clickOnAddButton(worklog:WorklogBilling){
    await expect(worklog.addButton).toBeVisible();
    await clickElement(worklog.addButton);
}

export async function clickOnCancelButton(worklog:WorklogBilling){
    await expect(worklog.cancelButton).toBeVisible();
    await clickElement(worklog.cancelButton);
}

export async function clickOnExportButton(worklog:WorklogBilling){
    await expect(worklog.exportButton).toBeEnabled();
    await clickElement(worklog.exportButton);
}

export async function clickOnThisMonthButton(worklog:WorklogBilling){
    await expect(worklog.thisMonthButton).toBeVisible();
    await clickElement(worklog.thisMonthButton);
}

export async function enterFromDate(worklog:WorklogBilling,fromDate:string){
    await expect(worklog.fromDateField).toBeVisible();
    await fillInput(worklog.fromDateField,fromDate);
}

export async function enterToDate(worklog:WorklogBilling,toDate:string){
    await expect(worklog.toDateField).toBeVisible();
    await fillInput(worklog.toDateField,toDate);
}

export async function clickOnSubmitButton(worklog:WorklogBilling){
    await expect(worklog.submitbutton).toBeVisible();
    await clickElement(worklog.submitbutton);
}

export async function verifyWorklogaddedSuccessfullyToast(page: Page){
    await verifyToast(page,worklogData.toastMessages.worklogAddedSuccessToast);
}

export async function validateProjectStatusInWorklogList(page:Page,worklog:WorklogBilling,projectstatus:string){
    await validateAllRowsAreActive(page,worklog.activeStatusLocator,worklog.nextpageButton,projectstatus);
}

export async function clickOnMonthCard(page:Page)
{
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    const currentMonthCard = page.locator('.monthly-card').filter({has: page.locator('h6', { hasText: currentMonth })});
    await expect(currentMonthCard).toHaveCount(1);
    await currentMonthCard.first().scrollIntoViewIfNeeded();
    await currentMonthCard.first().click();
}

export async function clickOnEditButton(worklog:WorklogBilling){
    await expect(worklog.editWorklogButton).toBeVisible();
    await clickElement(worklog.editWorklogButton);
}

export async function verifyUpdateWorklogFrameHEading(worklog:WorklogBilling) 
{
    await expect(worklog.updateWorklogFrameHeading).toBeVisible();
}

export async function clickOnUpdateButton(worklog:WorklogBilling){
    await expect(worklog.updateButton).toBeVisible();
    await clickElement(worklog.updateButton);
}

export async function verifyErrorMEssage(page:Page){
    await expect(page.getByText('Future dates not allowed')).toBeVisible();
}

export async function clickonDeletebUtton(worklog:WorklogBilling){
    await expect(worklog.deleteWorklogButton).toBeVisible();
    await clickElement(worklog.deleteWorklogButton);
}

export async function verifyConfirmationPopup(worklog:WorklogBilling){
    await expect(worklog.confirmPopupHeading).toBeVisible();
}

export async function clickOnConfirmDeleteButton(worklog:WorklogBilling){
    await expect(worklog.confirmDeleteButton).toBeVisible();
    await clickElement(worklog.confirmDeleteButton);
}

export async function verifySuccessfulyDeleteWorklogToast(page:Page){
    await verifyToast(page,worklogData.toastMessages.deleteWorklogSuccessfully);
}