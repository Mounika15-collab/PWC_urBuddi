import { test as base } from '@playwright/test';
import { getDashboardLocators } from '../pages/DashboardPage';
import { getClientBillingLocators } from '../pages/ClientBillingPage';
import { getEmployeeLocators } from '../pages/EmployeePage';
import { getLeaveManagementLocators } from '../pages/LeaveManagementPage';
import { getProjectBillingLocators } from '../pages/ProjectsBillingPage';
import {getWorklogLocators} from '../pages/WorklogsPage';
import { getExpenditureLocators } from '../pages/ExpediturePage';

export type Dashboard = ReturnType<typeof getDashboardLocators>;
export type ClientBilling = ReturnType<typeof getClientBillingLocators>;
export type Employees = ReturnType<typeof getEmployeeLocators>;
export type LeaveManagement = ReturnType<typeof getLeaveManagementLocators>;
export type ProjectBilling = ReturnType<typeof getProjectBillingLocators>;
export type WorklogBilling=ReturnType<typeof getWorklogLocators>;
export type Expenditure=ReturnType<typeof getExpenditureLocators>;

export type Fixtures = {
  dashboard: Dashboard;
  clientBilling: ClientBilling;
  employee: Employees;
  leaveManagement: LeaveManagement;
  projectBilling: ProjectBilling;
  worklog:WorklogBilling;
  expenditure:Expenditure;
};

export const test = base.extend<Fixtures>({
  dashboard: async ({ page }, use) => {
    await use(getDashboardLocators(page));
  },

  employee: async ({ page }, use) => {
    await use(getEmployeeLocators(page));
  },

  leaveManagement: async ({ page }, use) => {
    await use(getLeaveManagementLocators(page));
  },

  expenditure:async({page},use)=>{
    await use(getExpenditureLocators(page));
  },

  clientBilling: async ({ page }, use) => {
    await use(getClientBillingLocators(page));
  },

  projectBilling: async ({ page }, use) => {
    await use(getProjectBillingLocators(page));
  },

  worklog: async({page}, use) => {
    await use(getWorklogLocators(page));
  },

});

export { expect } from '@playwright/test';