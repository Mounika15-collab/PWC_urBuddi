import { Page, expect } from "@playwright/test";
import { WorklogBilling,ProjectBilling } from '../fixtures/Fixture';
import * as worklogPage from '../pages/WorklogsPage';
import * as projectController from '../controller/ProjectBillingController';
import projectData from '../testdata/DynamicData.json';
import worklogData from '../testdata/StaticData.json';
import testdata from '../testdata/StaticData.json';
import * as projectsPage from '../pages/ProjectsBillingPage';
import { generateUniqueDates } from "../utils/CommonUtils";


export async function navigateToWorklogs(worklog:WorklogBilling){
    await worklogPage.clickOnBillingMenu(worklog);
    await worklogPage.clickOnWorklogMenu(worklog);
}

export async function assignMultipleEmployeesToProjectInProjectDetailsPage(page:Page,  projectBilling:ProjectBilling){
    await projectController.navigateToProjectBillingModule( projectBilling);
    await projectController.addNewProject(page, projectBilling);
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
}

export async function addWorklog(page:Page,worklog:WorklogBilling,projectBilling:ProjectBilling){
    const { start }=await generateUniqueDates();
    await assignMultipleEmployeesToProjectInProjectDetailsPage(page,projectBilling);
    await worklogPage.clickOnWorklogMenu(worklog);
    await worklogPage.clickOnAddWorklogButtonInWorklogsPage(worklog);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    await worklogPage.selectProjectFromAllProjectsropdown(worklog,projectData.projectData.projectName);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    await worklogPage.clickOnAddWorklogButtonInWorklogDashboard(worklog);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
    await worklogPage.verifyAddWorkLogframeHeading(worklog);
    await worklogPage.enterWorkDate(worklog,start);
    await worklogPage.enterWorkingHours(worklog,worklogData.worklogDetails.workingHours);
    await worklogPage.selectAttendaceTypefromdropdown(worklog,worklogData.worklogDetails.workStatus);
    await worklogPage.enterWorkDescription(worklog,worklogData.worklogDetails.WorkDescription);
    await worklogPage.clickOnAddButton(worklog);
    await worklogPage.verifyWorklogaddedSuccessfullyToast(page);
}

export async function checkTheActiveProjectsInWorklogsList(page:Page,worklog:WorklogBilling){
    await navigateToWorklogs(worklog);
    await worklogPage.validateProjectStatusInWorklogList(page,worklog,worklogData.worklogDetails.status.active);   
}

export async function checkThePausedProjectsInWorklogsList(page:Page,worklog:WorklogBilling){
    await navigateToWorklogs(worklog);
    await worklogPage.clickOnActiveStatusCheckbox(worklog);
    await worklogPage.clickOnPausedStatusCheckbox(worklog);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(40000);
    await worklogPage.validateProjectStatusInWorklogList(page,worklog,worklogData.worklogDetails.status.paused);
}

export async function checkTheClosedProjectsInWorklogsList(page:Page,worklog:WorklogBilling){
    await navigateToWorklogs(worklog);
    await worklogPage.clickOnActiveStatusCheckbox(worklog);
    await worklogPage.clickOnClosedStatusCheckBox(worklog);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(40000);
    await worklogPage.validateProjectStatusInWorklogList(page,worklog,worklogData.worklogDetails.status.closed);
}

export async function exportWorklogDataForThisMonth(page:Page,worklog:WorklogBilling,projectBilling:ProjectBilling){
  await assignMultipleEmployeesToProjectInProjectDetailsPage(page, projectBilling);
  await worklogPage.clickOnWorklogMenu(worklog);
  await worklogPage.clickOnAddWorklogButtonInWorklogsPage(worklog);
  const downloadPromise = page.waitForEvent('download');
  await worklogPage.clickOnExportButton(worklog);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  await worklogPage.clickOnThisMonthButton(worklog);
  const download = await downloadPromise;
  const fileName = download.suggestedFilename();
  console.log("Downloaded file:", fileName);
  const filePath = `./downloads/${fileName}`;
  await download.saveAs(filePath);
  expect(fileName).toContain('worklog'); 
}


export async function updateWorklog(page:Page,worklog:WorklogBilling,projectBilling:ProjectBilling){
    await addWorklog(page,worklog,projectBilling);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await worklogPage.clickOnMonthCard(page);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await worklogPage.clickOnEditButton(worklog);
    await worklogPage.verifyUpdateWorklogFrameHEading(worklog);
    await worklogPage.enterWorkDate(worklog,worklogData.worklogDetails.updateWorkDate);
    await worklogPage.enterWorkingHours(worklog,worklogData.worklogDetails.updateWorkingHours);
    await worklogPage.clickOnUpdateButton(worklog);
    await worklogPage.verifyErrorMEssage(page);
}


export async function deleteWorklog(page:Page,worklog:WorklogBilling){
    await navigateToWorklogs(worklog);
    await worklogPage.clickOnAddWorklogButtonInWorklogsPage(worklog);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await worklogPage.clickOnMonthCard(page);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
    await worklogPage.clickonDeletebUtton(worklog);
    await worklogPage.verifyConfirmationPopup(worklog);
    await worklogPage.clickOnConfirmDeleteButton(worklog);
    await worklogPage.verifySuccessfulyDeleteWorklogToast(page);
} 