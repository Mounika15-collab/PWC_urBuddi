import * as  worklogController from '../controller/WorklogBillingController';
import {test} from '../fixtures/Fixture';


test.describe('Worklog management',async()=>{
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
      });

    test('Verify user is able to add Worklog in Worklogs page',async({page,projectBilling,worklog})=>{
        await worklogController.addWorklog(page,worklog,projectBilling);
    })

    test('Verify user is able to see active projects in Worklogs page',async({page,worklog})=>{
        await worklogController.checkTheActiveProjectsInWorklogsList(page,worklog);
    })

    test('Verify user is able to see paused projects in Worklogs page',async({page,worklog})=>
    {
        await worklogController.checkThePausedProjectsInWorklogsList(page,worklog);
    })

    test('Verify user is able to see closed projects in Worklogs pag e',async({page,worklog})=>
    {
        await worklogController.checkTheClosedProjectsInWorklogsList(page,worklog);
    })

    // test.skip('User is able to export current month worklog',async({page,worklog,projectBilling})=>{
    //     await worklogController.exportWorklogDataForThisMonth(page,worklog,projectBilling)
    // })

    test('Verify user is able to update the worklog details',async({page,worklog,projectBilling})=>{
        await worklogController.updateWorklog(page,worklog,projectBilling);
    })

    // test.skip('delete worklog',async({page,worklog})=>{
    //     await worklogController.deleteWorklog(page,worklog);        
    // })
})