import test, { Page,expect } from "@playwright/test";
import { clickElement, fillInput, getTodayDate, verifyToast } from "../utils/CommonActions";
import { selectDropdownOption,generateUniqueDates,selectDropdownValue } from "../utils/CommonUtils";
import testData from '../testdata/StaticData.json';
import { scrollToRightAndClick,getCreatedEmployeeDetails,getErrorCount,updateSharedData,getSharedData} from '../utils/CommonActions';
import {faker} from '@faker-js/faker';
import { ProjectBilling} from '../fixtures/Fixture';


export function getProjectBillingLocators(page:Page){
    return{
        billingMenu: page.locator('//p[text()="Billing"]'),
        projects:page.locator('//p[text()="Projects"]').first(),
        addProjectButton:page.locator('//button[text()="Add Project"]'),
        addProjectFrameHeading:page.locator('//p[text()="Add Project"]'),
        selectClientDropdown:page.locator('select[name="client_id"]'),
        projectNameTextfield:page.getByPlaceholder('Enter Project Name'),
        ModuleNameTextfield:page.getByPlaceholder('Enter Module Name'),
        startDateTextfield:page.locator('input[name="start_date"]'),
        selectProjectLeadFromDropdown:page.locator('select[name="lead_email"]'),
        selectProjectStatusDropdown:page.locator('select[name="status"]'),
        selectCurrencyDropdown:page.locator('select[name="billing_currency"]'),
        addButton:page.locator('//button[text()="Add"]'),
        kebabIcon:page.locator('div[title="More"]').first(),
        editButton:page.locator('//div[text()=" Edit"]'),
        deleteButton:page.locator('//div[text()=" Delete"]'),
        deletePopupHeading:page.locator('//p[text()="Confirm Delete"]'),
        confirmButton:page.locator('//button[text()="Yes"]'),
        searchProjectName:page.getByLabel('PROJECT NAME Filter Input'), 
        searchClientName:page.getByLabel('CLIENT NAME Filter Input'),
        verifyDeletedRecord:page.locator('[col-id="client_name"]', { hasText: testData.projectDetails.projectName }), 
        updateButton:page.locator('//button[text()="Update"]'),  
        assignEmployeeIcon:page.locator('div[title="Assign Employee"]').first(),
        assignEmployeePopupHeading:page.locator('//p[text()="Assign Employee to Techtest"]'),
        selectEmployeeName:page.locator('select[name="employee_id"]'),
        experienceTextfield:page.getByPlaceholder('Enter Client Project Experience'),
        onboardingDate:page.locator('input[name="start_date"]'),
        selectServiceType:page.locator('select[name="service_type"]'),
        selectBillingType:page.locator('select[name="billing_type"]'),
        billingAmountTextfield:page.getByPlaceholder('Enter Billing Amount'), 
        viewIcon:page.locator('//div[@class="icon-wrapper"]').first(),
        projectDetailsPageHeading:page.locator('//p[text()=" Project Details"]'), 
        assignEmployeeButton:page.locator('//button[text()="Assign Employee"]'), 
        errorFields:page.locator('[style*="border-left: 10px solid red"]'),
        errorMessage:page.locator('//p[text()="Project with this name already exists"]'),
        editButtonInProjectDetailsPage:page.locator('//button[@title="Edit"]'),
        updateEmployeeHEading:page.locator('//p[@class="modal-heading"]'),
        deleteButtonInProjectDetailsPage:page.locator('button[title="Delete"]'),
        offBoardEmployeeButton:page.locator('button[title="OffBoard Employee"]'),
        confirmOffBordingButton:page.locator('//button[text()="Confirm"]'),
        confirmDeleteButton:page.locator('//button[text()="Delete"]'),
        offBordDateTextField:page.locator('input[type="date"]'),
        errorMessageForDuplicateEmployee:page.locator('//p[text()="Project already assigned to the employee"]'),
        viewWorkLogsButton:page.locator('//button[text()="View Worklogs"]'),
        closeButton:page.locator('//div[text()=" Close"]'),
        confirmClosingProjectPopupHeading:page.locator('//p[text()="Confirm Closing Project"]'),
        projectClosingDateTextFied:page.locator('input[type="date"]'),
        confirmprojectClosingButton:page.locator('//button[text()="Confirm"]'),
        employeesListInWorklogs:page.locator('[col-id="employee_name"]'),
    };
}

export async function clickOnBillingMenu( projectBilling:ProjectBilling)
{
    await expect( projectBilling.billingMenu).toBeVisible();
    await clickElement( projectBilling.billingMenu);
}

