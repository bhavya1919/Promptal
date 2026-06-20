export const generateOfferLetter = async (
    candidateName: string,
    jobTitle: string,
    companyName: string,
    template: string = "corporate"
) => {
    try {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        const data = { candidateName, jobTitle, companyName, today: new Date().toLocaleDateString() };

        switch(template) {
            case "modern":
                modernTemplate(doc, data);
                break;
            case "minimal":
                minimalTemplate(doc, data);
                break;
            default:
                corporateTemplate(doc, data);
        }

        doc.save(`Offer_Letter_${candidateName}.pdf`);
    } catch (error: any) {
        console.error("PDF Generation Error:", error);
        alert("Error generating PDF: " + error.message);
    }
};

function corporateTemplate(doc: any, data: any) {
    const { candidateName, jobTitle, companyName, today } = data;

    // Header (Blue for Corporate as requested: Blue Header, Formal Layout)
    doc.setFillColor(30, 58, 138); // Dark blue
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(companyName, 20, 16);

    // Reset color
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(18);
    doc.text("OFFER LETTER", 75, 40);

    doc.setFontSize(11);
    doc.text(`Date: ${today}`, 20, 55);
    doc.text(`Offer Ref: OL-${Date.now()}`, 20, 65);
    doc.text(`Candidate Name: ${candidateName}`, 20, 80);

    doc.text(`Dear ${candidateName},`, 20, 100);
    doc.text(`We are pleased to offer you the position of`, 20, 115);
    doc.text(`${jobTitle} at ${companyName}.`, 20, 125);
    doc.text(`Based on your qualifications and performance,`, 20, 140);
    doc.text(`we believe you will be a valuable addition`, 20, 150);
    doc.text(`to our organization.`, 20, 160);

    doc.text(`Joining Date: 01 July 2026`, 20, 180);
    doc.text(`Annual Package: ₹4,00,000`, 20, 190);
    doc.text(`Work Location: Hyderabad`, 20, 200);

    doc.text(`We look forward to welcoming you.`, 20, 220);
    doc.text(`Regards,`, 20, 245);
    doc.text(`HR Department`, 20, 255);
    doc.text(companyName, 20, 265);
}

function modernTemplate(doc: any, data: any) {
    const { candidateName, jobTitle, companyName, today } = data;

    // Gradient-like Header (Modern)
    doc.setFillColor(139, 92, 246); // Purple
    doc.rect(0, 0, 210, 30, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("OFFER OF EMPLOYMENT", 20, 20);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    
    doc.setFontSize(12);
    doc.text(`Date: ${today}`, 150, 45);

    doc.setFontSize(28);
    doc.setTextColor(139, 92, 246);
    doc.text(candidateName, 20, 60);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Role: ${jobTitle}`, 20, 75);
    doc.text(`Company: ${companyName}`, 20, 85);

    doc.setFontSize(12);
    doc.text(`Welcome to the team! We are thrilled to offer you this position.`, 20, 110);
    
    // Colored section
    doc.setFillColor(243, 244, 246);
    doc.rect(20, 120, 170, 60, "F");
    
    doc.text(`Compensation & Details:`, 25, 130);
    doc.setFont("helvetica", "bold");
    doc.text(`• Joining Date: 01 July 2026`, 25, 145);
    doc.text(`• Annual Package: ₹4,00,000`, 25, 155);
    doc.text(`• Work Location: Hyderabad`, 25, 165);

    doc.setFont("helvetica", "normal");
    doc.text(`We look forward to building the future together.`, 20, 200);

    doc.text(`HR Department`, 20, 230);
    doc.setFont("helvetica", "bold");
    doc.text(companyName, 20, 240);
}

function minimalTemplate(doc: any, data: any) {
    const { candidateName, jobTitle, companyName, today } = data;

    // Minimal Black & White
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "normal");
    
    doc.setFontSize(24);
    doc.text(companyName.toUpperCase(), 105, 30, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.text(`Date: ${today}`, 150, 50);

    doc.setFontSize(18);
    doc.text("Offer of Employment", 105, 70, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Dear ${candidateName},`, 20, 100);
    doc.text(`We are pleased to officially offer you the position of ${jobTitle}.`, 20, 115);
    
    doc.text(`Terms of Employment:`, 20, 135);
    doc.text(`Start Date: 01 July 2026`, 30, 150);
    doc.text(`Salary: ₹4,00,000 / year`, 30, 160);
    doc.text(`Location: Hyderabad`, 30, 170);

    doc.text(`Please sign below to accept this offer.`, 20, 200);

    doc.text(`________________________`, 20, 240);
    doc.text(`Signature (${candidateName})`, 20, 250);

    doc.text(`________________________`, 130, 240);
    doc.text(`HR Department`, 130, 250);
}
