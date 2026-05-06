import jsPDF from "jspdf";

export function generateReceipt(data) {
  const doc = new jsPDF();

  const {
    name,
    meter,
    disco,
    amount,
    token,
    units,
    transaction_id
  } = data;

  const date = new Date().toLocaleString();

  // TITLE
  doc.setFontSize(18);
  doc.text("CiwagLink Receipt", 20, 20);

  doc.setFontSize(12);

  doc.text(`Date: ${date}`, 20, 35);
  doc.text(`Transaction ID: ${transaction_id}`, 20, 45);

  doc.text(`Customer: ${name}`, 20, 60);
  doc.text(`Meter Number: ${meter}`, 20, 70);
  doc.text(`Disco: ${disco}`, 20, 80);

  doc.text(`Amount Paid: ₦${amount}`, 20, 95);

  if (units) {
    doc.text(`Units: ${units}`, 20, 105);
  }

  if (token) {
    doc.setFontSize(14);
    doc.text("Electricity Token:", 20, 120);

    doc.setFontSize(16);
    doc.text(token, 20, 130);
  }

  doc.save("ciwaglink-receipt.pdf");
}