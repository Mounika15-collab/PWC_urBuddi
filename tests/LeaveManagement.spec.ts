import * as EmployeeController from '../controller/EmployeeController';
import { getEmployeeDataFromJSON, FullEmployee } from '../controller/EmployeeController';
import {generateUniqueDates} from '../utils/CommonUtils';
import { SharedData } from '../controller/LeaveManagementController';
import * as LeaveManagementController from '../controller/LeaveManagementController';
import {DateRange} from '../controller/LeaveManagementController';
import testData from '../testdata/StaticData.json';
import * as leavePage from '../pages/LeaveManagementPage';
import { test} from '../fixtures/Fixture';
import { getSharedData } from '../utils/CommonActions';

test.describe('Leave Management', () => 
{
  let employeeData: FullEmployee;
  let dateRange:DateRange;
  let sharedData: SharedData;

  test.beforeEach(async ({ page,dashboard,employee}) => {
    employeeData = getEmployeeDataFromJSON();
    await page.goto('/');
    await EmployeeController.addEmployeeDetails(page, employee, employeeData);
    sharedData = getSharedData(testData.employeeDetails.sharedEmployeeJsonFile);
    await LeaveManagementController.loginWithNewUser(page,dashboard);
    dateRange = await generateUniqueDates(1);
  });

  test('Verify user is able to apply leave in Leave Management page',async({ page,dashboard,employee,leaveManagement })=>{
   await LeaveManagementController.applyLeave(page, dateRange,leaveManagement);
   await LeaveManagementController.deleteEmployeeAfterApplyLeaveOrWorkFromHome(page,dashboard,employee);
  });

  test('Verify lead is able to reject applied leave in Leave Management page',async({ page,dashboard,employee,leaveManagement })=>{
    const expectedDays=await LeaveManagementController.applyLeave(page,dateRange,leaveManagement);
    await LeaveManagementController.rejectAppliedLeave(page,dashboard,leaveManagement);
    await LeaveManagementController.deleteEmployeeAfterRejectingLeaveOrWorkFromHome(page,employee);
  })

  test('Verify lead is able to approve applied leave in Leave Management page',async({page,dashboard,employee,leaveManagement})=>{
    const expectedDays=await LeaveManagementController.applyLeave(page,dateRange,leaveManagement);
    const initialLeaveCount = await leavePage.getInitialLeaveCount(leaveManagement);
    await LeaveManagementController.approveAppliedLeave(page,dashboard,leaveManagement);
    await LeaveManagementController.verifyLeaveCountAfterApprovingLeave(page,sharedData,initialLeaveCount,dateRange,dashboard,leaveManagement);
    await LeaveManagementController.deleteEmployeeAfterApplyLeaveOrWorkFromHome(page,dashboard,employee);
  })

  test('Verify user is able to apply work from home in Leave Management page',async({ page,dashboard,employee,leaveManagement })=>{
    await LeaveManagementController.applyWorkFromHome(page,dateRange,leaveManagement);
    await LeaveManagementController.deleteEmployeeAfterApplyLeaveOrWorkFromHome(page,dashboard,employee);
  });

  test('Verify lead is able to approve applied Work from home under Requests category in Leave Management page',async({ page,dashboard,employee,leaveManagement })=>{
    await LeaveManagementController.applyWorkFromHome(page,dateRange,leaveManagement);
    await LeaveManagementController.approveAppliedWorkFromHome(page,dashboard,leaveManagement);
    await LeaveManagementController.deleteEmployeeAfterApprovingWorkFromHomeOrLeave(page,employee);
  })

  test('Verify lead is able to reject applied Work from home under Requests category in leave Management page',async({page,dashboard,employee,leaveManagement})=>{
    await LeaveManagementController.applyWorkFromHome(page,dateRange,leaveManagement);
    await LeaveManagementController.rejectAppliedWorkFromHome(page,dashboard,leaveManagement);
    await LeaveManagementController.deleteEmployeeAfterApprovingWorkFromHomeOrLeave(page,employee);
  })

  test('Verify user is to cancel applied Leave under your history category in Leave Management page',async({page,dashboard,employee,leaveManagement})=>{
    await LeaveManagementController.applyLeave(page,dateRange,leaveManagement);
    await LeaveManagementController.cancelAppliedLeave(page,leaveManagement);
    await LeaveManagementController.deleteEmployeeAfterApplyLeaveOrWorkFromHome(page,dashboard,employee);
  })

  test('Verify user is able to cancel applied work from home under your history category in Leave Management page',async({page,dashboard,employee,leaveManagement})=>{
    await LeaveManagementController.applyWorkFromHome(page,dateRange,leaveManagement);
    await LeaveManagementController.cancelAppliedWorkFromHome(page,leaveManagement);
    await LeaveManagementController.deleteEmployeeAfterApplyLeaveOrWorkFromHome(page,dashboard,employee);
  })

  test('Verify user is able to export data under all history category in Leave Management page', async ({page,leaveManagement,employee,dashboard}) =>{
      await LeaveManagementController.exportDataInHistory(page,leaveManagement,employee,dateRange,dashboard);
  });

  test('Verify user is able to export data under summary category in Leave Management page',async({page,leaveManagement,employee,dashboard})=>{
      await LeaveManagementController.exportDataInSummary(page,leaveManagement,employee,dateRange,dashboard);
  });
});