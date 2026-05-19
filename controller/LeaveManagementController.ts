import { Page, expect } from '@playwright/test';
import * as leavePage from '../pages/LeaveManagementPage';
import { calculateExpectedDays,downloadFile,validateEmployeeIds } from '../utils/CommonUtils';
import * as loginPage from '../pages/LoginPage';
import * as menuPage from '../pages/DashboardPage';
import testData from '../testdata/StaticData.json';
import * as employeeController from '../controller/EmployeeController';
import {deleteImportedEmployeesInEmployeeList,uploadMultipleEmployeeData} from "../controller/EmployeeController";
import { updateSharedData } from "../utils/CommonActions";
import {getEmployeesFromExcel,readExportedExcel} from "../utils/ExcelUtils";
import * as employeePage from "../pages/EmployeePage";
import { Dashboard,LeaveManagement,Employees } from '../fixtures/Fixture';
import { getSharedData } from '../utils/CommonActions';
import fs from 'fs';
import path from 'path';

export interface DateRange {
  start: string;
  end: string;
}

interface LoginData {
  url: string;
  username: string;
  password: string;
}


export interface SharedData {
  empID: string;
  email: string;
  password: string;
  firstname:string;
  lastname:string;
}

function getAdminLoginData(): LoginData {
  const relativepath=testData.employeeDetails.employeeDataJsonFile;
  const filePath = path.join(process.cwd(), relativepath);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(rawData);

  return parsed.login_Data;
}

export async function loginWithNewUser(page:Page,dashboard:Dashboard){
  const sharedData=getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
    if (!sharedData.email || !sharedData.password) {
    throw new Error('Email or password missing in SharedData');
  }
  await page.goto('/');
  await menuPage.clickOnLogOutMenu(page,dashboard);
  await menuPage.clickOnConfirmButton(dashboard)
  await expect(page).toHaveURL(/login/);
  await page.waitForLoadState("networkidle");
  await loginPage.enterUserName(page, sharedData.email);
  await loginPage.enterPassword(page, sharedData.password);
  await loginPage.clickOnLoginButton(page);
}

export async function loginWithExcelData(page:Page,dashboard:Dashboard,email: string,password: string){
  if (!email || !password) {
    throw new Error('Email or password is missing');
  }
  await page.goto('/');
  await menuPage.clickOnLogOutMenu(page,dashboard);
  await menuPage.clickOnConfirmButton(dashboard)
  await expect(page).toHaveURL(/login/);
  await page.waitForLoadState('domcontentloaded');
  await loginPage.enterUserName(page, email);
  await loginPage.enterPassword(page, password);
  await loginPage.clickOnLoginButton(page);
}


export async function applyLeave(page: Page,dateRange: DateRange,leaveManagement:LeaveManagement): Promise<number> {
  await leavePage.clickLeaveManagementMenu(page,leaveManagement);
  await leavePage.clickApplyLeaveButton(leaveManagement);
  await leavePage.verifyLOPConfirmationPopup(leaveManagement);
  await leavePage.enterLeaveDates(leaveManagement, dateRange.start, dateRange.end);
  const expectedDays = calculateExpectedDays(dateRange.start, dateRange.end);
  const actualDays = await leavePage.getCalculatedDaysOnUI(leaveManagement);
  if (actualDays === '0') {
    throw new Error('Dates already applied.');
  }
  if (actualDays !== expectedDays) {
    throw new Error(`Expected ${expectedDays} days but got ${actualDays}`);
  }
  await leavePage.selectLeadDropdown(leaveManagement);
  await leavePage.enterLeaveDetails(leaveManagement);
  await leavePage.clickLeaveButton(leaveManagement);
  await leavePage.clickSubmitButton(leaveManagement);
  await leavePage.verifyLeaveSuccessToast(page);
  // storeAppliedLeave( dateRange.start, dateRange.end)

  return Number(expectedDays);
}


