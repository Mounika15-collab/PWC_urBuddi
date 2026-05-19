import * as projectController from '../controller/ProjectBillingController';
import { getEmployeeDataFromJSON } from '../controller/EmployeeController';
import { test } from '../fixtures/Fixture';


test.describe('Project Tests', () => 
{
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Verify user is able to create project in Projects Page',async({page,projectBilling})=>
  {
    await projectController.navigateToProjectBillingModule(projectBilling);
    await projectController.addNewProject(page,projectBilling);
    await projectController.deleteProject(page,projectBilling);    
  })

  test('Verify user is able to update project in Projects page',async({page,projectBilling})=> {
    await projectController.navigateToProjectBillingModule(projectBilling);
    await projectController.addNewProject(page,projectBilling);
    await projectController.updateProject(page,projectBilling);
    await projectController.deleteProject(page,projectBilling); 
  })

  test('Verify user is able to assign employee to project in Projects page',async({page,projectBilling,employee})=>{
    const data=getEmployeeDataFromJSON();
    await projectController.assignEmployeeToProject(page,projectBilling,employee,data);
  })

  test('Verify user is able assign employee in projects details page',async({page,projectBilling,employee})=>{
   
    const data=getEmployeeDataFromJSON();
    await projectController.assignEmployeeInProjectDetailsPage(page,employee,projectBilling,data);
  })

  test('Verify user is able to update assigned employee in project Details page',async({page,projectBilling,employee})=>{
   
    const data=getEmployeeDataFromJSON();
    await projectController.updateAssignedEmployeeInProjectDetails(page,employee,projectBilling,data);
  })

  test('Verify user is able to delete assigned employee in Project details page',async({page,projectBilling,employee})=>{
   
    const data=getEmployeeDataFromJSON();
    await projectController.deleteAssignedEmployeeInProjectDetails(page,employee,projectBilling,data);
  })

  test('Verify user is able to offboard an employee from the Project Details page',async({page,projectBilling,employee})=>{
   
    const data=getEmployeeDataFromJSON();
    await projectController.offBoardingEmployeeInProjectDetailsPage(page,employee,projectBilling,data);
  })

  test('Verify user is able to view the worklogs of Sigle Employee in Project Details Page',async({page,projectBilling,employee})=>{
    const data=getEmployeeDataFromJSON();
    await projectController.viewWorkLogsForTheSingleEmployee(page,employee,projectBilling,data);
  })

  test('Verify user is able to view the worklogs of multiple Employee in Project Details Page',async({page,projectBilling})=>{
    await projectController.viewWorkLogsOfMultipleEmployeesInProjectDetailsPage(page,projectBilling);
  })

  test('Verify user is able to close the project',async({page,projectBilling})=>{
     await projectController.closeTheProject(page,projectBilling);
  })
});


test.describe('Project Tests - @Regression', () => 
{ 
  test.beforeEach(async ({ page }) => 
  {
    await page.goto('/');
  });

  test('Verify user is able to create project with Empty data in Projects page',async({projectBilling})=>{
     await projectController.addProjectWithEmptyData(projectBilling);
  })

  test('Verify user is able to add duplicate project in Projects page',async({projectBilling})=>{
    await projectController.addDuplicateProjects(projectBilling);
  })

  test('Verify user is able to assign employee with empty data to the project in Projects page',async({page,projectBilling,employee})=>{
    const data=getEmployeeDataFromJSON();
    await projectController.assignEmployeeWithEmptyDataToProject(page,employee,projectBilling,data)
  })

  test('Verify user is able to assign employee with empty data in Project Details page',async({page,projectBilling,employee})=>{
    const data=getEmployeeDataFromJSON();
    await projectController.assignEmployeeWithEmptyDataInProjectDetailsPage(page,employee,projectBilling,data)
  })

  test('Verify user is able to assign employee with duplicate data to the project',async({page,projectBilling,employee})=>{
    const data=getEmployeeDataFromJSON();
    await projectController.assignEmployeeWithDuplicateDataToProject(page,employee,projectBilling,data);
  })
    
});