export async function clickOnProjects( projectBilling:ProjectBilling){
    await expect( projectBilling.projects).toBeVisible();
    await clickElement( projectBilling.projects);
}

export async function clickOnAddProjectButton( projectBilling:ProjectBilling){
    await expect( projectBilling.addProjectButton).toBeVisible();
    await clickElement( projectBilling.addProjectButton);
}

export async function verifyAddProjectFrameHeading( projectBilling:ProjectBilling){
    await expect( projectBilling.addProjectFrameHeading).toBeVisible();
}

export async function selectClientNameFromDropdown( projectBilling:ProjectBilling){
    await expect( projectBilling.selectClientDropdown).toBeVisible();
    await selectDropdownValue( projectBilling.selectClientDropdown,testData.projectDetails.clientName);
}

export async function enterProjectName( projectBilling:ProjectBilling):Promise<string>{
    await expect( projectBilling.projectNameTextfield).toBeVisible();
    const projectName = faker.company.name();
    await fillInput( projectBilling.projectNameTextfield,projectName);
    updateSharedData('projectData.projectName', projectName, testData.employeeDetails.sharedEmployeeJsonFile);
    return projectName;
}

export async function enterDuplicateProjectName( projectBilling:ProjectBilling){
    await expect( projectBilling.projectNameTextfield).toBeVisible();
    await fillInput( projectBilling.projectNameTextfield,testData.projectDetails.projectName);
}

export async function enterStartDate( projectBilling:ProjectBilling){
    const start= await getTodayDate();
    await expect( projectBilling.startDateTextfield).toBeVisible();
    await fillInput( projectBilling.startDateTextfield,start);
}

export async function selectProjectLeadFromDropdown( projectBilling:ProjectBilling){
    await expect( projectBilling.selectProjectLeadFromDropdown).toBeVisible();
    await selectDropdownValue( projectBilling.selectProjectLeadFromDropdown,testData.employeeDetails.reportingTo);
}

export async function selectProjectStatusFromDropdown( projectBilling:ProjectBilling){
    await expect( projectBilling.selectProjectStatusDropdown).toBeVisible();
    await selectDropdownOption( projectBilling.selectProjectStatusDropdown,testData.projectDetails.status);
}

export async function selectCurrencyFromDropdown( projectBilling:ProjectBilling){
    await expect( projectBilling.selectCurrencyDropdown).toBeVisible();
    await selectDropdownOption( projectBilling.selectCurrencyDropdown,testData.projectDetails.currency);
}

export async function clickOnAddButton( projectBilling:ProjectBilling){
    await expect( projectBilling.addButton).toBeVisible();
    await clickElement( projectBilling.addButton);
}

export async function verifyProjectAddedSuucessToast(page:Page){
    await verifyToast(page,testData.toastMessages.projectCreatedSuccess);
}

export async function clickOnKebabdIcon(page:Page, projectBilling:ProjectBilling){
    await expect( projectBilling.kebabIcon).toBeVisible();
    await scrollToRightAndClick(page, projectBilling.kebabIcon);
}

export async function clickOnDeleteButton( projectBilling:ProjectBilling){
    await expect( projectBilling.deleteButton).toBeVisible();
    await clickElement( projectBilling.deleteButton);
}

export async function verifyDeletePopupHeading( projectBilling:ProjectBilling){
    await expect( projectBilling.deletePopupHeading).toBeVisible();
}

export async function clickOnConfirmButton( projectBilling:ProjectBilling){
    await expect( projectBilling.confirmDeleteButton).toBeVisible();
    await clickElement( projectBilling.confirmDeleteButton);
}

export async function verifyDeletedProjectToast(page:Page){
    await verifyToast(page,testData.toastMessages.projectDeleteSuccess);
}

export async function searchProject(  projectBilling:ProjectBilling){
    const data =getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
    const projectName=data.projectData.projectName;
    await expect( projectBilling.searchProjectName).toBeVisible();
    await fillInput( projectBilling.searchProjectName,projectName);
}

export async function searchClientName( projectBilling:ProjectBilling){
    await expect( projectBilling.searchClientName).toBeVisible();
    await fillInput( projectBilling.searchClientName,testData.projectDetails.clientName);
}

export async function verifyDeletedRecord( projectBilling:ProjectBilling){
    await expect( projectBilling.verifyDeletedRecord).not.toBeVisible();
}

export async function clickOnEditButton( projectBilling:ProjectBilling){
    await expect( projectBilling.editButton).toBeVisible();
    await clickElement( projectBilling.editButton);
}

