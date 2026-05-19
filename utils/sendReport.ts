import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

dotenv.config();

function getReason(errorMessage: string) {
  const msg = errorMessage.toLowerCase();

  if (msg.includes("locator") || msg.includes("not found"))
    return "Element not found";

  if (msg.includes("timeout") || msg.includes("waiting"))
    return "Timing issue / element not loaded";

  if (msg.includes("undefined") || msg.includes("null"))
    return "Script error";

  if (msg.includes("expect"))
    return "Expected result mismatch";

  return "Unknown failure";
}

async function sendReport() {
  const resultsPath = path.join(process.cwd(), "results.json");

  if (!fs.existsSync(resultsPath)) {
    console.log("❌ results.json not found");
    return;
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));

  let total = 0,
    passed = 0,
    failed = 0,
    skipped = 0;

  const specMap = new Map<string, any[]>();
  const failedTests: any[] = [];

  function processSuite(suite: any) {
    if (suite.suites) suite.suites.forEach(processSuite);

    if (suite.specs) {
      suite.specs.forEach((spec: any) => {
        const specFile = path.basename(spec.file || "Unknown");

        if (!specMap.has(specFile)) specMap.set(specFile, []);

        total++;

        if (spec.ok) {
          passed++;
          specMap.get(specFile)?.push({
            "Test Case": spec.title,
            Status: "Passed",
            Reason: "",
          });
        } else if (spec.tests.some((t: any) => t.status === "skipped")) {
          skipped++;
          specMap.get(specFile)?.push({
            "Test Case": spec.title,
            Status: "Skipped",
            Reason: "",
          });
        } else {
          failed++;

          const test = spec.tests[0];
          let reason = "Unknown failure";

          if (test?.results?.length > 0) {
            const failedResult = [...test.results]
              .reverse()
              .find((r: any) => r.error);

            if (failedResult?.error) {
              reason = getReason(failedResult.error.message || "");
            }
          }

          const row = {
            specFile,
            "Test Case": spec.title,
            Status: "Failed",
            Reason: reason,
          };

          specMap.get(specFile)?.push(row);
          failedTests.push(row);
        }
      });
    }
  }

  results.suites.forEach(processSuite);

  const workbook = XLSX.utils.book_new();

  specMap.forEach((tests, specFile) => {
    const sheetData = tests.map((t) => ({
      "Test Case": t["Test Case"],
      Status: t.Status,
      Reason: t.Reason,
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, specFile);
  });

  const excelPath = path.join(process.cwd(), "Automation_Report.xlsx");
  XLSX.writeFile(workbook, excelPath);

  const failedRowsHtml = failedTests
    .map(
      (t) => `
<tr>
<td>${t.specFile}</td>
<td>${t["Test Case"]}</td>
<td>${t.Reason}</td>
</tr>`
    )
    .join("");

  const html = `
  <div style="font-family: Arial;">
  
  <h2>Automation Report</h2>

  <h3>Summary</h3>
  <table border="1" cellpadding="8" style="border-collapse:collapse;">
    <tr style="background:#f2f2f2;">
      <th>Total</th><th>Passed</th><th>Failed</th><th>Skipped</th>
    </tr>
    <tr>
      <td>${total}</td>
      <td style="color:green;font-weight:bold;">${passed}</td>
      <td style="color:red;font-weight:bold;">${failed}</td>
      <td style="color:orange;font-weight:bold;">${skipped}</td>
    </tr>
  </table>

  ${
    failed > 0
      ? `
  <h3 style="color:red;">Failed Test Cases</h3>
  <table border="1" cellpadding="8" style="width:100%; border-collapse:collapse;">
    <tr style="background:#ffe6e6;">
      <th>Spec File</th>
      <th>Test Case</th>
      <th>Reason</th>
    </tr>
    ${failedRowsHtml}
  </table>`
      : `<p style="color:green;">All tests passed successfully</p>`
  }

  <p><b>Attachments:</b></p>
  <ul>
    <li>📊 Automation_Report.xlsx</li>
    <li>📄 PlaywrightReport.html</li>
  </ul>

  <p><i>Note: For full report, open locally from playwright-report folder.</i></p>

  <p>Thanks & Regards,<br/>QA Team</p>
  </div>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const htmlReportPath = path.join(
    process.cwd(),
    "playwright-report",
    "index.html"
  );

  const attachments: any[] = [
    {
      filename: "Automation_Report.xlsx",
      path: excelPath,
    },
  ];

  if (fs.existsSync(htmlReportPath)) {
    attachments.push({
      filename: "PlaywrightReport.html",
      path: htmlReportPath,
    });
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `Automation Report - ${new Date().toLocaleString()}`,
    html,
    attachments,
  });

  console.log("Email sent with Excel + HTML report");
}

sendReport();