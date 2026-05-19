import * as expenditureController from '../controller/ExpenditureController';
import expenditureData from '../testdata/StaticData.json';
import { test} from '../fixtures/Fixture';


test.describe('Expenditure management',async()=>{
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
      });

    test('Verify user is able to upload bill in Expenditure page',async({page,expenditure})=>{
        await expenditureController.uploadBill(page,expenditure);
    })

    test('Verify user is able to download the files in Expenditure page',async({page,expenditure})=>{
        await expenditureController.downloadFiles(page,expenditure);
    })

    test('Verify user is able to export expenditure data in Expenditure page',async({page,expenditure})=>{
        const columns = expenditureData.ExpenditureDetails.expenditureColumns;
        const gridColumns = columns.map(c => ({ key: c.key,colId: c.colId}));
        const excelColumns = columns.map(c => ({key: c.key,header: c.header}));
        await expenditureController.exportAndValidate(page,expenditure,gridColumns,excelColumns);
    })

    test('Verify user is able to export data for the selected months in Expenditure Page',async({page,expenditure})=>{
        const columns = expenditureData.ExpenditureDetails.expenditureColumns;
        const gridColumns = columns.map(c => ({ key: c.key,colId: c.colId}));
        const excelColumns = columns.map(c => ({key: c.key,header: c.header}));
        await expenditureController.exportDataForSelectedMonths(page,expenditure,gridColumns,excelColumns);
    })

    test('Verify the list should get dipalyed for the selcted months in Expenditure page ',async({page,expenditure})=>{
        await expenditureController.selectAndValidateMonths(page,expenditure,expenditureData);
    })
});