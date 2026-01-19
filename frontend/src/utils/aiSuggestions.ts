import { WorkExperience } from '../types/resume';

export const actionVerbs = [
  'Achieved', 'Accelerated', 'Accomplished', 'Advised', 'Analyzed', 'Built', 'Collaborated',
  'Created', 'Decreased', 'Delivered', 'Designed', 'Developed', 'Directed', 'Drove',
  'Enhanced', 'Established', 'Exceeded', 'Executed', 'Expanded', 'Generated', 'Grew',
  'Implemented', 'Improved', 'Increased', 'Initiated', 'Launched', 'Led', 'Managed',
  'Optimized', 'Orchestrated', 'Reduced', 'Redesigned', 'Resolved', 'Spearheaded',
  'Streamlined', 'Strengthened', 'Transformed'
];

export function analyzeSummary(summary: string): string[] {
  const suggestions: string[] = [];

  if (summary.length < 50) {
    suggestions.push('Professional summary is too short. Aim for 3-4 compelling sentences that highlight your key achievements and value proposition.');
  }

  if (summary.length > 300) {
    suggestions.push('Professional summary is too long. Keep it concise and impactful (150-250 words).');
  }

  if (!summary.match(/\d+/)) {
    suggestions.push('Add quantifiable metrics to your summary (e.g., "increased sales by 30%").');
  }

  const weakWords = ['responsible for', 'worked on', 'helped with', 'duties included'];
  const foundWeakWords = weakWords.filter(word => summary.toLowerCase().includes(word));
  if (foundWeakWords.length > 0) {
    suggestions.push(`Replace weak phrases like "${foundWeakWords.join('", "')}" with strong action verbs.`);
  }

  return suggestions;
}

export function analyzeWorkExperience(experience: WorkExperience[]): string[] {
  const suggestions: string[] = [];

  experience.forEach((job, index) => {
    if (job.achievements.length < 3) {
      suggestions.push(`Add more bullet points to ${job.position} at ${job.company} (aim for 3-5 achievements per role).`);
    }

    job.achievements.forEach((achievement, achIndex) => {
      if (achievement.length < 20) {
        suggestions.push(`Bullet point ${achIndex + 1} in ${job.position} is too brief. Add more details and context.`);
      }

      if (!achievement.match(/\d+/)) {
        suggestions.push(`Add quantifiable results to "${achievement.substring(0, 30)}..." (e.g., percentages, dollar amounts, time saved).`);
      }

      const startsWithActionVerb = actionVerbs.some(verb =>
        achievement.trim().toLowerCase().startsWith(verb.toLowerCase())
      );

      if (!startsWithActionVerb) {
        suggestions.push(`Start "${achievement.substring(0, 30)}..." with a strong action verb (${actionVerbs.slice(0, 5).join(', ')}, etc.).`);
      }
    });
  });

  return suggestions;
}

export function analyzeSkills(skills: { technical?: string[]; soft?: string[]; languages?: string[]; tools?: string[] }): string[] {
  const suggestions: string[] = [];

  const totalSkills = (skills.technical?.length || 0) + (skills.tools?.length || 0);

  if (totalSkills < 5) {
    suggestions.push('Add more technical skills and tools relevant to your target role.');
  }

  if (totalSkills > 20) {
    suggestions.push('Too many skills listed. Focus on the most relevant 10-15 skills for your target role.');
  }

  if (!skills.soft || skills.soft.length === 0) {
    suggestions.push('Consider adding 3-4 key soft skills (e.g., Leadership, Communication, Problem-solving).');
  }

  return suggestions;
}

export function improveAchievement(achievement: string): string {
  let improved = achievement;

  const startsWithActionVerb = actionVerbs.some(verb =>
    improved.trim().toLowerCase().startsWith(verb.toLowerCase())
  );

  if (!startsWithActionVerb) {
    improved = `${actionVerbs[Math.floor(Math.random() * actionVerbs.length)]} ${improved}`;
  }

  if (!improved.match(/\d+/)) {
    const suggestions = [
      ' resulting in 25% efficiency improvement',
      ' impacting 500+ users',
      ' saving 15 hours per week',
      ' increasing revenue by $50K',
      ' reducing costs by 30%'
    ];
    improved += suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  return improved;
}

export function generateSummaryTemplate(role: string, yearsExp?: number): string {
  const templates = [
    `Results-driven ${role} with ${yearsExp || 'X'} years of experience delivering high-impact solutions. Proven track record of [key achievement]. Skilled in [key skills] with expertise in [specialty area]. Seeking to leverage [strength] to drive [outcome] at [target company type].`,
    `Dynamic ${role} specializing in [specialty] with ${yearsExp || 'X'}+ years of progressive experience. Successfully [major achievement] resulting in [quantifiable impact]. Expert in [key technologies/skills] with strong focus on [value proposition]. Committed to [professional goal].`,
    `Accomplished ${role} with expertise in [domain] and ${yearsExp || 'X'} years driving [outcome]. Led [initiative] that achieved [result]. Proficient in [skills/tools] with demonstrated ability to [strength]. Passionate about [area of interest] and continuous improvement.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
