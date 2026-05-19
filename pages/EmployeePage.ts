import { Page, expect } from '@playwright/test';
import { fillInput, clickElement,verifyToast, verifyToastMessage, getTodayDate,getErrorCount } from '../utils/CommonActions';
import { selectDropdownOption, handleCheckboxes } from '../utils/CommonUtils';
import testData from '../testdata/StaticData.json';
import path from 'path';
import { GeneratedEmployee } from '../utils/CommonUtils';
import { Employees } from '../fixtures/Fixture';
 
export function getEmployeeLocators(page: Page) {
  return {
    employeesMenu: page.getByText('Employees', { exact: true }).first(),
    addEmployeeButton: page.getByText('Add Employee'),
    firstNameField: page.locator('input[name="firstName"]'),
    lastNameField: page.locator('input[name="lastName"]'),
    employeeIdField: page.locator('#employeeID'),
    emailField: page.locator('input[name="email"]'),
    personalEmailField:page.locator('//input[@name="personalEmail"]'),
    roleDropdown: page.locator('#role'),
    passwordField: page.locator('input[name="password"]'),
    dobField: page.locator('input[name="dob"]'),
    joiningDate: page.locator('input[name="joiningDate"]'),
    pastExperienceField:page.locator('//input[@name="pastExperience"]'),
    qualificationsDropdown: page.locator('#qualifications'),
    departmentField: page.locator('input[name="department"]'),
    genderDropdown: page.locator('#gender'),
    mobileNumberField: page.locator('input[name="mobileNumber"]'),
    bloodgroupDropdown: page.locator('#bloodGroup'),
    designationField: page.locator('input[name="designation"]'),
    UANField:page.locator('input[name="uan"]'),
    salaryField: page.locator('#salary'),
    locationField: page.locator('input[name="location"]'),
    reportingToDropdown: page.locator('#reportingTo'),
    addButton: page.locator('button[type="submit"]'),
    submitButton: page.locator('//button[text()="Submit"]'),
    searchEmpIdField: page.locator('input[aria-label="EMP ID Filter Input"]'),
    editIcon: '//*[text()="employeeId"]/ancestor::*[@role="rowgroup"]//input/ancestor::*[@role="gridcell"]/following-sibling::*[1]/div',
    editEmployeeFrameHeading:page.locator('//p[text()="Edit Employee"]/..'),
    certificateDropdown: page.getByRole('button', { name: 'Certificates' }),
    rowCheckBox: '//*[text()="employeeId"]/../../..//input/..',
    deleteIcon: page.locator('button[class="deleteIcon"]'),
    confimationPopupHeading:page.locator('//p[text()="Confirm Delete"]/..'),
    confirmDelete:page.locator('//button[text()="Yes"]'),
    importExcelSheetButton: page.locator('//button[text()="Import Excel Sheet"]'),
    fileInput: page.locator('input[type="file"]'),
    duplicateEmployeeErrorMessage:page.locator('//p[text()="Employee with ID or Email already exists."]'),
    errorFields:page.locator('[style*="border-left: 10px solid red"]'),
    exportButton:page.locator('//button[text()="Export Data"]/..'),
    allEmployeesButton:page.locator('//button[text()="All Employees"]/..'),
    activeEmployeesButton:page.locator('//button[text()="Active Employees"]/..'),
    releasedEmployeesButton:page.locator('//button[text()="Released Employees"]/..')
  };
}

export async function navigateToEmployee(page: Page, employee:Employees) {
  await page.waitForLoadState('domcontentloaded');
  await employee.employeesMenu.waitFor({ state: 'visible', timeout: 10000 });
  await expect(employee.employeesMenu).toBeVisible();
  await clickElement(employee.employeesMenu);
  await expect(page).toHaveURL(/allemployees/);
}

export async function clickOnAddEmployeeButton(page: Page, employee:Employees) {
  await employee.addEmployeeButton.waitFor({ state: 'visible' });
  await expect(employee.addEmployeeButton).toBeVisible();
  await clickElement(employee.addEmployeeButton);
  await page.locator('p', { hasText: 'Add Employee' }).waitFor({ state: 'visible' });
}

export async function enterFirstName( employee:Employees, employeedata: GeneratedEmployee) {
   await expect( employee.firstNameField).toBeVisible();
  await fillInput( employee.firstNameField,employeedata.firstname);
}

export async function enterLastName(  employee:Employees, employeedata: GeneratedEmployee) {
  await expect( employee.lastNameField).toBeVisible(); 
  await fillInput( employee.lastNameField,employeedata.lastname);
}

