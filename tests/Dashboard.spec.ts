import {test} from '../fixtures/Fixture';
import * as dashboardController from '../controller/DashboardController';

test.describe('Dashboard Managemnt',()=>{
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Verify user is able to add Holidays in DashBoard Page',async({page, dashboard })=>{
        await dashboardController.addHolidays(page,dashboard);
        await dashboardController.deleteHoliday(dashboard);
    });

    test('Verify user is able to add Events in DashBoard Page',async({page,dashboard})=>{
        await dashboardController.addEvents(page,dashboard);
    });
});