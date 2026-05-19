import { Page, expect } from '@playwright/test';
import { selectDropdownOption,calculateExpectedDays } from '../utils/CommonUtils';
import testData from '../testdata/StaticData.json';
import { fillInput, clickElement, verifyToast,verifyStatus,scrollToRightAndClick } from '../utils/CommonActions';
import {LeaveManagement} from '../fixtures/Fixture';

interface DateRange {
  start: string;
  end: string;
}

interface SharedData {
  empID: string;
  email: string;
  password: string;
  appliedLeave?: DateRange;
}

export function getLeaveManagementLocators(page: Page) {
  return {
    leaveManagementMenu: page.getByText('Leave Management', { exact: true }).first(),
    applyLeaveButton: page.locator('//button[text()="Apply Leave"]'),
    lopPopup: page.getByText('LOP Warning'),
    okButton :page.locator('//*[@class="modal-content"]/.//button[text()="Ok"]'),
    fromDate: page.locator('input[placeholder="From"]'),
    toDate: page.locator('input[placeholder="To"]'),
    noOfDaysLabel: page.locator('p', { hasText: 'No of Days :' }),
    selectLead: page.locator('select[name="lead"]'),  
    subjectTextField: page.locator('input[name="subject"]'),
    reasonTextField: page.locator('textarea[name="reason"]'),
    leaveButton: page.locator('#leave'),
    workFromHomeButton: page.locator('#workFromHome'),
    submitButton: page.locator('//button[text()="Submit"]'),
    requestButton: page.locator('//button[text()="Requests"]'),
    empId: page.locator('input[aria-label="EMP ID Filter Input"]'),
    successLeaveToast: page.locator('//div[text()="Leave Applied Successfully"]'),
    successWFHToast: page.locator('//div[text()="WFH Applied Successfully"]'),
    rejectLeaveButton: page.locator('//button[text()="Reject"]'),
    rejectLeaveHeading: page.locator('//p[text()="Leave Reject"]'),
    rejectReason: page.locator('textarea.sc-jEACwC.brTKNx'),
    rejectLeaveSuccessToast: page.locator('//div[text()="Leave Rejected"]'),
    startDateFilter: page.getByLabel('START DATE Filter Input'),
    endDateFilter: page.getByLabel('END DATE Filter Input'),
    approveButton: page.locator('//button[text()="Approve"]'),
    wfhApprovedToast: page.locator('//div[text()="WFH Approved"]').first(),
    cancelButton:page.locator('//button[text()="Cancel"]'),
    leaveCancelHeading:page.locator('//p[text()="Leave Cancel"]'),
    leaveCancelReason:page.locator('textarea.sc-jEACwC.brTKNx'),
    leaveStatus:page.locator('//div[text()="Cancelled"]'),
    wfhStatus:page.locator('//div[text()="Cancelled"]'),
    initialLeaveCount:page.locator('.widget-card').filter({ hasText: 'Leaves Left' }).locator('.leave-status'),
    notificationIcon:page.locator('.notification-icon'),
    notificationText:page.locator('.notification-item p').first(),
    allHistoryCategory:page.locator('//button[text()="All History"]'),
    exportButtonInAllHistory:page.locator('//button[text()="Export"]'),
    summaryCategory:page.locator('//button[text()="Summary"]'),
    empIDFieldInHistory:page.locator('input[aria-label="EMP ID Filter Input"]'),
  };
}
                
export async function clickLeaveManagementMenu(page: Page,leaveManagement:LeaveManagement) {
  await leaveManagement.leaveManagementMenu.waitFor({ state: 'visible' });
  await clickElement(leaveManagement.leaveManagementMenu);
  await expect(page).toHaveURL(/leave_management/);
}

export async function clickApplyLeaveButton(leaveManagement:LeaveManagement) {
  await clickElement(leaveManagement.applyLeaveButton);
}