export async function enterEmployeeId( employee:Employees, empID: string) {
  await expect( employee.employeeIdField).toBeVisible();
  await fillInput( employee.employeeIdField,empID);
}

export async function enterDuplicateEmployeeID( employee:Employees,duplicateEmpID:string){
  await expect( employee.employeeIdField).toBeVisible();
  await fillInput( employee.employeeIdField,duplicateEmpID);
}

export async function enterInvalidEmpID( employee:Employees,invalidEmployeeID:string){
  await expect( employee.employeeIdField).toBeVisible();
  await fillInput( employee.employeeIdField,invalidEmployeeID);
}

export async function enterEmail( employee:Employees, email: string) {
  await expect( employee.emailField).toBeVisible();
  await fillInput( employee.emailField,email);
}

export async function enterPersonalEmail( employee:Employees, email: string){
  await expect( employee.personalEmailField).toBeVisible();
  await fillInput( employee.personalEmailField,email);
}

export async function enterInvalidEmail( employee:Employees,invalidEmail:string){
  await expect( employee.emailField).toBeVisible();
  await fillInput( employee.emailField,invalidEmail);
}

export async function enterInvalidPersonalEmail( employee:Employees,invalidEmail:string){
  await expect( employee.personalEmailField).toBeVisible();
  await fillInput( employee.personalEmailField,invalidEmail);
}

export async function enterDuplicateEmail( employee:Employees, duplicateEmail:string){
   await expect( employee.emailField).toBeVisible();
  await fillInput( employee.emailField,duplicateEmail); 
}

export async function enterDuplicatePersonalEmail( employee:Employees, duplicateEmail:string){
   await expect( employee.personalEmailField).toBeVisible();
  await fillInput( employee.personalEmailField,duplicateEmail); 
}

export async function enterPassword( employee:Employees, password: string) {
   await expect( employee.passwordField).toBeVisible();
  await fillInput( employee.passwordField,password);
}

export async function enterInvalidPassword( employee:Employees)
{
  await expect( employee.passwordField).toBeVisible();
  await fillInput( employee.passwordField,testData.invalidEmployeeDetails.invalidPassword);
}

export async function selectRole( employee:Employees, role: string) {
   await expect( employee.roleDropdown).toBeVisible();
  await selectDropdownOption( employee.roleDropdown, role);
}

export async function enterDateOfBirth( employee:Employees, employeedata: any) {
   await expect( employee.dobField).toBeVisible();
  await fillInput( employee.dobField,employeedata.dob);
}

export async function enterInvalidDOB( employee:Employees){
  await expect( employee.dobField).toBeVisible();
  const today=getTodayDate();
  await fillInput( employee.dobField,today);
}

export async function enterJoiningDate( employee:Employees, employeedata: any) {
   await expect( employee.joiningDate).toBeVisible();
  await fillInput( employee.joiningDate,employeedata.joiningDate);  
}

export async function enterPastExperience(employee:Employees,pastExperience: string){
  await expect(employee.pastExperienceField).toBeVisible();
  await fillInput(employee.pastExperienceField,pastExperience);
}

export async function selectBloodGroup( employee:Employees, bloodgroup: string) {
   await expect(employee.bloodgroupDropdown).toBeVisible();
  await selectDropdownOption(employee.bloodgroupDropdown, bloodgroup);
}

export async function selectQualification(employee:Employees, qualification: string) {
   await expect(employee.qualificationsDropdown).toBeVisible();
  await selectDropdownOption(employee.qualificationsDropdown, qualification);
}

export async function enterDepartment(employee:Employees, department: string) {
   await expect(employee.departmentField).toBeVisible();
  await fillInput(employee.departmentField,department);
}

export async function selectGender( employee:Employees, gender: string) {
   await expect(employee.genderDropdown).toBeVisible();
  await selectDropdownOption(employee.genderDropdown, gender);
}

export async function enterMobileNumber( employee:Employees, mobileNumber: string) {
   await expect(employee.mobileNumberField).toBeVisible();
  await fillInput(employee.mobileNumberField,mobileNumber);
}

export async function enterInvalidMobileNumber(employee:Employees){
  await expect(employee.mobileNumberField).toBeVisible();
  await fillInput(employee.mobileNumberField,testData.invalidEmployeeDetails.invalidMobileNumber);
}

export async function enterDesignation(employee:Employees, designation: string) {
  await expect(employee.designationField).toBeVisible();
  await fillInput(employee.designationField,designation);
}

export async function enterUANNumber(employee:Employees,UANNumber:string){
  await expect(employee.UANField).toBeVisible();
  await fillInput(employee.UANField,UANNumber);
}
export async function enterSalary(employee:Employees, salary: string) {
   await expect(employee.salaryField).toBeVisible();
  await fillInput(employee.salaryField,salary);
}

