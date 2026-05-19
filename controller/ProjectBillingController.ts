import { Page,expect } from '@playwright/test';
import * as projectsPage from '../pages/ProjectsBillingPage';
import {addEmployeeDetails,FullEmployee} from '../controller/EmployeeController';
import testdata from '../testdata/StaticData.json';
import {Employees, ProjectBilling} from '../fixtures/Fixture';
import { getSharedData, updateSharedData } from '../utils/CommonActions';



export async function navigateToProjectBillingModule( projectBilling:ProjectBilling){
    await projectsPage.clickOnBillingMenu( projectBilling);
    await projectsPage.clickOnProjects( projectBilling)
}

export async function addNewProject(page:Page, projectBilling:ProjectBilling){
     await page.waitForLoadState("domcontentloaded");
     await page.waitForLoadState("networkidle");
     await projectsPage.clickOnAddProjectButton( projectBilling);
     await page.waitForLoadState("networkidle");
     await projectsPage.selectClientNameFromDropdown( projectBilling);
     await projectsPage.enterProjectName( projectBilling);
     await projectsPage.enterStartDate( projectBilling);
     await projectsPage.selectProjectLeadFromDropdown( projectBilling);
     await projectsPage.selectCurrencyFromDropdown( projectBilling);
     await projectsPage.clickOnAddButton( projectBilling);
     await projectsPage.verifyProjectAddedSuucessToast(page);
}

export async function updateProject(page:Page, projectBilling:ProjectBilling){
    await projectsPage.clickOnKebabdIcon(page, projectBilling);
    await projectsPage.clickOnEditButton( projectBilling);
    await projectsPage.updateCurrency( projectBilling);
    await projectsPage.clickOnUpdatenButton( projectBilling);
    await projectsPage.verifyProjectUpdatedToast(page);
}

export async function deleteProject(page:Page, projectBilling:ProjectBilling){
    await projectsPage.clickOnKebabdIcon(page, projectBilling);
    await projectsPage.clickOnDeleteButton( projectBilling);
    await projectsPage.verifyDeletePopupHeading( projectBilling);
    await projectsPage.clickOnConfirmButton( projectBilling);
    await projectsPage.verifyDeletedProjectToast(page);
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    await expect( projectBilling.searchProjectName).toBeVisible();
    await projectsPage.searchProject( projectBilling);
    await page.waitForLoadState("networkidle");
    await projectsPage.searchClientName( projectBilling);
    await projectsPage.verifyDeletedRecord( projectBilling);
}

export async function assignEmployeeToProject(page:Page, projectBilling:ProjectBilling,employee:Employees,
    data:FullEmployee){
    await addEmployeeDetails(page,employee,data)
    await navigateToProjectBillingModule( projectBilling);
    await addNewProject(page, projectBilling);
    await page.reload();
    await page.waitForLoadState("networkidle");
    await projectsPage.searchProject( projectBilling);
    await projectsPage.searchClientName( projectBilling);
    await projectsPage.clickOnAssignEmployeeIcon(page, projectBilling);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await projectsPage.selectEmployeeNameFromDropdown( projectBilling);
    await projectsPage.enterClientProjectExperience( projectBilling);
    await projectsPage.enterOnbordingDate( projectBilling);
    await projectsPage.selectServiceTypeFromDropdown( projectBilling);
    await projectsPage.selectBillingTypeFromDropdown( projectBilling);
    await projectsPage.enterBillingAmount( projectBilling);
    await projectsPage.clickOnAddButton( projectBilling);
    
    updateSharedData('assignedEmployeeToProject',{
    firstname: data.firstname,
    lastname: data.lastname
  },testdata.employeeDetails.sharedEmployeeJsonFile)
}

export async function assignEmployeeWithEmptyDataToProject(page:Page, employee:Employees,projectBilling:ProjectBilling,
    data:FullEmployee){
    await addEmployeeDetails(page,employee,data)
    await navigateToProjectBillingModule( projectBilling);
    await addNewProject(page, projectBilling);
    await page.reload();
    await page.waitForLoadState("networkidle");
    await projectsPage.searchProject( projectBilling);
    await projectsPage.searchClientName( projectBilling);
    await projectsPage.clickOnAssignEmployeeIcon(page, projectBilling);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await projectsPage.clickOnAddButton( projectBilling);
    await projectsPage.verifyEmptyEmployeeDataInProject( projectBilling);
}

