import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

export interface AIMatchResult {
  job_id: string;
  title: string;
  company_name: string;
  match_score: number;
  is_eligible: boolean;
  eligibility_reasons: string[];
  matched_skills: string[];
  missing_skills: string[];
  score_breakdown: {
    required_skill_overlap: number;
    preferred_skill_overlap: number;
    text_relevance_similarity: number;
    academic_score: number;
    overall_raw_score: number;
  };
  explanation: string;
  suggested_skills: string[];
  recommendation_rationale: string;
}

export interface AIParseResult {
  success: boolean;
  candidate_name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  education: Array<{
    degree?: string;
    institution?: string;
    graduation_year?: number;
    cgpa?: number;
  }>;
  projects: Array<{
    title: string;
    description?: string;
    technologies: string[];
  }>;
  certifications: string[];
  experience: Array<{
    role?: string;
    organization?: string;
    duration?: string;
    description?: string;
  }>;
  raw_text_preview: string;
  parsing_errors: string[];
}

export const aiClient = {
  /**
   * Evaluates job-skill match and eligibility via Python FastAPI service
   */
  async matchJob(studentData: any, jobData: any): Promise<AIMatchResult | null> {
    try {
      const response = await fetch(`${config.FASTAPI_SERVICE_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: studentData,
          job: jobData,
        }),
      });

      if (!response.ok) {
        console.warn(`FastAPI match returned status ${response.status}`);
        return null;
      }

      return (await response.json()) as AIMatchResult;
    } catch (err: any) {
      console.warn(`FastAPI service unreachable for /match: ${err.message}. Using heuristic fallback.`);
      return null;
    }
  },

  /**
   * Generates ranked recommendations for a student across active jobs
   */
  async getRecommendations(
    studentData: any,
    jobsList: any[]
  ): Promise<AIMatchResult[]> {
    try {
      const response = await fetch(`${config.FASTAPI_SERVICE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: studentData,
          jobs: jobsList,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        return data.recommendations || [];
      }
    } catch (err: any) {
      console.warn(`FastAPI unreachable for /recommend: ${err.message}`);
    }

    // Baseline fallback if AI service is offline
    return jobsList.map((job) => {
      const studentSkills = new Set(
        (studentData.skills || []).map((s: string) => s.toLowerCase().trim())
      );
      const reqSkills = (job.required_skills || []).map((s: string) => s.toLowerCase().trim());
      const matched = reqSkills.filter((s: string) => studentSkills.has(s));
      const missing = reqSkills.filter((s: string) => !studentSkills.has(s));
      const ratio = reqSkills.length > 0 ? matched.length / reqSkills.length : 1;
      const score = Math.round(ratio * 100);

      const isEligible =
        (job.min_cgpa ? studentData.cgpa >= job.min_cgpa : true) &&
        (job.eligible_departments && job.eligible_departments.length > 0
          ? job.eligible_departments
              .map((d: string) => d.toLowerCase())
              .includes((studentData.department || '').toLowerCase())
          : true);

      return {
        job_id: job.job_id,
        title: job.title,
        company_name: job.company_name,
        match_score: isEligible ? score : Math.min(score * 0.4, 40),
        is_eligible: isEligible,
        eligibility_reasons: isEligible ? ['Criteria met.'] : ['Eligibility criteria not met.'],
        matched_skills: matched,
        missing_skills: missing,
        score_breakdown: {
          required_skill_overlap: score,
          preferred_skill_overlap: 100,
          text_relevance_similarity: score,
          academic_score: Math.round((studentData.cgpa / 10) * 100),
          overall_raw_score: score,
        },
        explanation: `Fallback baseline match: ${matched.length}/${reqSkills.length} required skills matched.`,
        suggested_skills: missing.slice(0, 3),
        recommendation_rationale: isEligible
          ? 'Recommended profile match.'
          : 'Ineligible candidate profile.',
      };
    });
  },

  /**
   * Uploads and parses resume PDF/DOCX through Python microservice
   */
  async parseResume(filePath: string, originalFilename: string): Promise<AIParseResult> {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      const blob = new Blob([fileBuffer]);
      const formData = new FormData();
      formData.append('file', blob, originalFilename);

      const response = await fetch(`${config.FASTAPI_SERVICE_URL}/parse`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        return (await response.json()) as AIParseResult;
      }
    } catch (err: any) {
      console.warn(`FastAPI parser unreachable: ${err.message}`);
    }

    return {
      success: false,
      skills: [],
      education: [],
      projects: [],
      certifications: [],
      experience: [],
      raw_text_preview: '',
      parsing_errors: ['FastAPI AI service is temporarily offline.'],
    };
  },
};
