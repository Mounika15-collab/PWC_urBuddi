import { Page, expect } from "@playwright/test";
import {LeaveManagement,Employees,Dashboard} from "../fixtures/Fixture";
import {deleteImportedEmployeesInEmployeeList,uploadMultipleEmployeeData} from "../controller/EmployeeController";
import testData from "../testdata/StaticData.json";
import { updateSharedData } from "../utils/CommonActions";
import {getEmployeesFromExcel,readExportedExcel} from "../utils/ExcelUtils";
import * as employeePage from "../pages/EmployeePage";
import * as leaveManagementPage from "../pages/LeaveManagementPage";
import { applyLeave,DateRange,loginWithExcelData,loginAsAdmin} from "../controller/LeaveManagementController";



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
  await leaveManagementPage.navigateToLeaveOverview(leaveManagement);
  await leaveManagementPage.clickOnSummaryCategory(leaveManagement);

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    leaveManagementPage.clickOnExportButton(leaveManagement)
  ]);

  const fileName = await download.suggestedFilename();
  const filePath = `downloads/${fileName}`;

  await download.saveAs(filePath);

  const exportedData: any[] = readExportedExcel(filePath);
  expect(exportedData.length).toBeGreaterThan(0);

  const exportedIDs = exportedData.map((e) =>
    String(e["Employee Id"] ?? e["Employee ID"] ?? "").trim()
  );

  for (const emp of employees) 
  {
    const expectedID = String(emp.ID).trim();

    expect(exportedIDs).toContain(expectedID);
  }

  await employeePage.navigateToEmployee(page, employee);
  await deleteImportedEmployeesInEmployeeList(page, employee);
  }