export async function assignEmployeeWithDuplicateDataToProject(page:Page,employee:Employees, projectBilling:ProjectBilling,data: FullEmployee){
    const employeedata=getSharedData(testdata.employeeDetails.sharedEmployeeJsonFile);
    await navigateToProjectBillingModule( projectBilling);
    await assignEmployeeToProject(page,projectBilling,employee,data);
    await projectsPage.searchProject( projectBilling);
    await projectsPage.searchClientName( projectBilling);
    await projectsPage.clickOnAssignEmployeeIcon(page, projectBilling);
    await page.waitForLoadState("domcontentloaded");
    await projectsPage.selectDuplicateEmployeeFromDropdown( projectBilling);
    await projectsPage.enterClientProjectExperience( projectBilling);
    await projectsPage.enterOnbordingDate( projectBilling);
    await projectsPage.selectServiceTypeFromDropdown( projectBilling);
    await projectsPage.selectBillingTypeFromDropdown( projectBilling);
    await projectsPage.enterBillingAmount( projectBilling);
    await projectsPage.clickOnAddButton( projectBilling);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await projectsPage.verifyErrorMessageForDuplicateEmployee( projectBilling);
}

export async function assignEmployeeInProjectDetailsPage(page:Page,employee:Employees, projectBilling:ProjectBilling,
    data:FullEmployee){
    await addEmployeeDetails(page,employee,data)
    await navigateToProjectBillingModule( projectBilling);
    await addNewProject(page, projectBilling);
    await page.reload();
    await projectsPage.searchProject( projectBilling);
    await projectsPage.searchClientName( projectBilling);
    await projectsPage.clickOnViewIcon(page, projectBilling);
    await projectsPage.clickOnAssignEmployeeButton( projectBilling);
    // await page.waitForLoadState("domcontentloaded");
    await projectsPage.selectEmployeeNameFromDropdown( projectBilling);
    await projectsPage.enterClientProjectExperience( projectBilling);
    await projectsPage.enterOnbordingDate( projectBilling);
    await projectsPage.selectServiceTypeFromDropdown( projectBilling);
    await projectsPage.selectBillingTypeFromDropdown( projectBilling);
    await projectsPage.enterBillingAmount( projectBilling);
    await projectsPage.clickOnAddButton( projectBilling);
    await page.waitForLoadState("networkidle");
    await projectsPage.verifyAssignedEmployeeToastInProjectDetailsPage(page);
}

export async function updateAssignedEmployeeInProjectDetails(page:Page,employee:Employees, projectBilling:ProjectBilling,data:FullEmployee){
    await assignEmployeeInProjectDetailsPage(page,employee, projectBilling,data);
    await projectsPage.clickOnEditIconInProjectDetailsPage( projectBilling);
    await projectsPage.verifyUpdatedEmployeeFrameHeading( projectBilling);
    await projectsPage.updatedExperience( projectBilling);
    await projectsPage.updateServiceType( projectBilling);
    await projectsPage.updateBillingType( projectBilling);
    await projectsPage.updateBillingAmount( projectBilling);
    await projectsPage.clickOnUpdatenButton( projectBilling);
}


export async function deleteAssignedEmployeeInProjectDetails(page:Page,employee:Employees, projectBilling:ProjectBilling,
    data:FullEmployee){
    await assignEmployeeInProjectDetailsPage(page,employee, projectBilling,data);
    await projectsPage.clickonDeleteButtonInProjectDetailsPage( projectBilling);
    await projectsPage.verifyDeletePopupHeading( projectBilling);
    await projectsPage.clickOnConfirmDeleteButton( projectBilling);
}


export async function offBoardingEmployeeInProjectDetailsPage(page:Page,employee:Employees, projectBilling:ProjectBilling,
    data:FullEmployee){
    await assignEmployeeInProjectDetailsPage(page, employee,projectBilling,data);
    await projectsPage.clickOnOffBoardingButton( projectBilling);
    await projectsPage.enterOffBordingDate( projectBilling);
    await projectsPage.ConfirmOffboradingEmployee( projectBilling);
}


export async function addProjectWithEmptyData( projectBilling:ProjectBilling){
    await navigateToProjectBillingModule( projectBilling);
    await projectsPage.clickOnAddProjectButton( projectBilling);
    await projectsPage.clickOnAddButton( projectBilling);
    await projectsPage.verifyEmptyProjectData( projectBilling);
}

