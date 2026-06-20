export const generateOfferLetter = async (
    candidateName: string,
    jobTitle: string,
    companyName: string
) => {
    try {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();

    const today = new Date().toLocaleDateString();

    // Header
    doc.setFillColor(16, 185, 129);
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

    doc.text(
        `Dear ${candidateName},`,
        20,
        100
    );

    doc.text(
        `We are pleased to offer you the position of`,
        20,
        115
    );

    doc.text(
        `${jobTitle} at ${companyName}.`,
        20,
        125
    );

    doc.text(
        `Based on your qualifications and performance,`,
        20,
        140
    );

    doc.text(
        `we believe you will be a valuable addition`,
        20,
        150
    );

    doc.text(
        `to our organization.`,
        20,
        160
    );

    doc.text(
        `Joining Date: 01 July 2026`,
        20,
        180
    );

    doc.text(
        `Annual Package: ₹4,00,000`,
        20,
        190
    );

    doc.text(
        `Work Location: Hyderabad`,
        20,
        200
    );

    doc.text(
        `We look forward to welcoming you.`,
        20,
        220
    );

    doc.text(
        `Regards,`,
        20,
        245
    );

    doc.text(
        `HR Department`,
        20,
        255
    );

    doc.text(
        companyName,
        20,
        265
    );

        doc.save(`Offer_Letter_${candidateName}.pdf`);
    } catch (error: any) {
        console.error("PDF Generation Error:", error);
        alert("Error generating PDF: " + error.message);
    }
};