export async function updateCurrency( projectBilling:ProjectBilling){
    await expect( projectBilling.selectCurrencyDropdown).toBeVisible();
    await selectDropdownOption( projectBilling.selectCurrencyDropdown,testData.projectDetails.updateCurrency);
}

export async function clickOnUpdatenButton( projectBilling:ProjectBilling){
    await expect( projectBilling.updateButton).toBeVisible();
    await clickElement( projectBilling.updateButton);
}

export async function verifyProjectUpdatedToast(page:Page){
    await verifyToast(page,testData.toastMessages.ProjectUpdatedSuccess);
}

export async function clickOnAssignEmployeeIcon(page:Page, projectBilling:ProjectBilling){
    await expect( projectBilling.assignEmployeeIcon).toBeVisible();
    await page.waitForLoadState("networkidle");
    await scrollToRightAndClick(page, projectBilling.assignEmployeeIcon);
}

export async function verifyAssignEmployeeFrameHeading( projectBilling:ProjectBilling)
{
    await expect( projectBilling.assignEmployeePopupHeading).toBeVisible();
}

export async function selectEmployeeNameFromDropdown( projectBilling:ProjectBilling){
    await expect( projectBilling.selectEmployeeName).toBeVisible();
    const employeeName=getCreatedEmployeeDetails(testData.employeeDetails.sharedEmployeeJsonFile);
    await selectDropdownValue( projectBilling.selectEmployeeName,employeeName);
}

export async function selectDuplicateEmployeeFromDropdown(projectBilling: ProjectBilling) {
  await expect(projectBilling.selectEmployeeName).toBeVisible();
  const data = getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
  const firstname = data.assignedEmployeeToProject.firstname;
  const lastname = data.assignedEmployeeToProject.lastname;
  const fullName = `${firstname} ${lastname}`;
  await selectDropdownValue(projectBilling.selectEmployeeName, fullName);
}
export async function selectEmployee( projectBilling:ProjectBilling,emp: string){
     await expect( projectBilling.selectEmployeeName).toBeVisible();
     const employeeName=emp;
     await selectDropdownValue( projectBilling.selectEmployeeName,employeeName);
}

export async function enterClientProjectExperience( projectBilling:ProjectBilling){
    await expect( projectBilling.experienceTextfield).toBeVisible();
    await fillInput( projectBilling.experienceTextfield,testData.projectDetails.clientProjectExperience);
}

export async function enterOnbordingDate( projectBilling:ProjectBilling){
    await expect( projectBilling.onboardingDate).toBeVisible();
    const start  = await getTodayDate();
    await fillInput( projectBilling.onboardingDate,start);
}

export async function selectServiceTypeFromDropdown( projectBilling:ProjectBilling){
    await expect( projectBilling.selectServiceType).toBeVisible();
    await selectDropdownOption( projectBilling.selectServiceType,testData.projectDetails.serviceType);
}

export async function selectBillingTypeFromDropdown( projectBilling:ProjectBilling){
    await expect( projectBilling.selectBillingType).toBeVisible();
    await selectDropdownOption( projectBilling.selectBillingType,testData.projectDetails.BillingType);
}

export async function enterBillingAmount( projectBilling:ProjectBilling){
    await expect( projectBilling.billingAmountTextfield).toBeVisible();
    await fillInput( projectBilling.billingAmountTextfield,testData.projectDetails.BillingAmount);
}   

export async function clickOnViewIcon(page:Page, projectBilling:ProjectBilling){
        await scrollToRightAndClick(page, projectBilling.viewIcon);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
}

export async function clickOnEditIconInProjectDetailsPage( projectBilling:ProjectBilling){
    await clickElement( projectBilling.editButtonInProjectDetailsPage);
}

export async function updatedExperience(  projectBilling:ProjectBilling){
    await expect( projectBilling.experienceTextfield).toBeVisible();
    await fillInput( projectBilling.experienceTextfield,testData.projectDetails.updatedExperience);
}

export async function updateBillingAmount( projectBilling:ProjectBilling){
    await expect( projectBilling.billingAmountTextfield).toBeVisible();
    await fillInput( projectBilling.billingAmountTextfield,testData.projectDetails.updatedBillingAmount);
}

export async function updateBillingType( projectBilling:ProjectBilling){
    await expect( projectBilling.selectBillingType).toBeVisible();
    await selectDropdownOption( projectBilling.selectBillingType,testData.projectDetails.updatedBillingType);
}

