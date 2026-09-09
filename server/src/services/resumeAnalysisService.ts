export interface ParsedResumeResult {
  isValidResume: boolean;
  wordCount: number;
  extractedText: string;
  skills: string[];
  sectionsFound: string[];
  quantifiedAchievementsFound: number;
  categoryScores: {
    skillsMatch: number;
    experienceRelevance: number;
    projects: number;
    education: number;
    keywords: number;
    structure: number;
  };
  atsScore: number;
  suggestions: string[];
}

const TECHNICAL_SKILLS_DICTIONARY = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Golang", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "SQL", "HTML5", "HTML", "CSS3", "CSS", "R", "Scala", "Bash", "Shell",
  // Frontend
  "React", "React.js", "Vue", "Vue.js", "Angular", "Next.js", "Nuxt.js", "Svelte", "Redux", "Zustand", "TailwindCSS", "Tailwind", "Bootstrap", "Material-UI", "Webpack", "Vite",
  // Backend & APIs
  "Node.js", "Node", "Express.js", "Express", "NestJS", "Django", "FastAPI", "Flask", "Spring Boot", "Spring", "ASP.NET", ".NET", "REST API", "RESTful", "GraphQL", "gRPC", "WebSockets", "Microservices",
  // Databases
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "DynamoDB", "SQLite", "Cassandra", "Elasticsearch", "Prisma", "Mongoose",
  // Cloud & DevOps
  "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Jenkins", "Git", "GitHub", "GitLab", "Linux", "Terraform", "Nginx",
];

export const analyzeResumeContent = (rawText: string, targetRole: string = "Software Engineer"): ParsedResumeResult => {
  const cleanText = (rawText || "").trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Validation Check: Check if PDF has readable content
  if (wordCount < 40) {
    return {
      isValidResume: false,
      wordCount,
      extractedText: cleanText,
      skills: [],
      sectionsFound: [],
      quantifiedAchievementsFound: 0,
      categoryScores: {
        skillsMatch: 0,
        experienceRelevance: 0,
        projects: 0,
        education: 0,
        keywords: 0,
        structure: 0,
      },
      atsScore: 0,
      suggestions: [
        "No readable resume text could be extracted from this PDF.",
        "Ensure the file is a text-selectable PDF and not a flattened image or scanned photo.",
        "Upload a document containing standard resume sections: Work Experience, Skills, Education, Projects.",
      ],
    };
  }

  const lowerText = cleanText.toLowerCase();

  // 2. Extract Real Detected Skills (Only if actually present in text)
  const detectedSkillsSet = new Set<string>();
  for (const skill of TECHNICAL_SKILLS_DICTIONARY) {
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(^|[^a-zA-Z0-9+#])${escaped}([^a-zA-Z0-9+#]|$)`, "i");
    if (regex.test(cleanText)) {
      detectedSkillsSet.add(skill);
    }
  }
  const detectedSkills = Array.from(detectedSkillsSet);

  // 3. Section Recognition
  const sectionsFound: string[] = [];
  if (/education|academic|university|degree|bachelor|master|b\.tech|b\.e/i.test(cleanText)) sectionsFound.push("Education");
  if (/experience|employment|work history|internship|software engineer|developer/i.test(cleanText)) sectionsFound.push("Experience");
  if (/projects|portfolio|built|developed|applications/i.test(cleanText)) sectionsFound.push("Projects");
  if (/skills|technical skills|proficiencies|technologies/i.test(cleanText)) sectionsFound.push("Technical Skills");
  if (/certifications|certificates|licenses/i.test(cleanText)) sectionsFound.push("Certifications");

  // 4. Quantified Metrics Recognition
  const metricsMatches = cleanText.match(/\b\d+(\.\d+)?%|\b\d+\s*ms\b|\b\d+\s*(users|clients|requests|transactions)\b|\b\$\d+/gi) || [];
  const quantifiedCount = metricsMatches.length;

  // 5. Transparent Mathematical Scoring Model (Max 100)
  // a. Skills Match (35%)
  let skillsMatch = 0;
  if (detectedSkills.length >= 10) skillsMatch = 35;
  else if (detectedSkills.length >= 7) skillsMatch = 30;
  else if (detectedSkills.length >= 4) skillsMatch = 22;
  else if (detectedSkills.length >= 2) skillsMatch = 14;
  else if (detectedSkills.length >= 1) skillsMatch = 8;
  else skillsMatch = 0;

  // b. Experience Relevance (20%)
  let experienceScore = 0;
  if (sectionsFound.includes("Experience")) {
    experienceScore += 12;
    if (/lead|senior|junior|engineer|developer|intern/i.test(cleanText)) experienceScore += 5;
    if (quantifiedCount > 0) experienceScore += 3;
  }

  // c. Technical Projects (15%)
  let projectsScore = 0;
  if (sectionsFound.includes("Projects")) {
    projectsScore += 10;
    if (detectedSkills.length > 2) projectsScore += 5;
  }

  // d. Education (10%)
  let educationScore = 0;
  if (sectionsFound.includes("Education")) {
    educationScore += 10;
  }

  // e. Keywords & Tech Density (10%)
  let keywordsScore = 0;
  if (wordCount >= 150) keywordsScore += 5;
  if (detectedSkills.length >= 5) keywordsScore += 5;
  else if (detectedSkills.length >= 2) keywordsScore += 3;

  // f. Resume Structure & Readability (10%)
  let structureScore = 0;
  if (sectionsFound.length >= 3) structureScore += 6;
  if (wordCount >= 200 && wordCount <= 1200) structureScore += 4;

  const totalAtsScore = skillsMatch + experienceScore + projectsScore + educationScore + keywordsScore + structureScore;

  // 6. Actionable Real Recommendations Based on Gaps
  const suggestions: string[] = [];

  if (detectedSkills.length === 0) {
    suggestions.push("No technical programming languages or frameworks were detected. Include a dedicated 'Technical Skills' section.");
  } else if (detectedSkills.length < 5) {
    suggestions.push(`Only ${detectedSkills.length} technical skills found (${detectedSkills.join(", ")}). Add related libraries, database, and cloud tools you have used.`);
  }

  if (quantifiedCount === 0) {
    suggestions.push("Add numerical metrics to your project bullet points (e.g. 'Improved query latency by 30%', 'Supported 500+ daily active users').");
  }

  if (!sectionsFound.includes("Projects")) {
    suggestions.push("Add a prominent 'Projects' section highlighting full-stack or systems applications with live links or GitHub repos.");
  }

  if (!sectionsFound.includes("Experience")) {
    suggestions.push("Include relevant internships, open-source contributions, or freelance experience under an 'Experience' header.");
  }

  if (!detectedSkills.some(s => /docker|aws|gcp|azure|ci\/cd|git/i.test(s))) {
    suggestions.push("Include cloud deployment & DevOps tooling (e.g., Docker, AWS, Git, CI/CD) to meet modern full-stack requirements.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Resume demonstrates solid structural alignment. Tailor keywords to specific job postings for maximum ATS match.");
  }

  return {
    isValidResume: detectedSkills.length > 0 || sectionsFound.length >= 2,
    wordCount,
    extractedText: cleanText,
    skills: detectedSkills,
    sectionsFound,
    quantifiedAchievementsFound: quantifiedCount,
    categoryScores: {
      skillsMatch,
      experienceRelevance: experienceScore,
      projects: projectsScore,
      education: educationScore,
      keywords: keywordsScore,
      structure: structureScore,
    },
    atsScore: totalAtsScore,
    suggestions,
  };
};