export async function applyWorkFromHome(page: Page,dateRange: DateRange,leaveManagement:LeaveManagement): Promise<number> {
  await leavePage.clickLeaveManagementMenu(page,leaveManagement);
  await leavePage.clickApplyLeaveButton(leaveManagement);
  await leavePage.verifyLOPConfirmationPopup(leaveManagement);
  await leavePage.enterLeaveDates(leaveManagement, dateRange.start, dateRange.end);
  const expectedDays = calculateExpectedDays(dateRange.start, dateRange.end);
  const actualDays = await leavePage.getCalculatedDaysOnUI(leaveManagement);
  if (actualDays === '0') {
    throw new Error('Dates already applied.');
  }
  if (actualDays !== expectedDays) {
    throw new Error(`Expected ${expectedDays} days but got ${actualDays}`);
  }
  await leavePage.selectLeadDropdown(leaveManagement);
  await leavePage.enterWorkFromHomeDetails(leaveManagement);
  await leavePage.clickWorkFromHomeButton(leaveManagement);
  await leavePage.clickSubmitButton(leaveManagement);
  await leavePage.verifyWFHSuccessToast(page);

  return Number(expectedDays);
}


export async function loginAsAdmin(page: Page,dashboard:Dashboard): Promise<void> {

  const loginData = getAdminLoginData();
  await menuPage.clickOnLogOutMenu(page,dashboard);
  await menuPage.clickOnConfirmButton(dashboard);
  await expect(page).toHaveURL(/login/);
  await loginPage.enterUserName(page, loginData.username);
  await loginPage.enterPassword(page, loginData.password);
  await loginPage.clickOnLoginButton(page);
  await expect(page).not.toHaveURL(/login/);
}


export async function rejectAppliedLeave(page: Page,dashboard:Dashboard,leaveManagement:LeaveManagement): Promise<void> {
  const sharedData = getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
  const empID=sharedData.empID;
  await loginAsAdmin(page,dashboard);
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await leavePage.clickLeaveManagementMenu(page,leaveManagement);
  await leavePage.clickRequestButton(leaveManagement);
  await leavePage.searchEmployee(leaveManagement,empID);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);
  await leavePage.scrollToRightAndReject(page,leaveManagement);
  await leavePage.rejectLeave(page,leaveManagement);
}


export async function approveAppliedLeave(page:Page,dashboard:Dashboard,leaveManagement:LeaveManagement):Promise<void>{
  const sharedData=getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
  const empID=sharedData.empID;
  await loginAsAdmin(page,dashboard);
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await leavePage.clickLeaveManagementMenu(page,leaveManagement);
  await leavePage.clickRequestButton(leaveManagement);
  await leavePage.searchEmployee(leaveManagement,empID);
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle");
  await leavePage.scrollToRightAndApproveWorkFromHome(page,leaveManagement); 
  await page.waitForLoadState("networkidle"); 
  await leavePage.verifyApprovedLeaveToast(page);
}


export async function approveAppliedWorkFromHome(page:Page,dashboard:Dashboard,leaveManagement:LeaveManagement):Promise<void>{
  
    const sharedData = getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
    const empID=sharedData.empID;
    await loginAsAdmin(page,dashboard);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await leavePage.clickLeaveManagementMenu(page,leaveManagement);
    await leavePage.clickRequestButton(leaveManagement);
    await leavePage.searchEmployee(leaveManagement,empID);
    await leavePage.scrollToRightAndApproveWorkFromHome(page,leaveManagement);
    await leavePage.verifyApprovedWFHToast(page);
}


export async function rejectAppliedWorkFromHome(page:Page,dashboard:Dashboard,leaveManagement:LeaveManagement):Promise<void>{  
    const sharedData = getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
    const empID=sharedData.empID;
    await loginAsAdmin(page,dashboard);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await leavePage.clickLeaveManagementMenu(page,leaveManagement);
    await leavePage.clickRequestButton(leaveManagement);
    await leavePage.searchEmployee(leaveManagement,empID);
    await leavePage.scrollToRightAndReject(page,leaveManagement);
    await leavePage.rejectWorkFromHome(page,leaveManagement);
}


export async function deleteEmployeeAfterApplyLeaveOrWorkFromHome(page:Page,dashboard:Dashboard,employee:Employees):Promise<void>{
  await loginAsAdmin(page,dashboard);
  await employeePage.navigateToEmployee(page,employee); 
  await employeeController.deleteEmployeeDetails(page, employee);
  
}

export async function deleteEmployeeAfterRejectingLeaveOrWorkFromHome(page:Page,employee:Employees):Promise<void>{
  await employeePage.navigateToEmployee(page,employee); 
  await await employeeController.deleteEmployeeDetails(page, employee);
}


export async function deleteEmployeeAfterApprovingWorkFromHomeOrLeave(page:Page,employee:Employees):Promise<void>{
  await employeePage.navigateToEmployee(page,employee); 
  await employeeController.deleteEmployeeDetails(page, employee);
}


