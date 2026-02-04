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

// Generate HTML
const html = `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cv.basics.name} - CV</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 50px 60px;
      max-width: 100%;
    }

    a {
      color: #1a1a1a;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Header */
    .header {
      margin-bottom: 25px;
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 20px;
    }

    .name {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }

    .title {
      font-size: 14px;
      font-weight: 500;
      color: #444;
      margin-bottom: 12px;
    }

    .contact {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 9px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Summary */
    .summary {
      margin-bottom: 20px;
      font-size: 10px;
      line-height: 1.6;
      color: #333;
    }

    /* Sections */
    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 1px solid #ccc;
    }

    /* Experience */
    .job {
      margin-bottom: 15px;
      page-break-inside: avoid;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }

    .job-title {
      font-size: 11px;
      font-weight: 600;
    }

    .job-date {
      font-size: 9px;
      color: #666;
    }

    .job-company {
      font-size: 10px;
      color: #444;
      margin-bottom: 6px;
    }

    .job-summary {
      font-size: 9px;
      color: #333;
      margin-bottom: 6px;
      line-height: 1.5;
    }

    .job-highlights {
      list-style: disc;
      margin-left: 16px;
      font-size: 9px;
    }

    .job-highlights li {
      margin-bottom: 3px;
      line-height: 1.4;
    }

    .job-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 6px;
    }

    .skill-tag {
      font-size: 8px;
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
    }

    /* Education */
    .education-item {
      margin-bottom: 10px;
    }

    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .education-degree {
      font-size: 10px;
      font-weight: 600;
    }

    .education-date {
      font-size: 9px;
      color: #666;
    }

    .education-institution {
      font-size: 9px;
      color: #444;
    }

    /* Skills */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .skill-item {
      font-size: 9px;
      background: #f5f5f5;
      padding: 4px 10px;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }

    /* Projects */
    .project {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .project-name {
      font-size: 10px;
      font-weight: 600;
    }

    .project-description {
      font-size: 9px;
      color: #444;
      margin-top: 2px;
    }

    .project-url {
      font-size: 8px;
      color: #666;
    }

    /* Certificates */
    .cert-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .cert-item {
      font-size: 9px;
      padding: 6px 8px;
      background: #fafafa;
      border-radius: 3px;
    }

    .cert-name {
      font-weight: 500;
      margin-bottom: 2px;
    }

    .cert-issuer {
      font-size: 8px;
      color: #666;
    }

    /* Languages */
    .languages-grid {
      display: flex;
      gap: 20px;
    }

    .language-item {
      font-size: 9px;
    }

    .language-name {
      font-weight: 600;
    }

    .language-level {
      color: #666;
    }

    /* Strengths */
    .strengths-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .strength-item {
      font-size: 9px;
      background: #f0f0f0;
      padding: 4px 10px;
      border-radius: 4px;
    }

    /* Two columns layout for bottom sections */
    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
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
    <div class="contact">
      <span class="contact-item">
        <span>${cv.basics.email}</span>
      </span>
      <span class="contact-item">
        <span>${cv.basics.phone}</span>
      </span>
      <span class="contact-item">
        <span>${cv.basics.location.city}, ${cv.basics.location.region}</span>
      </span>
      ${cv.basics.profiles.filter(p => p.network !== 'Download').map(p => `
        <span class="contact-item">
          <a href="${p.url}">${p.network}</a>
        </span>
      `).join('')}
    </div>
  </header>

  <!-- Summary -->
  <section class="summary">
    ${cv.basics.summary.replace(/<[^>]*>/g, '')}
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
        <div class="job-company"><a href="${job.url}">${job.name}</a></div>
        <p class="job-summary">${job.summary}</p>
        ${job.highlights && job.highlights.length > 0 ? `
          <ul class="job-highlights">
            ${job.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        ` : ''}
        ${job.skills && job.skills.length > 0 ? `
          <div class="job-skills">
            ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </section>

  <!-- Education -->
  <section class="section">
    <h2 class="section-title">${l.education}</h2>
    ${cv.education.map(edu => `
      <div class="education-item">
        <div class="education-header">
          <span class="education-degree">${edu.area}</span>
          <span class="education-date">${edu.startDate} - ${edu.endDate}</span>
        </div>
        <div class="education-institution"><a href="${edu.url}">${edu.institution}</a></div>
      </div>
    `).join('')}
  </section>

  <!-- Skills -->
  <section class="section">
    <h2 class="section-title">${l.skills}</h2>
    <div class="skills-grid">
      ${cv.skills.map(s => `<span class="skill-item">${s.name}</span>`).join('')}
    </div>
  </section>

  <!-- Projects -->
  <section class="section">
    <h2 class="section-title">${l.projects}</h2>
    ${cv.projects.filter(p => p.isActive).map(project => `
      <div class="project">
        <span class="project-name">${project.name}</span>
        ${project.url ? `<span class="project-url"> - <a href="${project.url}">${project.url}</a></span>` : ''}
        <p class="project-description">${project.description}</p>
      </div>
    `).join('')}
  </section>

  <div class="two-columns">
    <!-- Languages -->
    <section class="section">
      <h2 class="section-title">${l.languages}</h2>
      <div class="languages-grid">
        ${cv.languages.map(lang => `
          <div class="language-item">
            <span class="language-name">${lang.language}</span>
            <span class="language-level"> - ${lang.fluency}</span>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Strengths -->
    <section class="section">
      <h2 class="section-title">${l.strengths}</h2>
      <div class="strengths-grid">
        ${cv.strengths.map(s => `<span class="strength-item">${s}</span>`).join('')}
      </div>
    </section>
  </div>

  <!-- Certificates (selected) -->
  <section class="section">
    <h2 class="section-title">${l.certificates}</h2>
    <div class="cert-grid">
      ${cv.certificates.slice(0, 8).map(cert => `
        <div class="cert-item">
          <div class="cert-name"><a href="${cert.url}">${cert.name}</a></div>
          <div class="cert-issuer">${cert.issuer} - ${cert.date}</div>
        </div>
      `).join('')}
    </div>
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
