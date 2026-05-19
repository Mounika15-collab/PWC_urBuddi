import { Page,expect } from '@playwright/test';
import * as clientPage from '../pages/ClientBillingPage';
import { GeneratedEmployee } from '../utils/CommonUtils';
import { ClientBilling } from '../fixtures/Fixture';


export interface SharedData {
  email: string;
}

export async function navigateToClientBillingModule(clientBilling: ClientBilling){
    await clientPage.clickOnBillingMenu(clientBilling);
    await clientPage.clickOnClients(clientBilling);
}

export async function AddClientWithValidData(page:Page,clientName: GeneratedEmployee,clientBilling: ClientBilling){
    await navigateToClientBillingModule(clientBilling);
    await clientPage.clickOnAddClientButton(clientBilling);
    await clientPage.verifyAddClientFrameHeading(clientBilling);
    await clientPage.enterName(clientName,clientBilling);
    await clientPage.enterClientEmail(clientBilling);
    await clientPage.selectTransferMode(clientBilling);
    await clientPage.enterAddress(clientBilling);
    await clientPage.enterState(clientBilling);
    const selectedCountry =await clientPage.selectCountryFromDropdown(clientBilling);
    await clientPage.enterClientEmail(clientBilling);
    await clientPage.clickOnBillingEmailCheckBox(clientBilling);
    if(selectedCountry==='India')
    {
        await expect(clientBilling.gstNumberTextfield).toBeVisible();
        await expect(clientBilling.gstNumberTextfield).toBeEnabled();
        await clientPage.enterGSTNumber(clientBilling);
    }
    else{
        await expect(clientBilling.gstNumberTextfield).not.toBeVisible();
    }
    await clientPage.enterCCEmail(clientBilling);
    await clientPage.enterBCCEmail(clientBilling);
    await clientPage.clickOnAddButton(clientBilling);
    await clientPage.verifyClientAddedToast(page);
}

export async function addClientWithoutEnteringData(page:Page,clientBilling: ClientBilling){
    await navigateToClientBillingModule(clientBilling);
    await clientPage.clickOnAddClientButton(clientBilling);
    await clientPage.verifyAddClientFrameHeading(clientBilling);
    await clientPage.clickOnAddButton(clientBilling);
    await clientPage.verifyEmptyDataClientForm(clientBilling);
    await clientPage.verifyClientCreatedSuccessToast(page);
}

export async function addClientWithInvalidData(page:Page,clientBilling: ClientBilling,clientName: GeneratedEmployee){
    await navigateToClientBillingModule(clientBilling);
    await clientPage.clickOnAddClientButton(clientBilling);
    await clientPage.verifyAddClientFrameHeading(clientBilling);
    await clientPage.enterName(clientName,clientBilling);
    await clientPage.enterAddress(clientBilling);
    await clientPage.enterState(clientBilling);
    const selectedCountry =await clientPage.selectCountryFromDropdown(clientBilling);
    await clientPage.enterClientInvalidEmail(clientBilling);
    await clientPage.clickOnBillingEmailCheckBox(clientBilling);
    if(selectedCountry==='India')
    {
        await expect(clientBilling.gstNumberTextfield).toBeVisible();
        await expect(clientBilling.gstNumberTextfield).toBeEnabled();
        await clientPage.enterGSTNumber(clientBilling);
    }
    await clientPage.enterCCEmail(clientBilling);
    await clientPage.enterBCCEmail(clientBilling);
    await clientPage.clickOnAddButton(clientBilling);
    await clientPage.verifyEmailFieldErrors(clientBilling);
    await clientPage.verifyClientCreatedSuccessToast(page);
}

export async function addclientWithDuplicateData(page:Page,clientName:GeneratedEmployee,clientBilling: ClientBilling){
    await navigateToClientBillingModule(clientBilling);
    await AddClientWithValidData(page,clientName,clientBilling);
    await clientPage.clickOnAddClientButton(clientBilling);
    await clientPage.verifyAddClientFrameHeading(clientBilling);
    await clientPage.enterName(clientName,clientBilling);
    await clientPage.enterDuplicateClientEmail(clientBilling);
    await clientPage.selectTransferMode(clientBilling);
    await clientPage.enterAddress(clientBilling);
    await clientPage.enterState(clientBilling);
    const selectedCountry =await clientPage.selectCountryFromDropdown(clientBilling);
    
    await clientPage.clickOnBillingEmailCheckBox(clientBilling);
    if(selectedCountry==='India')
    {
        await expect(clientBilling.gstNumberTextfield).toBeVisible();
        await expect(clientBilling.gstNumberTextfield).toBeEnabled();
        await clientPage.enterGSTNumber(clientBilling);
    }
    await clientPage.enterCCEmail(clientBilling);
    await clientPage.enterBCCEmail(clientBilling);
    await clientPage.clickOnAddButton(clientBilling);
    await clientPage.verifyErrorMessage(clientBilling);
    await clientPage.verifyClientCreatedSuccessToast(page);
}
export async function updateClient(page:Page,clientBilling: ClientBilling){
    await clientPage.searchClient(clientBilling);
    await clientPage.clickOnEditIcon(page,clientBilling);
    await clientPage.verifyEditClientHeading(clientBilling);
    await clientPage.updateCountry(clientBilling);
    // await clientPage.clickOnBillingEmailCheckBox(clientBilling);
    await clientPage.enterBillingEmail(clientBilling); 
    await clientPage.enterCCEmail(clientBilling);
    await clientPage.enterBCCEmail(clientBilling);  
    await clientPage.clickUpdateButton(clientBilling);
    await clientPage.verifyClientUpdatedToast(page); 
}

export async function deleteClient(page:Page,clientBilling: ClientBilling){
    await clientPage.searchClient(clientBilling);
    await clientPage.clickOnDeleteIcon(page,clientBilling);   
    await clientPage.verifyPopupHeading(clientBilling);
    await clientPage.clickOnConfrimButtom(clientBilling);
    await clientPage.verifyClientDeletedToast(page,clientBilling);
    await clientPage.verifyClientDeletedOrNot(clientBilling);
}

