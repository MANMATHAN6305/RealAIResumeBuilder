import { Resume } from '../types/resume';

// Removed top-level imports of jsPDF and html2canvas to avoid module-initialization-time errors.
// We'll dynamically import them inside exportToPDF when needed.

export function exportToText(resume: Resume): string {
  let text = '';
  // ... existing code unchanged ...
  text += `${resume.personalInfo.fullName.toUpperCase()}\n`;
  text += `${'='.repeat(resume.personalInfo.fullName.length)}\n\n`;
  // (rest of function unchanged - keep the existing exportToText implementation)
  // For brevity in this proposal I omitted the long unchanged parts.
  return text;
}

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(resume: Resume, templateStyle: string): Promise<void> {
  // Dynamically import heavy browser-only libs to avoid breakage during module evaluation
  let html2canvas: any;
  let jsPDF: any;
  try {
    html2canvas = (await import('html2canvas')).default;
  } catch (err) {
    console.error('html2canvas import failed:', err);
    alert('PDF export is unavailable because html2canvas failed to load.');
    return;
  }

  try {
    jsPDF = (await import('jspdf')).default;
  } catch (err) {
    console.error('jspdf import failed:', err);
    alert('PDF export is unavailable because jspdf failed to load.');
    return;
  }

  // Find the resume preview element
  const resumeElement = document.getElementById('resume-preview');
  if (!resumeElement) {
    console.error('Resume preview element not found');
    alert('Please preview your resume first before exporting to PDF.');
    return;
  }

  const originalOpacity = (resumeElement as HTMLElement).style.opacity;

  try {
    // Show loading indicator
    (resumeElement as HTMLElement).style.opacity = '0.5';

    // Capture the element as canvas with high quality
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: resumeElement.scrollWidth,
      height: resumeElement.scrollHeight,
    });

    // Restore opacity
    (resumeElement as HTMLElement).style.opacity = originalOpacity;

    // A4 dimensions in mm: 210mm × 297mm
    const a4Width = 210;
    const a4Height = 297;

    // Calculate dimensions maintaining aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const imgAspectRatio = imgWidth / imgHeight;
    const a4AspectRatio = a4Width / a4Height;

    let pdfWidth = a4Width;
    let pdfHeight = a4Height;

    if (imgAspectRatio > a4AspectRatio) {
      pdfHeight = a4Width / imgAspectRatio;
    } else {
      pdfWidth = a4Height * imgAspectRatio;
    }

    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const xOffset = (a4Width - pdfWidth) / 2;
    const yOffset = (a4Height - pdfHeight) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfWidth, pdfHeight, undefined, 'FAST');

    // Generate filename
    const filename = `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'resume'}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    (resumeElement as HTMLElement).style.opacity = originalOpacity;
  }
}

// Keep the rest of the helper functions (generatePrintableHTML, getTemplateStyles, generateResumeHTML)
// unchanged in their logic; they can remain as-is below.
