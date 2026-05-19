import * as clientController from '../controller/ClientBillingController';
import {getGenerateEmployee} from '../utils/CommonUtils';
import {test} from '../fixtures/Fixture';


test.describe('Client Positive Tests - @Regression', () => {
   
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('User is able to add Client',async({page,clientBilling})=>{
    const clientName = getGenerateEmployee();
    await clientController.AddClientWithValidData(page,clientName,clientBilling);
    await clientController.deleteClient(page,clientBilling);
  });

  test('User is able to Update Client',async({page,clientBilling})=>{
    const clientName = getGenerateEmployee();
    await clientController.AddClientWithValidData(page,clientName,clientBilling);
    await clientController.updateClient(page,clientBilling);
    await clientController.deleteClient(page,clientBilling);
  });
});

test.describe('Client Negative Tests',()=>{
 
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('User is able to add client with empty fields',async({page,clientBilling})=>{
    await clientController.addClientWithoutEnteringData(page,clientBilling);
  });

  test('User is able to add client with invalid Email',async({page,clientBilling})=>{
    const clientName = getGenerateEmployee();
     await clientController.addClientWithInvalidData(page,clientBilling,clientName)
  })  
  
  test('USer is able to add client with duplicate data',async({page,clientBilling})=>{
    const clientName = getGenerateEmployee();
    await clientController.addclientWithDuplicateData(page,clientName,clientBilling)
  })
})