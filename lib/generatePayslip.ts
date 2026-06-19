import { jsPDF } from "jspdf";

export const generatePayslip = (
  employeeName: string,
  designation: string
) => {
  const doc = new jsPDF();

  const basicSalary = 25000;
  const hra = 5000;
  const allowance = 3000;
  const deductions = 2000;

  const grossSalary =
    basicSalary + hra + allowance;

  const netSalary =
    grossSalary - deductions;

  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("PROMTAL JOBS", 20, 16);

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(18);
  doc.text("PAYSLIP", 80, 40);

  doc.setFontSize(11);

  doc.text(
    `Employee: ${employeeName}`,
    20,
    70
  );

  doc.text(
    `Designation: ${designation}`,
    20,
    85
  );

  doc.text(
    `Basic Salary: ₹${basicSalary}`,
    20,
    110
  );

  doc.text(
    `HRA: ₹${hra}`,
    20,
    125
  );

  doc.text(
    `Allowance: ₹${allowance}`,
    20,
    140
  );

  doc.text(
    `Gross Salary: ₹${grossSalary}`,
    20,
    165
  );

  doc.text(
    `Deductions: ₹${deductions}`,
    20,
    180
  );

  doc.text(
    `Net Salary: ₹${netSalary}`,
    20,
    200
  );

  doc.text(
    `HR Department`,
    20,
    240
  );

  doc.text(
    `Promtal Jobs`,
    20,
    250
  );

  doc.save(
    `Payslip_${employeeName}.pdf`
  );
};