export async function cancelAppliedLeave(page:Page,leaveManagement:LeaveManagement):Promise<void>{
  await leavePage.scrollToRightAndCancelLeave(page,leaveManagement);
  await leavePage.enterCancelReason(leaveManagement);
  await leavePage.clickSubmitButton(leaveManagement);
  await leavePage.verifyLeaveCancelToast(page);
  // await LeavePage.verifyLeaveCancelInViewList(leaveManagement)
}


export async function cancelAppliedWorkFromHome(page:Page,leaveManagement:LeaveManagement):Promise<void>
{
  await leavePage.scrollToRightAndCancelLeave(page,leaveManagement);
  await leavePage.enterCancelReason(leaveManagement);
  await leavePage.clickSubmitButton(leaveManagement);
  await leavePage.verifyWFHCancelToast(page);
  // await LeavePage.verifyWFHCancelInViewList(leaveManagement);
}


export async function verifyLeaveCountAfterApprovingLeave(page:Page,sharedData:SharedData,initialLeaveCount: number,
  dateRange:DateRange,dashboard:Dashboard,leaveManagement:LeaveManagement)
{
   await loginWithNewUser(page,dashboard);
   await leavePage.clickLeaveManagementMenu(page,leaveManagement); 
   await page.reload();
   await page.waitForLoadState("domcontentloaded");
   await page.waitForLoadState("networkidle");  
   await leavePage.validateLeaveCount(page,dateRange,initialLeaveCount,leaveManagement);
}

export async function validateLeaveNotification(page: Page,sharedData: SharedData,expectedDays: number,leaveManagement:LeaveManagement) {

  await leavePage.clickNotificationIcon(leaveManagement);
  await expect(leaveManagement.notificationText).toBeVisible();
  const text = await leaveManagement.notificationText.innerText();
  const match = text.match(testData.notificationTexts.requestLeave);

  const actualName = match?.[1];
  const actualDays = Number(match?.[2]);
  const expectedName = `${sharedData.firstname} ${sharedData.lastname}`;
  expect(actualName).toBe(expectedName);
  expect(actualDays).toBe(expectedDays);
}

export async function exportDataInHistory(page: Page,leaveManagement: LeaveManagement,employee: Employees,
  dateRange: DateRange,dashboard: Dashboard) {
  const jsonFilePath = testData.employeeDetails.employeeDataJsonFile;
  await uploadMultipleEmployeeData(page, employee, jsonFilePath);
  const employees = getEmployeesFromExcel();
  for (const emp of employees) {
    await loginWithExcelData(page, dashboard, emp.Email, emp.Password);
    await applyLeave(page, dateRange, leaveManagement);
    updateSharedData( "employeeDetails",{empID: emp.ID,email: emp.Email,password: emp.Password},testData.employeeDetails.sharedEmployeeJsonFile);
  }
  await loginAsAdmin(page, dashboard);
  await leavePage.clickLeaveManagementMenu(page,leaveManagement);
  await leavePage.clickOnAllHistoryCategory(leaveManagement);
  const filePath = await downloadFile(page, () =>
    leavePage.clickOnExportButton(leaveManagement)
  );
  const exportedData: any[] = readExportedExcel(filePath);
  expect(exportedData.length).toBeGreaterThan(0);
  validateEmployeeIds(exportedData, employees);
}

export async function exportDataInSummary(page: Page,leaveManagement: LeaveManagement,employee: Employees,
  dateRange: DateRange,dashboard: Dashboard){
    const jsonFilePath = testData.employeeDetails.employeeDataJsonFile;
  await uploadMultipleEmployeeData(page, employee, jsonFilePath);

  const employees = getEmployeesFromExcel();
  for (const emp of employees) {
    await loginWithExcelData(page, dashboard, emp.Email, emp.Password);
    await applyLeave(page, dateRange, leaveManagement);
    updateSharedData( "employeeDetails",{empID: emp.ID,email: emp.Email,password: emp.Password},testData.employeeDetails.sharedEmployeeJsonFile);
  }

  await loginAsAdmin(page, dashboard);
  await leavePage.clickLeaveManagementMenu(page,leaveManagement);
  await leavePage.clickOnSummaryCategory(leaveManagement);

  const filePath = await downloadFile(page, () =>
    leavePage.clickOnExportButton(leaveManagement)
  );
  const exportedData: any[] = readExportedExcel(filePath);
  expect(exportedData.length).toBeGreaterThan(0);
  validateEmployeeIds(exportedData, employees);
}