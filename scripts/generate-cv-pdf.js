import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CV data
const cvPath = process.argv[2] === 'en'
  ? path.join(__dirname, '../cv_english.json')
  : path.join(__dirname, '../cv.json');

const cv = JSON.parse(fs.readFileSync(cvPath, 'utf-8'));
const lang = process.argv[2] === 'en' ? 'en' : 'es';

// Labels based on language
const labels = {
  es: {
    experience: 'Experiencia Laboral',
    education: 'Educación',
    skills: 'Habilidades',
    projects: 'Proyectos',
    certificates: 'Certificaciones',
    languages: 'Idiomas',
    strengths: 'Fortalezas'
  },
  en: {
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certificates: 'Certifications',
    languages: 'Languages',
    strengths: 'Strengths'
  }
};

const l = labels[lang];

// Labels for summary section
const summaryLabel = lang === 'en' ? 'Professional Summary' : 'Resumen Profesional';
const volunteerLabel = lang === 'en' ? 'Volunteer' : 'Voluntariado';

// Build contact line as plain text with pipes
const contactParts = [cv.basics.email];
if (cv.basics.phone) contactParts.push(cv.basics.phone);
const locationText = cv.basics.location.city + (cv.basics.location.region ? ', ' + cv.basics.location.region : '');
contactParts.push(locationText);
cv.basics.profiles.filter(p => p.network !== 'Download').forEach(p => {
  contactParts.push(p.url.replace('https://www.', '').replace('https://', ''));
});
const contactLine = contactParts.join('  |  ');

