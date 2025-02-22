export interface Resource {
  title: string;
  url: string;
  description?: string;
  platform?: string;
  duration?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
  skills: string[];
  prerequisites: string[];
  steps: string[];
  resources: Resource[];
  expectedOutcome: string;
}

export interface PracticalExercise {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  steps: string[];
}

export interface SubTopic {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeEstimate: string;
  concepts: string[];
  keyPoints: string[];
  commonPitfalls: string[];
  resources: {
    documentation: Resource[];
    videos: Resource[];
    tutorials: Resource[];
    books: Resource[];
    projects: Project[];
  };
  practicalExercises: PracticalExercise[];
}

export interface MainTopic {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  timeEstimate: string;
  prerequisites: string[];
  subTopics: SubTopic[];
  industryApplication: {
    roles: string[];
    companies: string[];
    realWorldUses: string[];
  };
  certifications: Array<{
    name: string;
    provider: string;
    level: string;
    description: string;
    preparationResources: string[];
  }>;
  careerPath: {
    entryLevel: {
      roles: string[];
      skills: string[];
      salary: string;
    };
    intermediate: {
      roles: string[];
      skills: string[];
      salary: string;
    };
    advanced: {
      roles: string[];
      skills: string[];
      salary: string;
    };
  };
}

export interface RoadmapData {
  title: string;
  mainTopics: MainTopic[];
  learningPath: {
    beginner: {
      duration: string;
      milestones: string[];
      projects: string[];
    };
    intermediate: {
      duration: string;
      milestones: string[];
      projects: string[];
    };
    advanced: {
      duration: string;
      milestones: string[];
      projects: string[];
    };
  };
  projects: Project[];
}