export async function updateServiceType( projectBilling:ProjectBilling){
    await expect( projectBilling.selectServiceType).toBeVisible();
    await selectDropdownOption( projectBilling.selectServiceType,testData.projectDetails.updatedServiceType);
}

export async function verifyProjectDetailsPageHeading( projectBilling:ProjectBilling){
    await expect( projectBilling.projectDetailsPageHeading).toBeVisible();  
}

export async function clickOnAssignEmployeeButton( projectBilling:ProjectBilling){
    await clickElement( projectBilling.assignEmployeeButton);
}

export async function verifyAssignedEmployeeToastInProjectDetailsPage(page:Page){
    await verifyToast(page,testData.toastMessages.assignEmployeeToast);
}

export async function verifyEmptyProjectData( projectBilling:ProjectBilling){
  const count = await getErrorCount( projectBilling.errorFields);
  await expect(count).toBe(5);
}

export async function verifyErrorMessage( projectBilling:ProjectBilling){
    await expect( projectBilling.errorMessage).toBeVisible();
}

export async function verifyUpdatedEmployeeFrameHeading( projectBilling:ProjectBilling){
    await expect( projectBilling.updateEmployeeHEading).toBeVisible();
}

export async function clickonDeleteButtonInProjectDetailsPage( projectBilling:ProjectBilling){
    await expect( projectBilling.deleteButtonInProjectDetailsPage).toBeVisible();
    await clickElement( projectBilling.deleteButtonInProjectDetailsPage);
}

export async function clickOnOffBoardingButton( projectBilling:ProjectBilling){
    await expect( projectBilling.offBoardEmployeeButton).toBeVisible();
    await clickElement( projectBilling.offBoardEmployeeButton);
}

export async function enterOffBordingDate( projectBilling:ProjectBilling){
    await expect( projectBilling.offBordDateTextField).toBeVisible();
    const { end } = await generateUniqueDates();
    await fillInput( projectBilling.offBordDateTextField,end);
}

export async function ConfirmOffboradingEmployee( projectBilling:ProjectBilling){
    await expect( projectBilling.confirmOffBordingButton).toBeVisible();
    await clickElement( projectBilling.confirmOffBordingButton);
}

export async function clickOnConfirmDeleteButton( projectBilling:ProjectBilling){
    await expect( projectBilling.confirmDeleteButton).toBeVisible();
    await clickElement( projectBilling.confirmDeleteButton);
}

export async function verifyEmptyEmployeeDataInProject( projectBilling:ProjectBilling){
  const count = await getErrorCount( projectBilling.errorFields);
  await expect(count).toBe(6);
}

export async function verifyErrorMessageForDuplicateEmployee( projectBilling:ProjectBilling){
    await expect( projectBilling.errorMessageForDuplicateEmployee).toBeVisible();
}

export async function clickOnViewWorkLogsButton(page:Page, projectBilling:ProjectBilling){
    await expect( projectBilling.viewWorkLogsButton).toBeVisible();
    await Promise.all([page.waitForLoadState('domcontentloaded'),projectBilling.viewWorkLogsButton.click()]);
    await expect(page).toHaveURL(/worklogs_project/);
}

export async function clickOnCloseButton( projectBilling:ProjectBilling){
    await expect( projectBilling.closeButton).toBeVisible();
    await clickElement( projectBilling.closeButton);
}

export async function verifyProjectClosingPopupHeading( projectBilling:ProjectBilling){
    await expect( projectBilling.confirmClosingProjectPopupHeading).toBeVisible();
}

export async function enterProjectClosingDate( projectBilling:ProjectBilling)
{
    await expect( projectBilling.projectClosingDateTextFied).toBeVisible();
    const { end } = await generateUniqueDates();
    await fillInput( projectBilling.projectClosingDateTextFied,end)
}

export async function clickOnConfirmProjectClosingButton( projectBilling:ProjectBilling){
    await expect( projectBilling.confirmprojectClosingButton).toBeVisible();
    await clickElement( projectBilling.confirmprojectClosingButton);
}

export async function verifyProjectClosedToast(page:Page){
    await verifyToast(page,testData.toastMessages.projectClosingToast);
}

export async function verifyEmployeesInProjectWorklogsPage( projectBilling:ProjectBilling):Promise<string[]> {

    //  const employeeList = await  projectBilling.employeesListInWorklogs.allTextContents();
    //  return employeeList;

     const locator = projectBilling.employeesListInWorklogs;
     await locator.first().waitFor({ state: 'visible', timeout: 10000 });
     const employeeList = await locator.allTextContents();
     return employeeList.map(text => text.trim()).filter(text => text.length > 0);
}

