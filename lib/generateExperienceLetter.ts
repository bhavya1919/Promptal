export const generateExperienceLetter = async (
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

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(18);
    doc.text("EXPERIENCE LETTER", 60, 40);

    doc.setFontSize(11);

    doc.text(`Date: ${today}`, 20, 60);

    doc.text(
        `This is to certify that ${candidateName}`,
        20,
        90
    );

    doc.text(
        `worked as ${jobTitle} at ${companyName}.`,
        20,
        105
    );

    doc.text(
        `During their tenure, they demonstrated`,
        20,
        125
    );

    doc.text(
        `excellent technical knowledge, professionalism,`,
        20,
        140
    );

    doc.text(
        `teamwork and dedication towards assigned tasks.`,
        20,
        155
    );

    doc.text(
        `We sincerely appreciate their contributions`,
        20,
        175
    );

    doc.text(
        `and wish them success in future endeavors.`,
        20,
        190
    );

    doc.text(
        `Regards,`,
        20,
        230
    );

    doc.text(
        `HR Department`,
        20,
        245
    );

    doc.text(
        companyName,
        20,
        255
    );

    doc.save(
        `Experience_Letter_${candidateName}.pdf`
    );
    } catch (e: any) {
        console.error(e);
        alert(e.message);
    }
};