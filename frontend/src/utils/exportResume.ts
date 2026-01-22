import { Resume } from '../types/resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function exportToText(resume: Resume): string {
  let text = '';

  text += `${resume.personalInfo.fullName.toUpperCase()}\n`;
  text += `${'='.repeat(resume.personalInfo.fullName.length)}\n\n`;

  if (resume.personalInfo.email) text += `Email: ${resume.personalInfo.email}\n`;
  if (resume.personalInfo.phone) text += `Phone: ${resume.personalInfo.phone}\n`;
  if (resume.personalInfo.location) text += `Location: ${resume.personalInfo.location}\n`;
  if (resume.personalInfo.linkedin) text += `LinkedIn: ${resume.personalInfo.linkedin}\n`;
  if (resume.personalInfo.website) text += `Website: ${resume.personalInfo.website}\n`;
  text += '\n';

  if (resume.professionalSummary) {
    text += 'PROFESSIONAL SUMMARY\n';
    text += `${'-'.repeat(20)}\n`;
    text += `${resume.professionalSummary}\n\n`;
  }

  if (resume.workExperience.length > 0) {
    text += 'WORK EXPERIENCE\n';
    text += `${'-'.repeat(20)}\n`;
    resume.workExperience.forEach(exp => {
      text += `\n${exp.position}\n`;
      text += `${exp.company} | ${exp.location}\n`;
      text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      if (exp.achievements.length > 0) {
        exp.achievements.forEach(achievement => {
          text += `  • ${achievement}\n`;
        });
      }
      text += '\n';
    });
  }

  if (resume.education.length > 0) {
    text += 'EDUCATION\n';
    text += `${'-'.repeat(20)}\n`;
    resume.education.forEach(edu => {
      text += `\n${edu.degree} in ${edu.field}\n`;
      text += `${edu.institution} | ${edu.location}\n`;
      text += `Graduated: ${edu.graduationDate}\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
      text += '\n';
    });
  }

  if (resume.skills.technical || resume.skills.tools || resume.skills.soft || resume.skills.languages) {
    text += 'SKILLS\n';
    text += `${'-'.repeat(20)}\n`;
    if (resume.skills.technical && resume.skills.technical.length > 0) {
      text += `Technical: ${resume.skills.technical.join(', ')}\n`;
    }
    if (resume.skills.tools && resume.skills.tools.length > 0) {
      text += `Tools: ${resume.skills.tools.join(', ')}\n`;
    }
    if (resume.skills.soft && resume.skills.soft.length > 0) {
      text += `Soft Skills: ${resume.skills.soft.join(', ')}\n`;
    }
    if (resume.skills.languages && resume.skills.languages.length > 0) {
      text += `Languages: ${resume.skills.languages.join(', ')}\n`;
    }
    text += '\n';
  }

  if (resume.projects && resume.projects.length > 0) {
    text += 'PROJECTS\n';
    text += `${'-'.repeat(20)}\n`;
    resume.projects.forEach(project => {
      text += `\n${project.name}\n`;
      text += `${project.description}\n`;
      if (project.technologies.length > 0) {
        text += `Technologies: ${project.technologies.join(', ')}\n`;
      }
      if (project.link) text += `Link: ${project.link}\n`;
      if (project.highlights.length > 0) {
        project.highlights.forEach(highlight => {
          text += `  • ${highlight}\n`;
        });
      }
      text += '\n';
    });
  }

  if (resume.certifications && resume.certifications.length > 0) {
    text += 'CERTIFICATIONS\n';
    text += `${'-'.repeat(20)}\n`;
    resume.certifications.forEach(cert => {
      text += `\n${cert.name}\n`;
      text += `${cert.issuer} | ${cert.date}\n`;
      if (cert.expiryDate) text += `Expires: ${cert.expiryDate}\n`;
    });
  }

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
  // Find the resume preview element
  const resumeElement = document.getElementById('resume-preview');
  if (!resumeElement) {
    console.error('Resume preview element not found');
    alert('Please preview your resume first before exporting to PDF.');
    return;
  }

  const originalOpacity = resumeElement.style.opacity;

  try {
    // Show loading indicator
    resumeElement.style.opacity = '0.5';

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
    resumeElement.style.opacity = originalOpacity;

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

    // If content is wider than A4, scale to fit width
    if (imgAspectRatio > a4AspectRatio) {
      pdfHeight = a4Width / imgAspectRatio;
    } else {
      pdfWidth = a4Height * imgAspectRatio;
    }

    // Create PDF with A4 size
    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png', 1.0);

    // Add image to PDF, centered
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
    resumeElement.style.opacity = originalOpacity;
  }
}

function generatePrintableHTML(resume: Resume, templateStyle: string): string {
  const styles = getTemplateStyles(templateStyle);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${resume.personalInfo.fullName} - Resume</title>
      <style>
        ${styles}
      </style>
    </head>
    <body>
      ${generateResumeHTML(resume, templateStyle)}
    </body>
    </html>
  `;
}

function getTemplateStyles(templateStyle: string): string {
  const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
      color: #333;
      max-width: 180mm;
      margin: 0 auto;
      padding: 18mm 18mm 14mm 18mm;
      font-size: 11pt;
    }

    @page {
      size: A4;
      margin: 12mm 14mm;
    }

    @media print {
      body {
        padding: 12mm 14mm;
      }
    }

    h1 {
      font-size: 24pt;
      margin-bottom: 0.1in;
      color: #1a1a1a;
    }

    h2 {
      font-size: 14pt;
      margin-top: 0.15in;
      margin-bottom: 0.1in;
      padding-bottom: 0.05in;
      border-bottom: 2px solid #333;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    h3 {
      font-size: 12pt;
      margin-top: 0.08in;
      margin-bottom: 0.03in;
    }

    .contact-info {
      margin-bottom: 0.15in;
      font-size: 10pt;
      color: #555;
    }

    .contact-info span {
      margin-right: 0.2in;
    }

    .section {
      margin-bottom: 0.15in;
    }

    .job, .education-item, .project, .cert {
      margin-bottom: 0.12in;
    }

    .job-header, .edu-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.03in;
    }

    .company, .institution {
      font-style: italic;
      color: #555;
      font-size: 10pt;
    }

    .date {
      color: #666;
      font-size: 10pt;
    }

    ul {
      margin-left: 0.2in;
      margin-top: 0.03in;
    }

    li {
      margin-bottom: 0.03in;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.05in;
      margin-top: 0.05in;
    }

    .skill-category {
      margin-bottom: 0.05in;
    }

    .skill-category strong {
      display: inline-block;
      min-width: 0.8in;
    }

    .summary {
      margin-bottom: 0.15in;
      text-align: justify;
    }
  `;

  if (templateStyle === 'modern') {
    return baseStyles + `
      h1 { color: #2563eb; }
      h2 {
        border-bottom: 3px solid #2563eb;
        color: #2563eb;
      }
      h3 { color: #1e40af; }
    `;
  } else if (templateStyle === 'minimal') {
    return baseStyles + `
      h2 {
        border-bottom: 1px solid #999;
        font-weight: 500;
      }
      body {
        font-family: 'Times New Roman', serif;
      }
    `;
  }

  return baseStyles;
}

function generateResumeHTML(resume: Resume, templateStyle: string): string {
  let html = `
    <h1>${resume.personalInfo.fullName}</h1>
    <div class="contact-info">
      ${resume.personalInfo.email ? `<span>${resume.personalInfo.email}</span>` : ''}
      ${resume.personalInfo.phone ? `<span>${resume.personalInfo.phone}</span>` : ''}
      ${resume.personalInfo.location ? `<span>${resume.personalInfo.location}</span>` : ''}
      ${resume.personalInfo.linkedin ? `<span>${resume.personalInfo.linkedin}</span>` : ''}
      ${resume.personalInfo.website ? `<span>${resume.personalInfo.website}</span>` : ''}
    </div>
  `;

  if (resume.professionalSummary) {
    html += `
      <div class="section">
        <h2>Professional Summary</h2>
        <p class="summary">${resume.professionalSummary}</p>
      </div>
    `;
  }

  if (resume.workExperience.length > 0) {
    html += `<div class="section"><h2>Work Experience</h2>`;
    resume.workExperience.forEach(exp => {
      html += `
        <div class="job">
          <div class="job-header">
            <div>
              <h3>${exp.position}</h3>
              <div class="company">${exp.company} | ${exp.location}</div>
            </div>
            <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
          </div>
          <ul>
            ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (resume.education.length > 0) {
    html += `<div class="section"><h2>Education</h2>`;
    resume.education.forEach(edu => {
      html += `
        <div class="education-item">
          <div class="edu-header">
            <div>
              <h3>${edu.degree} in ${edu.field}</h3>
              <div class="institution">${edu.institution} | ${edu.location}</div>
            </div>
            <div class="date">${edu.graduationDate}</div>
          </div>
          ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
        </div>
      `;
    });
    html += `</div>`;
  }

  if (resume.skills.technical || resume.skills.tools || resume.skills.soft || resume.skills.languages) {
    html += `<div class="section"><h2>Skills</h2><div class="skills-grid">`;
    if (resume.skills.technical && resume.skills.technical.length > 0) {
      html += `<div class="skill-category"><strong>Technical:</strong> ${resume.skills.technical.join(', ')}</div>`;
    }
    if (resume.skills.tools && resume.skills.tools.length > 0) {
      html += `<div class="skill-category"><strong>Tools:</strong> ${resume.skills.tools.join(', ')}</div>`;
    }
    if (resume.skills.soft && resume.skills.soft.length > 0) {
      html += `<div class="skill-category"><strong>Soft Skills:</strong> ${resume.skills.soft.join(', ')}</div>`;
    }
    if (resume.skills.languages && resume.skills.languages.length > 0) {
      html += `<div class="skill-category"><strong>Languages:</strong> ${resume.skills.languages.join(', ')}</div>`;
    }
    html += `</div></div>`;
  }

  if (resume.projects && resume.projects.length > 0) {
    html += `<div class="section"><h2>Projects</h2>`;
    resume.projects.forEach(project => {
      html += `
        <div class="project">
          <h3>${project.name}</h3>
          <p>${project.description}</p>
          ${project.technologies.length > 0 ? `<p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>` : ''}
          ${project.link ? `<p><strong>Link:</strong> ${project.link}</p>` : ''}
          ${project.highlights.length > 0 ? `<ul>${project.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
        </div>
      `;
    });
    html += `</div>`;
  }

  if (resume.certifications && resume.certifications.length > 0) {
    html += `<div class="section"><h2>Certifications</h2>`;
    resume.certifications.forEach(cert => {
      html += `
        <div class="cert">
          <h3>${cert.name}</h3>
          <p>${cert.issuer} | ${cert.date}${cert.expiryDate ? ` | Expires: ${cert.expiryDate}` : ''}</p>
        </div>
      `;
    });
    html += `</div>`;
  }

  return html;
}