export async function addDuplicateProjects( projectBilling:ProjectBilling){
    await navigateToProjectBillingModule( projectBilling);
    await projectsPage.clickOnAddProjectButton( projectBilling);
    await projectsPage.selectClientNameFromDropdown( projectBilling);
    await projectsPage.enterDuplicateProjectName( projectBilling);
    await projectsPage.enterStartDate( projectBilling);
    await projectsPage.selectProjectLeadFromDropdown( projectBilling);
    await projectsPage.selectCurrencyFromDropdown( projectBilling);
    await projectsPage.clickOnAddButton( projectBilling);
    await projectsPage.verifyErrorMessage( projectBilling);
}

export async function assignEmployeeWithEmptyDataInProjectDetailsPage(page:Page,employee:Employees, projectBilling:ProjectBilling
    ,data:FullEmployee){
    await addEmployeeDetails(page,employee,data)
    await navigateToProjectBillingModule( projectBilling);
    await addNewProject(page, projectBilling);
    await page.reload();
    await projectsPage.searchProject( projectBilling);
    await projectsPage.searchClientName( projectBilling);
    await projectsPage.clickOnViewIcon(page, projectBilling);
    await projectsPage.clickOnAssignEmployeeButton( projectBilling);
    await page.waitForLoadState("domcontentloaded");
    await projectsPage.clickOnAddButton( projectBilling);
    await projectsPage.verifyEmptyEmployeeDataInProject( projectBilling);
}

export async function viewWorkLogsOfMultipleEmployeesInProjectDetailsPage(page:Page,  projectBilling:ProjectBilling){
    await navigateToProjectBillingModule( projectBilling);
    await addNewProject(page, projectBilling);
    await page.reload();
    await projectsPage.searchProject( projectBilling);
    await projectsPage.searchClientName( projectBilling);
    await page.waitForLoadState('networkidle')
    await projectsPage.clickOnViewIcon(page, projectBilling);  
    await page.waitForLoadState('networkidle')  
    const employees = Object.values(testdata.projectDetails.employees);
     for (const emp of employees) {
        await page.waitForLoadState('networkidle')
        await projectsPage.clickOnAssignEmployeeButton( projectBilling);
        await page.waitForLoadState('domcontentloaded')
        await page.waitForLoadState('networkidle')
        await projectsPage.selectEmployee( projectBilling,emp);
        await page.waitForLoadState('networkidle')
        await projectsPage.enterClientProjectExperience( projectBilling);
        await projectsPage.enterOnbordingDate( projectBilling);
        await projectsPage.selectServiceTypeFromDropdown( projectBilling);
        await projectsPage.selectBillingTypeFromDropdown( projectBilling);
        await projectsPage.enterBillingAmount( projectBilling);
        await projectsPage.clickOnAddButton( projectBilling);
        await projectsPage.verifyAssignedEmployeeToastInProjectDetailsPage(page);
    }
    await projectsPage.clickOnViewWorkLogsButton( page,projectBilling);
    await page.waitForLoadState('domcontentloaded',{timeout:10000})
    await page.waitForLoadState('networkidle',);
    const employeeList = await projectsPage.verifyEmployeesInProjectWorklogsPage( projectBilling);
    expect(employeeList).toEqual(expect.arrayContaining(employees));
}

export async function viewWorkLogsForTheSingleEmployee(page:Page, employee:Employees,projectBilling:ProjectBilling,
    data:FullEmployee){
    await assignEmployeeInProjectDetailsPage(page,employee, projectBilling,data);
    await projectsPage.clickOnViewWorkLogsButton( page,projectBilling);
    await page.waitForLoadState('domcontentloaded')    
}

export async function closeTheProject(page:Page, projectBilling:ProjectBilling){
    await navigateToProjectBillingModule( projectBilling);
    await addNewProject(page, projectBilling);
    await page.reload();
    await page.waitForLoadState("networkidle");
    await projectsPage.searchProject( projectBilling);
    await projectsPage.searchClientName( projectBilling);
    await projectsPage.clickOnKebabdIcon(page, projectBilling);
    await projectsPage.clickOnCloseButton( projectBilling);
    await projectsPage.verifyProjectClosingPopupHeading( projectBilling);
    await projectsPage.enterProjectClosingDate( projectBilling);
    await projectsPage.clickOnConfirmProjectClosingButton( projectBilling);
    await projectsPage.verifyProjectClosedToast(page);
}



