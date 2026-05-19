import { Dashboard, Employees } from '../fixtures/Fixture';
import * as dashboardPage from '../pages/DashboardPage';
import {getUniqueHolidayData} from '../utils/CommonUtils';
import {updateSharedData} from '../utils/CommonActions';
import testData from '../testdata/StaticData.json'
import { Page,expect } from '@playwright/test';
import * as EmployeeController from '../controller/EmployeeController';
import {FullEmployee} from '../controller/EmployeeController';

export async function addHolidays(page:Page,dashboard:Dashboard){
    const data=getUniqueHolidayData();
    await dashboardPage.clickOnAddHolidaysButton(dashboard);
    await dashboardPage.enterOccasion(dashboard,data.occasion);
    updateSharedData('holidayData.occasion', data.occasion,testData.employeeDetails.sharedEmployeeJsonFile);
    await dashboardPage.enterDate(dashboard,data.date);
    updateSharedData('holidayData.date', data.date,testData.employeeDetails.sharedEmployeeJsonFile);
    await page.waitForLoadState('networkidle');
    await dashboardPage.clickSubmitButton(dashboard);
    await page.waitForLoadState('networkidle');
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await dashboardPage.validateHolidayInHolidayWidget(dashboard,data);
    return data;
}

export async function deleteHoliday(dashboard:Dashboard){
    await dashboardPage.clickOnHolidayCrossButton(dashboard);
    await dashboardPage.clickOnConfirmButton(dashboard);
}

export async function addEvents(page:Page,dashboard:Dashboard){
    const data=getUniqueHolidayData();
    await dashboardPage.clickOnAddEventsButton(dashboard);
    await dashboardPage.enterEvent(dashboard,data.event);
    updateSharedData('eventsData.event',data.event,testData.employeeDetails.sharedEmployeeJsonFile);
    await dashboardPage.enterDate(dashboard,data.date);
    updateSharedData('holidayData.date', data.date,testData.employeeDetails.sharedEmployeeJsonFile);
    await page.waitForTimeout(2000);
    await dashboardPage.clickSubmitButton(dashboard);
    await page.waitForLoadState('domcontentloaded');
    return data;
}

export async function deleteEvents(dashboard:Dashboard){
    await dashboardPage.clickOnEventCrossButton(dashboard);
    await dashboardPage.clickOnConfirmButton(dashboard);
}

// export async function seeAllBirthdays(dashboard:Dashboard){
//     const beforeList = await getList(dashboard.birthdayCards);
//     await dashboardPage.clickOnSeeAllBirthdaysButton(dashboard);
//     // await dashboardPage.clickOnShowLessButton(dashboard);
//     await expect(dashboard.showLessButton).toBeVisible();
//     const afterList = await getList(dashboard.birthdayCards);
//     expect(afterList.length).toBeGreaterThan(beforeList.length);
// }

// export async function seeAllBirthdays(page:Page,dashboard:Dashboard,employee:Employees,data: FullEmployee){
//     await EmployeeController.addEmployeeDetails(page,employee,data);
//     await dashboardPage.clickOnDashboardMenu(dashboard);
//     const birthdaysList = await getList(dashboard.birthdayCards);

// }