export async function verifyLOPConfirmationPopup(leaveManagement:LeaveManagement): Promise<void> {
  if (await leaveManagement.lopPopup.isVisible()) {
    await clickElement(leaveManagement.okButton);
  }
}

export async function clickLeaveButton(leaveManagement:LeaveManagement) {
  await clickElement(leaveManagement.leaveButton);
}

export async function clickWorkFromHomeButton(leaveManagement:LeaveManagement) {
  await clickElement(leaveManagement.workFromHomeButton);
}

export async function enterLeaveDates(leaveManagement:LeaveManagement, from: string, to: string) {
  await fillInput(leaveManagement.fromDate,from);
  await fillInput(leaveManagement.toDate,to);

}

export async function getCalculatedDaysOnUI(leaveManagement:LeaveManagement): Promise<string> {
  await leaveManagement.noOfDaysLabel.waitFor({ state: 'visible' });
  const fullText = await leaveManagement.noOfDaysLabel.innerText();
  return fullText.split(':')[1]?.trim() ?? '';
}

export async function selectLeadDropdown(leaveManagement:LeaveManagement) {
  await selectDropdownOption(leaveManagement.selectLead, testData.employeeDetails.reportingTo);
}

export async function enterLeaveDetails(leaveManagement:LeaveManagement) {
  await fillInput(leaveManagement.subjectTextField,testData.leaveData.subject);
  await fillInput(leaveManagement.reasonTextField,testData.leaveData.leaveReason);
}

export async function enterWorkFromHomeDetails(leaveManagement:LeaveManagement) 
{
  await fillInput(leaveManagement.subjectTextField,testData.leaveData.subject);
  await fillInput(leaveManagement.reasonTextField,testData.leaveData.leaveReason);
}

export async function clickSubmitButton(leaveManagement:LeaveManagement) {
  await leaveManagement.submitButton.waitFor({state: 'visible',timeout:10000});
  await expect(leaveManagement.submitButton).toBeEnabled();
  await clickElement(leaveManagement.submitButton);
}

export async function clickCancelButton(leaveManagement:LeaveManagement){
  await clickElement(leaveManagement.cancelButton);
}

export async function enterCancelReason(leaveManagement:LeaveManagement){
  await expect(leaveManagement.leaveCancelHeading).toBeVisible();
  await fillInput(leaveManagement.leaveCancelReason,testData.leaveData.cancelLeave);
}

export async function verifyLeaveCancelToast(page:Page){
  await verifyToast(page,testData.toastMessages.cancelAppliedLeave);
}

export async function verifyLeaveCancelInViewList(leaveManagement:LeaveManagement){
  await verifyStatus(leaveManagement.leaveStatus,testData.leaveData.status.leave.cancelled);
}

export async function verifyLeaveApprovedInViewList(leaveManagement:LeaveManagement){
  await verifyStatus(leaveManagement.leaveStatus,testData.leaveData.status.leave.approved);
}

export async function verifyWFHCancelToast(page:Page){
  await verifyToast(page,testData.toastMessages.cancelAppliedWFH);
}

export async function verifyWFHCancelInViewList(leaveManagement:LeaveManagement){
  await verifyStatus(leaveManagement.wfhStatus,testData.workFromHomeData.status.wfh.cancelled);
}

export async function verifyLeaveSuccessToast(page: Page) {
  await verifyToast(page,testData.toastMessages.applyLeaveSuccess);
}

export async function verifyWFHSuccessToast(page: Page) {
  await verifyToast(page,testData.toastMessages.applyWFHSuccess);

}

export async function clickRequestButton(leaveManagement:LeaveManagement) {
  await leaveManagement.requestButton.waitFor({state:'visible'});
  await clickElement(leaveManagement.requestButton);
}

export async function searchEmployee(leaveManagement:LeaveManagement, empID:string) {

  await leaveManagement.empId.waitFor({state:'visible'});
  await fillInput(leaveManagement.empId,empID);
}