export async function enterLocation( employee:Employees, location: string) {
  await expect(employee.locationField).toBeVisible();
  await fillInput(employee.locationField,location);
}

export async function selectReportingTo(employee:Employees, reportingTo: string) {
  await expect(employee.reportingToDropdown).toBeVisible();
  await employee.reportingToDropdown.selectOption({ label: reportingTo });
}

export async function clickOnAddButton(employee:Employees) {
  await expect(employee.addButton).toBeVisible();
  await clickElement(employee.addButton);
}

export async function verifyEmployeeCreatedToast(page: Page) {
  await verifyToast(page,testData.toastMessages.createSuccess);
}

export async function verifyEmployeeCreatedSuccesToast(page:Page){
  await verifyToastMessage(page,testData.toastMessages.createSuccess);
}

export async function validateduplicateEmployeeErrorMessage(employee:Employees){
  await expect(employee.duplicateEmployeeErrorMessage).toBeVisible();
}

export async function searchEmployee(page: Page,employee:Employees,employeeId: string){
  await expect(employee.searchEmpIdField).toBeVisible({timeout:15000});
  await page.waitForLoadState("networkidle");
  await fillInput(employee.searchEmpIdField,employeeId);
  await page.keyboard.press('Enter');
}

export async function clickOnEditIcon(page: Page,employee:Employees,employeeId: string) {

  let editButton = page.locator(employee.editIcon.replace("employeeId",employeeId)).first();
  await expect(editButton).toBeVisible();
  await clickElement(editButton);
}

export async function verifyEditEmployeeFrame(employee:Employees){
  await expect(employee.editEmployeeFrameHeading).toBeVisible({timeout:5000});
}

export async function checkCertificates(page: Page, employee:Employees, certificates: string[] = []) {
  await expect(employee.certificateDropdown).toBeVisible();
  await clickElement(employee.certificateDropdown);
  await handleCheckboxes(page, certificates);
}

export async function clickOnSubmitButton( employee:Employees) {
  await expect(employee.submitButton).toBeVisible();
  await clickElement(employee.submitButton);
}

export async function verifyEmployeeUpdatedToast(page: Page) {
  await verifyToast(page,testData.toastMessages.updateSuccess);
}

export async function clickOnDeleteCheckBox(page: Page,employee:Employees,employeeId: string){
  let deleteButton = page.locator(employee.rowCheckBox.replace("employeeId",employeeId))
  await expect(deleteButton).toBeVisible();
  await clickElement(deleteButton);
}

export async function clickOnDeleteIcon(employee:Employees) {
  await employee.deleteIcon.waitFor({state:'visible',timeout: 10000 })
  await expect(employee.deleteIcon).toBeVisible();
  await clickElement(employee.deleteIcon);
}

export async function verifyDeleteConfiramtionPopupHeading(employee:Employees){
  await expect(employee.confimationPopupHeading).toBeVisible();
}

export async function clickOnConfirmDeleteButton(employee:Employees){
  await expect(employee.confirmDelete).toBeVisible();
  await clickElement(employee.confirmDelete);
}

export async function verifyEmployeeDeletedToast(page:Page){
  await verifyToast(page,testData.toastMessages.deleteSuccess);
}

export async function clickOnImportExcelSheetButton( employee:Employees) {
  await expect(employee.importExcelSheetButton).toBeVisible();
  await clickElement(employee.importExcelSheetButton);
}

export async function uploadEmployeeFile( employee:Employees, filePath: string) 
{
  await employee.fileInput.setInputFiles(path.resolve(filePath));
}

export async function verifyFileUploadSuccessToast(page:Page)
{
  await verifyToast(page,testData.toastMessages.fileUploadSuccess);
}

export async function verifyEmptyDataEmployeeFrom(employee:Employees){
  const count = await getErrorCount(employee.errorFields);
  await expect(count).toBe(19);
}

export async function clickOnExportButton(employee:Employees){
  await expect(employee.exportButton).toBeVisible();
  await clickElement(employee.exportButton);
}

export async function clickOnAllEmployeesButton(employee:Employees){
  await expect(employee.allEmployeesButton).toBeVisible();
  await clickElement(employee.allEmployeesButton);
}

export async function clickOnActiveEmployeesButton(employee:Employees){
  await expect(employee.activeEmployeesButton).toBeVisible();
  await clickElement(employee.activeEmployeesButton);
}

export async function clickOnReleasedEmployeesButton(employee:Employees){
  await expect(employee.releasedEmployeesButton).toBeVisible();
  await clickElement(employee.releasedEmployeesButton);
}