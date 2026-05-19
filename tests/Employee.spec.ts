import { test, expect} from '../fixtures/Fixture';
import * as EmployeeController from '../controller/EmployeeController';
import { getEmployeeDataFromJSON, FullEmployee } from '../controller/EmployeeController';
import {SharedData} from '../controller/EmployeeController';
import testData from '../testdata/StaticData.json';
import { getSharedData } from '../utils/CommonActions';


test.describe('Employee Management', () => {
  let employeeData: FullEmployee; 

  test.beforeEach(async ({ page,employee }) => {
    employeeData = getEmployeeDataFromJSON();
    await page.goto('/');
    await EmployeeController.addEmployeeDetails(page, employee,employeeData);
  });

  test('Verify user is able to Create Employee in Employee Page', async ({ page,employee }) => {
    expect(employeeData.empID).toBeDefined();
    expect(employeeData.email).toBeDefined();
    await EmployeeController.deleteEmployeeDetails(page,employee)
  });

  test('Verify user is able to update Employee in Employee Page ', async ({ page,employee }) => {
    await EmployeeController.updateEmployeeDetails(page, employee, employeeData);
    await EmployeeController.deleteEmployeeDetails(page,employee)
  });
});

test.describe('Employee Management',()=>{

  let employeeData: FullEmployee;
  let sharedData: SharedData; 
  
  test.beforeEach(async ({ page }) => {
    employeeData = getEmployeeDataFromJSON();
    sharedData = getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
    await page.goto('/');
  });

  test('Verify user ia able to create employee with invalid data in Employee Page',async({page,employee})=>{

     await EmployeeController.addEmployeeWithInvalidData(page,employee,employeeData);
  })

  test('Verify user is able to create employee with duplicate data in Employee Page',async({page,employee})=>{
    await EmployeeController.addEmployeeWithDuplicateData(page,employee,sharedData,employeeData);
  })

  test('Verify user is able to create employee with empty data in Employee Page',async({page,employee})=>{
    await EmployeeController.addEmployeeWithEmptyData(page,employee);
  })
});

test.describe('Upload Employees through excel', () => {

  test('Verify user is able to upload multiple employee data in Employee Page', async ({ page,employee }) => {
    await page.goto('/');
    const jsonFilePath = testData.employeeDetails.employeeDataJsonFile;
    await EmployeeController.uploadMultipleEmployeeData(page, employee, jsonFilePath);
    await EmployeeController.deleteImportedEmployeesInEmployeeList(page,employee);
  });
});

// test.describe('Export Employees data',()=>{

//   test.beforeEach(async ({ page }) => {
//     await page.goto('/');
//   });
//   test('verify user is able to export all employees data',async({page,employee})=>{
//     const columns = testData.employeeDetails.employeeColumns;
//     const gridColumns = columns.map(c => ({ key: c.key,colId: c.colId,header: c.header}));
//     await EmployeeController.exportAllEmployeesData(page,employee,gridColumns);
//   })
// })