// Generate HTML
const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cv.basics.name} - CV</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 10.5px;
      line-height: 1.5;
      color: #000;
      padding: 0;
      max-width: 100%;
    }

    a {
      color: #000;
      text-decoration: none;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid #000;
    }

    .name {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 2px;
    }

    .title {
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 6px;
    }

    .contact {
      font-size: 9.5px;
    }

    /* Sections */
    .section {
      margin-bottom: 14px;
    }

    .section-title {
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      padding-bottom: 2px;
      border-bottom: 1px solid #000;
    }

    /* Summary */
    .summary-text {
      font-size: 10px;
      line-height: 1.5;
    }

    /* Experience */
    .job {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .job-title {
      font-size: 10.5px;
      font-weight: 700;
    }

    .job-date {
      font-size: 10px;
      font-style: italic;
    }

    .job-company {
      font-size: 10.5px;
      font-style: italic;
      margin-bottom: 4px;
    }

    .job-summary {
      font-size: 10px;
      margin-bottom: 4px;
      line-height: 1.5;
    }

    .job-highlights {
      list-style: disc;
      margin-left: 18px;
      font-size: 10px;
    }

    .job-highlights li {
      margin-bottom: 2px;
      line-height: 1.4;
    }

    .job-skills-text {
      font-size: 10px;
      margin-top: 4px;
    }

    .job-skills-text strong {
      font-weight: 700;
    }

    /* Education */
    .education-item {
      margin-bottom: 8px;
    }

    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .education-degree {
      font-size: 10.5px;
      font-weight: 700;
    }

    .education-date {
      font-size: 10px;
      font-style: italic;
    }

    .education-institution {
      font-size: 10px;
      font-style: italic;
    }

    /* Skills */
    .skills-text {
      font-size: 10px;
      line-height: 1.6;
    }

    /* Projects */
    .project {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }

    .project-name {
      font-size: 10.5px;
      font-weight: 700;
    }

    .project-url {
      font-size: 9.5px;
      font-style: italic;
    }

    .project-description {
      font-size: 10px;
      margin-top: 2px;
    }

    /* Certificates */
    .cert-item {
      margin-bottom: 4px;
      font-size: 10px;
    }

    .cert-name {
      font-weight: 700;
    }

    .cert-issuer {
      font-style: italic;
    }

    /* Languages */
    .lang-text {
      font-size: 10px;
    }

    /* Strengths */
    .strengths-text {
      font-size: 10px;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <h1 class="name">${cv.basics.name}</h1>
    <p class="title">${cv.basics.label}</p>
    <p class="contact">${contactLine}</p>
  </header>

  <!-- Professional Summary -->
  <section class="section">
    <h2 class="section-title">${summaryLabel}</h2>
    <p class="summary-text">${cv.basics.summary.replace(/<[^>]*>/g, '')}</p>
  </section>

  <!-- Experience -->
  <section class="section">
    <h2 class="section-title">${l.experience}</h2>
    ${cv.work.map(job => `
      <div class="job">
        <div class="job-header">
          <span class="job-title">${job.position}</span>
          ${job.startDate || job.endDate ? `<span class="job-date">${job.startDate}${job.startDate && job.endDate ? ' - ' : ''}${job.endDate}</span>` : ''}
        </div>
        <div class="job-company">${job.name}</div>
        <p class="job-summary">${job.summary}</p>
        ${job.highlights && job.highlights.length > 0 ? `
          <ul class="job-highlights">
            ${job.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}
        ${job.skills && job.skills.length > 0 ? `
          <p class="job-skills-text"><strong>${lang === 'en' ? 'Skills:' : 'Destrezas:'}</strong> ${job.skills.join(', ')}</p>
        ` : ''}
      </div>
    `).join('')}
  </section>

  <!-- Volunteer -->
  ${cv.volunteer && cv.volunteer.length > 0 && cv.volunteer[0].organization !== 'Organization' ? `
  <section class="section">
    <h2 class="section-title">${volunteerLabel}</h2>
    ${cv.volunteer.map(v => `
      <div class="job">
        <div class="job-header">
          <span class="job-title">${v.position}</span>
          ${v.startDate || v.endDate ? `<span class="job-date">${v.startDate}${v.startDate && v.endDate ? ' - ' : ''}${v.endDate}</span>` : ''}
        </div>
        <div class="job-company">${v.organization}</div>
        <p class="job-summary">${v.summary}</p>
      </div>
    `).join('')}
  </section>
  ` : ''}

  <!-- Education -->
  <section class="section">
    <h2 class="section-title">${l.education}</h2>
    ${cv.education.map(edu => `
      <div class="education-item">
        <div class="education-header">
          <span class="education-degree">${edu.area}</span>
          <span class="education-date">${edu.startDate} - ${edu.endDate}</span>
        </div>
        <div class="education-institution">${edu.institution}</div>
      </div>
    `).join('')}
  </section>

  <!-- Skills -->
  <section class="section">
    <h2 class="section-title">${l.skills}</h2>
    <p class="skills-text">${cv.skills.map(s => s.name).join(', ')}</p>
  </section>

  <!-- Projects -->
  <section class="section">
    <h2 class="section-title">${l.projects}</h2>
    ${cv.projects.filter(p => p.isActive).map(project => `
      <div class="project">
        <span class="project-name">${project.name}</span>
        ${project.url ? ` <span class="project-url">(${project.url})</span>` : ''}
        <p class="project-description">${project.description}</p>
      </div>
    `).join('')}
  </section>

  <!-- Languages -->
  <section class="section">
    <h2 class="section-title">${l.languages}</h2>
    <p class="lang-text">${cv.languages.map(l => l.language + ' (' + l.fluency + ')').join(', ')}</p>
  </section>

  <!-- Strengths -->
  <section class="section">
    <h2 class="section-title">${l.strengths}</h2>
    <p class="strengths-text">${cv.strengths.join(', ')}</p>
  </section>

  <!-- Certificates -->
  <section class="section">
    <h2 class="section-title">${l.certificates}</h2>
    ${cv.certificates.map(cert => `
      <div class="cert-item">
        <span class="cert-name">${cert.name}</span> - <span class="cert-issuer">${cert.issuer}, ${cert.date}</span>
      </div>
    `).join('')}
  </section>
</body>
</html>
`;

// Generate PDF
async function generatePDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputDir = path.join(__dirname, '../public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = lang === 'en'
    ? path.join(outputDir, 'cv-edder-ramirez-en.pdf')
    : path.join(outputDir, 'cv-edder-ramirez.pdf');

  await page.pdf({
    path: outputPath,
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '40px',
      right: '40px',
      bottom: '40px',
      left: '40px'
    }
  });

  console.log(`PDF generated: ${outputPath}`);

  await browser.close();
}

generatePDF().catch(console.error);
