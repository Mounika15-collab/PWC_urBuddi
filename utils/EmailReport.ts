import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

dotenv.config();

async function sendReport(): Promise<void> {
  try {
    const resultsPath = path.join(process.cwd(), "results.json");

    if (!fs.existsSync(resultsPath)) {
      console.log("results.json not found. Please run tests first.");
      process.exit(1);
    }

    const results = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));

    let totalGlobal = 0;
    let passedGlobal = 0;
    let failedGlobal = 0;
    let skippedGlobal = 0;

    const aggregatedTests = new Map<string,{total: number; passed: number; failed: number; skipped: number}>();

    const failedTestNames = new Set<string>();

    function processSuite(suite: any): void {
    if (suite.suites) {
      suite.suites.forEach((subSuite: any) => processSuite(subSuite));
    }

    if (suite.specs) {
      suite.specs.forEach((spec: any) => {
      const testName = spec.title;

      if (!aggregatedTests.has(testName)) {
        aggregatedTests.set(testName, {
          total: 0, passed: 0, failed: 0, skipped: 0,
        });
      }

      const row = aggregatedTests.get(testName)!;

      totalGlobal++; 
      row.total++;

      if (spec.ok) {
        passedGlobal++;
        row.passed++;
      } else if (spec.tests.some((t: any) => t.status === 'skipped')) {
        skippedGlobal++;
        row.skipped++;
      } else {
        failedGlobal++;
        row.failed++;
        failedTestNames.add(testName);
      }
    });
  }
}

    results.suites.forEach((suite: any) => processSuite(suite));

    const overallStatus = failedGlobal > 0 ? "FAILED " : "PASSED ";

    const testRowsHtml = Array.from(aggregatedTests.entries())
      .map(
        ([name, data]) => `
      <tr>
        <td style="text-align:left; padding: 8px; border: 1px solid #ddd;">${name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${data.total}</td>
        <td style="color:green; font-weight:bold; padding: 8px; border: 1px solid #ddd;">${data.passed}</td>
        <td style="color:red; font-weight:bold; padding: 8px; border: 1px solid #ddd;">${data.failed}</td>
        <td style="color:orange; font-weight:bold; padding: 8px; border: 1px solid #ddd;">${data.skipped}</td>
      </tr>`
      )
      .join("");

    const summaryHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <p>Hi Team,</p>
      <p>Please find the aggregated Automation Report for <strong>urBuddi</strong>.</p>

      <h3>Test Summary</h3>
      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; text-align: center; width: 400px;">
        <tr style="background-color: #f2f2f2;">
          <th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th>
        </tr>
        <tr>
          <td>${totalGlobal}</td>
          <td style="color:green;font-weight:bold;">${passedGlobal}</td>
          <td style="color:red;font-weight:bold;">${failedGlobal}</td>
          <td style="color:orange;font-weight:bold;">${skippedGlobal}</td>
        </tr>
      </table>

      <h3>Testcase Breakdown</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; text-align: center; width: 100%;">
        <tr style="background-color: #f2f2f2;">
          <th style="text-align:left;">Testcase Name</th>
          <th>Total Runs</th><th>Passed</th><th>Failed</th><th>Skipped</th>
        </tr>
        ${testRowsHtml}
      </table>

      ${
        failedTestNames.size > 0
          ? `
      <h3 style="color:red;">Failed Tests</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; border-color: red;">
        <tr style="background-color: #ffeeee;">
          <th style="color:red; text-align:left;">Failed Testcase Name</th>
        </tr>
        ${Array.from(failedTestNames)
          .map(
            (name) =>
              `<tr><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>`
          )
          .join("")}
      </table>`
          : ""
      }

      <p style="margin-top: 20px;">Thanks and Regards,<br/><strong>QA Team</strong></p>
    </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const now = new Date();
    const formattedDate = now.toLocaleString();

    await transporter.sendMail({
      from: `"QA Team" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Automation Report - urBuddi | ${formattedDate}`,
      html: summaryHtml,
      attachments: [
        {
          filename: "PlaywrightReport.html",
          path: path.join(process.cwd(), "playwright-report", "index.html"),
        },
      ],
    });

    console.log("Automation report email sent successfully.");
  } catch (error) {
    console.error("Error sending automation report:", error);
    process.exit(1);
  }
}

sendReport();