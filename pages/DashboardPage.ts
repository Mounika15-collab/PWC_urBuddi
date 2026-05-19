import { Page, expect } from '@playwright/test';
import { clickElement, fillInput, getSharedData } from '../utils/CommonActions';
import {Dashboard} from '../fixtures/Fixture';
import { getWidgetItems } from '../utils/CommonUtils';
import  testData from '../testdata/StaticData.json';


export function getDashboardLocators(page: Page)
{
  return{    
    dashBoardMenu:page.locator('//p[text()="Dashboard"]/..//div[@class="nav-item-icon"]'),
    logOutMenu: page.locator('//p[text()="Logout"]'),
    confirmButton: page.locator('//button[text()="Yes"]'),
    logoutCondirmationPopupHeading: page.locator('//p[text()="Logout" and  @class="modal-heading"]'),
    addHolidaysButton:page.locator('//button[text()="Add Holidays"]'),
    addHolidaysConfirmationPopupHeading:page.locator('//p[text()="Add Holidays" and  @class="modal-heading"]'),
    occasionTextfield:page.locator('input[name="event"]',),
    DateField:page.locator('input[name="date"]'),
    submitButton:page.locator('//button[text()="Submit"]'),
    cancelButton:page.locator('//button[text()="Cancel"]'), 
    validateHoliday:page.locator('li[class="holidays-card"]'),  
    holidayCrossButton:page.locator('svg[class="holiday-delete-icon"]'),
    deleteConfirmationPopupHeading:page.locator('//p[text()="Confirm Delete"]'),
    addEventsButton:page.locator('//button[text()="Add Events"]'),
    eventTextField:page.locator('input[name="event"]'),
    validateEvents:page.locator('p[class="event-name"]'),
    eventCrossButton:page.locator('svg[class="event-delete-icon"]'),
    birthdaysWidget:page.locator('.birthday-container'),
    birthdayCards: page.locator('.birthday-card'),
    birthdayEmployeename:page.locator('.birthday-container .name-heading'),    
    seeAllBirthdaysButton:page.locator('//p[starts-with(text(),"See All Birthday")]/..'),
    eventsWidget:page.locator('.events-container').filter({ hasText: "Event's" }),
    eventCards:page.locator('.events-card'),
    eventName:page.locator('.event-name'),
    seeAllEventsButton:page.locator('//p[starts-with(text(),"See All Event")]/..'),
    holidaysWidget:page.locator('.events-container').filter({ hasText: "Holiday's" }),
    holidaysCard:page.locator('.holidays-card'),
    holidayName:page.locator('.holiday-name'),
    seeAllHolidaysButton:page.locator('//p[starts-with(text(),"See All Holiday")]/..'),
    workAnniversaryWidget:page.locator('.work-anniversary-container'),
    workAnniversaryCard:page.locator('.work-anniversary-card'),
    workAnniversaryName:page.locator('.work-anniversary-container .name-heading'),
    seeAllAnniversaries:page.locator('//p[starts-with(text(),"See All Anniversaries")]/..'),
    showLessButton:page.locator('//p[text()="Show Less"]/..'),
    
  };
}

export async function clickOnDashboardMenu(dashboard:Dashboard){
  await expect(dashboard.dashBoardMenu).toBeVisible();
  await clickElement(dashboard.dashBoardMenu);
}

export async function clickOnLogOutMenu(page:Page,dashboard: Dashboard){
  await page.waitForLoadState('domcontentloaded');
  await dashboard.logOutMenu.waitFor({ state: 'visible', timeout: 10000 });
  await clickElement(dashboard.logOutMenu);

  await expect(dashboard.logoutCondirmationPopupHeading).toHaveText('Logout');
}

export async function clickOnConfirmButton(dashboard: Dashboard) {
  await expect(dashboard.confirmButton).toBeVisible();
  await clickElement(dashboard.confirmButton);
}

export async function clickOnAddHolidaysButton(dashboard: Dashboard){
  await expect(dashboard.addHolidaysButton).toBeVisible();
  await clickElement(dashboard.addHolidaysButton);
}

export async function enterOccasion(dashboard: Dashboard,occasion: string){
  await expect(dashboard.addHolidaysConfirmationPopupHeading).toBeVisible();
  await expect(dashboard.occasionTextfield).toBeVisible();
  await fillInput(dashboard.occasionTextfield,occasion);
}

export async function enterDate(dashboard:Dashboard, date: string)
{
  await expect(dashboard.DateField).toBeVisible();
  await fillInput(dashboard.DateField,date);
}

export async function clickSubmitButton(dashboard:Dashboard){
  await expect(dashboard.submitButton).toBeVisible();
  await clickElement(dashboard.submitButton);
}

export async function validateHolidayInHolidayWidget(dashboard: Dashboard,data: { occasion: string; date: string }) {
  const holiday = dashboard.validateHoliday.filter({hasText: data.occasion });
  await expect(holiday.locator('.holiday-name')).toHaveText(data.occasion);
}

export async function clickOnHolidayCrossButton(dashboard:Dashboard){
  await expect(dashboard.holidayCrossButton).toBeVisible();
  await clickElement(dashboard.holidayCrossButton.first());
  // await expect(dashboard.deleteConfirmationPopupHeading).toBeVisible();
}

export async function clickOnAddEventsButton(dashboard:Dashboard){
  await expect(dashboard.addEventsButton).toBeVisible();
  await clickElement(dashboard.addEventsButton);
}

export async function enterEvent(dashboard:Dashboard,event:string){
  await fillInput(dashboard.eventTextField,event)
}

export async function clickOnEventCrossButton(dashboard:Dashboard){
  await expect(dashboard.eventCrossButton).toBeVisible();
  await clickElement(dashboard.eventCrossButton.first());
  await expect(dashboard.deleteConfirmationPopupHeading).toBeVisible();
}

export async function clickOnSeeAllBirthdaysButton(dashboard:Dashboard){
  await expect(dashboard.seeAllBirthdaysButton).toBeVisible();
  await clickElement(dashboard.seeAllBirthdaysButton);
}

export async function clickOnSeeAllHoidaysButton(dashboard:Dashboard){
  await expect(dashboard.seeAllHolidaysButton).toBeVisible();
  await clickElement(dashboard.seeAllHolidaysButton);
}

export async function clickOnseeAllEventsButton(dashboard:Dashboard){
  await expect(dashboard.seeAllEventsButton).toBeVisible();
  await clickElement(dashboard.seeAllEventsButton);
}

export async function clickOnSeeAllAnniversariesButton(dashboard:Dashboard){
  await expect(dashboard.seeAllEventsButton).toBeVisible();
  await clickElement(dashboard.seeAllEventsButton);
}

export async function clickOnShowLessButton(dashboard:Dashboard){
  await expect(dashboard.showLessButton).toBeVisible();
  await clickElement(dashboard.showLessButton);
}
