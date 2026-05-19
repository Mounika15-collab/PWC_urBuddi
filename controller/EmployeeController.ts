import { Page,expect } from '@playwright/test';
import * as employeePage from '../pages/EmployeePage';
import {getSharedData} from '../utils/CommonActions'
import { GeneratedEmployee, getGenerateEmployee,downloadFile,validateEmployeeIds,getGridData } from '../utils/CommonUtils';
import { readExportedExcel,generateAndWriteEmployees, getAllEmployeeIds} from '../utils/ExcelUtils';
import testData from '../testdata/StaticData.json';
import { Employees } from '../fixtures/Fixture';
import fs from 'fs';
import path from 'path';


export interface SharedData {
  empID: string;
  email: string;
  personalEmail:string;
  password: string;
  firstname:string;
  lastname:string;
  projectName?:any;
}

export interface FullEmployee extends GeneratedEmployee {
  employeePassword: string;
  uploadFile?: string;
  role: string;
  dob: string;
  joiningDate: string;
  pastExperience:string;
  qualification: string;
  department: string;
  gender: string;
  mobileNumber: string;
  bloodgroup: string;
  designation: string;
  UANNumber:string;
  salary: string;
  location: string;
  reportingTo: string;
  certificates: string[];
}

export function getEmployeeDataFromJSON(): FullEmployee {
  const staticData = testData.employeeDetails;
  const generated: GeneratedEmployee = getGenerateEmployee(); 

  return {
    ...generated,
    employeePassword: staticData.password,
    role: staticData.role,
    dob: staticData.dob,
    joiningDate: staticData.joiningDate,
    pastExperience:staticData.pastExperience,
    qualification: staticData.qualification,
    department: staticData.department,
    gender: staticData.gender,
    mobileNumber: staticData.mobileNumber,
    bloodgroup: staticData.bloodgroup,
    designation: staticData.designation,
    UANNumber:staticData.UANNumber,
    salary: staticData.salary,
    location: staticData.location,
    reportingTo: staticData.reportingTo,
    certificates: staticData.certificates,
  };
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


export async function addEmployeeDetails(page: Page,employee:Employees,data: FullEmployee): Promise<void> 
{
  await employeePage.navigateToEmployee(page, employee);
  await employeePage.clickOnAddEmployeeButton(page, employee); 
  await employeePage.enterFirstName(employee, data);
  await employeePage.enterLastName(employee, data);
  await employeePage.enterEmployeeId(employee, data.empID);
  await employeePage.enterEmail(employee, data.email);
  await employeePage.enterPersonalEmail(employee,data.personalEmail);
  await employeePage.selectRole(employee, data.role);
  await employeePage.enterPassword(employee, data.employeePassword);
  await employeePage.enterDateOfBirth(employee, data);
  await employeePage.enterJoiningDate(employee, data);
  await employeePage.enterPastExperience(employee,data.pastExperience);
  await employeePage.selectBloodGroup(employee, data.bloodgroup);
  await employeePage.selectQualification(employee, data.qualification);
  await employeePage.enterDepartment(employee, data.department);
  await employeePage.selectGender(employee, data.gender);
  await employeePage.enterMobileNumber(employee, data.mobileNumber);
  await employeePage.enterDesignation(employee, data.designation);
  await employeePage.enterUANNumber(employee,data.UANNumber);
  await employeePage.enterSalary(employee, data.salary);
  await employeePage.enterLocation(employee, data.location);
  await employeePage.selectReportingTo(employee, data.reportingTo);
  await employeePage.clickOnAddButton(employee);
  await employeePage.verifyEmployeeCreatedToast(page);
  await writeBackToSharedData(data);
}

export async function addEmployeeWithInvalidData(page:Page,employee:Employees,data:FullEmployee):Promise<void>
{
   await employeePage.navigateToEmployee(page, employee);
  await employeePage.clickOnAddEmployeeButton(page, employee); 
  await employeePage.enterFirstName(employee, data);
  await employeePage.enterLastName(employee, data);
  await employeePage.enterInvalidEmpID(employee,data.invalidEmpID);
  await employeePage.enterInvalidEmail(employee,data.invalidEmail);
  await employeePage.enterInvalidPersonalEmail(employee,data.invalidPersonalEMail);
  await employeePage.selectRole(employee, data.role);
  await employeePage.enterInvalidPassword(employee);
  await employeePage.enterInvalidDOB(employee);
  await employeePage.enterJoiningDate(employee, data);
  await employeePage.enterPastExperience(employee,data.pastExperience);
  await employeePage.selectBloodGroup(employee, data.bloodgroup);
  await employeePage.selectQualification(employee, data.qualification);
  await employeePage.enterDepartment(employee, data.department);
  await employeePage.selectGender(employee, data.gender);
  await employeePage.enterInvalidMobileNumber(employee);
  await employeePage.enterDesignation(employee, data.designation);
   await employeePage.enterUANNumber(employee,data.UANNumber);
  await employeePage.enterSalary(employee, data.salary);
  await employeePage.enterLocation(employee, data.location);
  await employeePage.selectReportingTo(employee, data.reportingTo);
  await employeePage.clickOnAddButton(employee);
  await employeePage.verifyEmployeeCreatedSuccesToast(page);
}

export async function addEmployeeWithEmptyData(page:Page,employee:Employees){
  await employeePage.navigateToEmployee(page, employee);
  await employeePage.clickOnAddEmployeeButton(page, employee);
  await employeePage.clickOnAddButton(employee);
  await employeePage.verifyEmptyDataEmployeeFrom(employee);
  await employeePage.verifyEmployeeCreatedSuccesToast(page);
}

export async function addEmployeeWithDuplicateData(page:Page,employee:Employees,sharedData:SharedData,data:FullEmployee){
   await employeePage.navigateToEmployee(page, employee);
  await employeePage.clickOnAddEmployeeButton(page, employee); 
  await employeePage.enterFirstName(employee, data);
  await employeePage.enterLastName(employee, data);
  await employeePage.enterDuplicateEmployeeID(employee,sharedData.empID);
  await employeePage.enterDuplicateEmail(employee,sharedData.email);
  await employeePage.enterDuplicatePersonalEmail(employee,sharedData.personalEmail);
  await employeePage.selectRole(employee, data.role);
  await employeePage.enterPassword(employee, data.employeePassword);
  await employeePage.enterDateOfBirth(employee, data);
  await employeePage.enterJoiningDate(employee, data);
  await employeePage.enterPastExperience(employee,data.pastExperience);
  await employeePage.selectBloodGroup(employee, data.bloodgroup);
  await employeePage.selectQualification(employee, data.qualification);
  await employeePage.enterDepartment(employee, data.department);
  await employeePage.selectGender(employee, data.gender);
  await employeePage.enterMobileNumber(employee, data.mobileNumber);
  await employeePage.enterDesignation(employee, data.designation);
   await employeePage.enterUANNumber(employee,data.UANNumber);
  await employeePage.enterSalary(employee, data.salary);
  await employeePage.enterLocation(employee, data.location);
  await employeePage.selectReportingTo(employee, data.reportingTo);
  await employeePage.clickOnAddButton(employee);
  await employeePage.validateduplicateEmployeeErrorMessage(employee);
}

export async function updateEmployeeDetails(page: Page,employee:Employees,
  data: FullEmployee): Promise<void> {
  const sharedData=getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
  const empID=sharedData.empID;
  await employeePage.searchEmployee(page, employee,empID);
  await employeePage.clickOnEditIcon(page,employee,empID);
  await employeePage.verifyEditEmployeeFrame(employee);
  await employeePage.checkCertificates(page, employee, data.certificates);
  await employeePage.clickOnSubmitButton(employee);
  await employeePage.verifyEmployeeUpdatedToast(page);
}

export async function deleteEmployeeDetails(page: Page,employee:Employees): Promise<void> 
{
  const sharedData=getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
  const empID=sharedData.empID;
  await employeePage.searchEmployee(page, employee,empID);
  await page.waitForLoadState('networkidle');
  await employeePage.clickOnDeleteCheckBox(page, employee,empID);
  await employeePage.clickOnDeleteIcon(employee);
  await employeePage.verifyDeleteConfiramtionPopupHeading(employee);
  await employeePage.clickOnConfirmDeleteButton(employee);
  await employeePage.verifyEmployeeDeletedToast(page);
  // await page.waitForLoadState('networkidle');
  await employeePage.searchEmployee(page, employee, empID);
  const employeeRow = page.locator(`.ag-cell[col-id="id"]:has-text("${empID}")`);
  await expect(employeeRow).toHaveCount(0,{timeout:5000});
}

export async function uploadMultipleEmployeeData(page: Page,employee:Employees,jsonFilePath: string,
  sheetName: string= testData.importedEexcelData.sheetName,
  numberOfEmployees: number= testData.importedEexcelData.countofEmployees) 
{
  await generateAndWriteEmployees(jsonFilePath, sheetName, numberOfEmployees);
  const excelFilePath = path.resolve(process.cwd(),testData.importedEexcelData.uploadmultipleDataFile);
  await employeePage.navigateToEmployee(page, employee);
  await employeePage.clickOnImportExcelSheetButton(employee);
  await employeePage.uploadEmployeeFile(employee, excelFilePath);
  await employeePage.clickOnSubmitButton(employee);
  await employeePage.verifyFileUploadSuccessToast(page);  
}


export async function deleteImportedEmployeesInEmployeeList(page:Page,employee:Employees)
{
  const employeeIds = getAllEmployeeIds();
  for(const empID of employeeIds)
  {
    await employeePage.searchEmployee(page, employee,empID);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await employeePage.clickOnDeleteCheckBox(page,employee,empID);
    await employeePage.clickOnDeleteIcon(employee);
    await employeePage.verifyDeleteConfiramtionPopupHeading(employee);
    await employeePage.clickOnConfirmDeleteButton(employee);
    await employeePage.verifyEmployeeDeletedToast(page);
    await page.waitForLoadState("domcontentloaded"); 
    await page.waitForLoadState("networkidle"); 
    await employeePage.searchEmployee(page,employee,empID); 
    const employeeRow = page.locator(`.ag-cell[col-id="id"]:has-text("${empID}")`);
    await expect(employeeRow).toHaveCount(0);
  }
}

type GridColumn = { key: string; colId: string,header:string };
// export async function exportAllEmployeesData(page:Page,employee:Employees,gridColumns: GridColumn[])
// {
//     await employeePage.clickOnExportButton(employee);
//     const uiData = await getGridData(page, '.ag-row', gridColumns);
//     const filePath = await downloadFile(page, () =>
//         employeePage.clickOnAllEmployeesButton(employee)
//     );
//     const exportedData: any[] = readExportedExcel(filePath);
//     expect(exportedData.length).toBeGreaterThan(0);
//     validateEmployeeIds(exportedData, uiData);
// }

interface ExcelRow {
    [key: string]: any;
}

export async function exportAllEmployeesData(page: Page, employee: Employees, gridColumns: GridColumn[]) {
    await employeePage.navigateToEmployee(page, employee);
    
    const nextButton = page.locator('span[class="ag-icon ag-icon-next"]');
    const uiData: any[] = [];
    while (true) {
        await page.locator('.ag-row').first().waitFor({ state: 'visible', timeout: 20000 });
        
        const pageData = await getGridData(page, '.ag-row', gridColumns);
        uiData.push(...pageData);
        console.log(`Scraped page. Current total: ${uiData.length}`);

        const isVisible = await nextButton.isVisible();
        const isDisabled = await nextButton.getAttribute('aria-disabled') === 'true' || await nextButton.isDisabled();

        if (!isVisible || isDisabled) {
            console.log("Reached the last page.");
            break;
        }
        const firstIdBefore = await page.locator('.ag-row [col-id="id"]').first().textContent();
        
        await nextButton.click();
        await expect(page.locator('.ag-row [col-id="id"]').first()).not.toHaveText(firstIdBefore || '', { timeout: 15000 });
    }

    await employeePage.clickOnExportButton(employee);
    const filePath = await downloadFile(page, () => employeePage.clickOnAllEmployeesButton(employee));
    const rawExcelData = readExportedExcel(filePath) as ExcelRow[];

    if(rawExcelData.length > 0) {
        console.log("Actual Excel Headers found:", Object.keys(rawExcelData[0]));
    }

    const exportedData = rawExcelData.map((row: ExcelRow) => {
        const mappedRow: any = {};
        gridColumns.forEach(col => {
            const actualKey = Object.keys(row).find(key => key.trim().toLowerCase() === col.header.toLowerCase());
            mappedRow[col.key] = actualKey ? String(row[actualKey]).trim() : "";
        });
        return mappedRow;
    }).filter(row => row.empid !== "");

    console.log(`UI Count: ${uiData.length}, Excel Count: ${exportedData.length}`);
    for (const uiEmp of uiData) {
        const match = exportedData.find(exEmp => String(exEmp.empid) === String(uiEmp.empid));
        expect(match, `Employee ID ${uiEmp.empid} not found in Excel! Check if headers match.`).toBeDefined();
        expect(match?.name).toBe(uiEmp.name);
    }
}