export async function scrollToRightAndReject(page: Page,leaveManagement:LeaveManagement): Promise<void> {
   await scrollToRightAndClick(page,leaveManagement.rejectLeaveButton.first());
}

export async function rejectLeave(page: Page,leaveManagement:LeaveManagement) {
  await leaveManagement.rejectLeaveHeading.waitFor({ state: 'visible' });
  await fillInput(leaveManagement.rejectReason,testData.leaveData.rejectLeave);
  await clickElement(leaveManagement.submitButton);
  await verifyToast(page,testData.toastMessages.rejectLeave);
}

export async function rejectWorkFromHome(page: Page,leaveManagement:LeaveManagement) {
  await leaveManagement.rejectLeaveHeading.waitFor({ state: 'visible' });
  await fillInput(leaveManagement.rejectReason,testData.leaveData.rejectLeave);
  await clickElement(leaveManagement.submitButton);
  await verifyToast(page,testData.toastMessages.rejectWFH);
}

export async function scrollToRightAndApproveWorkFromHome(page: Page,leaveManagement:LeaveManagement): Promise<void> {
   await scrollToRightAndClick(page,leaveManagement.approveButton.first());
}

export async function scrollToRightAndCancelLeave(page: Page,leaveManagement:LeaveManagement): Promise<void> {
  await scrollToRightAndClick(page,leaveManagement.cancelButton.first());
}

export async function getInitialLeaveCount(leaveManagement:LeaveManagement)
{
  const initialLeaveCount = Number(await leaveManagement.initialLeaveCount.innerText());
  return initialLeaveCount;
}

export async function verifyApprovedWFHToast(page:Page)
{
  await verifyToast(page,testData.toastMessages.approveWFHSuccess);
}

export async function validateLeaveCount(page:Page,dateRange:DateRange,initialLeaveCount: number,leaveManagement:LeaveManagement){
  
  const appliedLeaveCount=Number(calculateExpectedDays(dateRange.start, dateRange.end));
  await page.waitForLoadState("domcontentloaded");
  await expect(leaveManagement.initialLeaveCount).not.toHaveText(initialLeaveCount.toString());
  const updatedLeaveCount = Number(await leaveManagement.initialLeaveCount.innerText());
  const expectedLeaveCount = initialLeaveCount - appliedLeaveCount;
  expect(updatedLeaveCount).toBe(expectedLeaveCount);
}

export async function verifyApprovedLeaveToast(page:Page)
{
  await verifyToast(page,testData.toastMessages.approveLeaveSuccess);
}

export async function clickNotificationIcon(leaveManagement:LeaveManagement)
{
  await clickElement(leaveManagement.notificationIcon);
}

export async function navigateToLeaveOverview(leaveManagement: LeaveManagement) {
  await expect(leaveManagement.leaveManagementMenu).toBeVisible({ timeout: 15000 });
  await clickElement(leaveManagement.leaveManagementMenu);
}

export async function searchEmployeeInHistory(page: Page,leaveManagement: LeaveManagement,employeeId: string){
  await expect(leaveManagement.empIDFieldInHistory).toBeVisible({timeout:15000});
  await page.waitForLoadState("networkidle");
  await fillInput(leaveManagement.empIDFieldInHistory,employeeId);
  await page.keyboard.press('Enter');
}

export async function clickOnExportButton(leaveManagement: LeaveManagement){
  await expect(leaveManagement.exportButtonInAllHistory).toBeVisible();
  await clickElement(leaveManagement.exportButtonInAllHistory);
}

export async function clickOnSummaryCategory(leaveManagement: LeaveManagement){
  await expect(leaveManagement.summaryCategory).toBeVisible();
  await clickElement(leaveManagement.summaryCategory);
}

export async function clickOnAllHistoryCategory(leaveManagement:LeaveManagement){
  await expect(leaveManagement.allHistoryCategory).toBeVisible();
  await clickElement(leaveManagement.allHistoryCategory);
}

