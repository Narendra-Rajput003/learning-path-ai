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
  difficulty: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  timeEstimate: string;
  challengeLevel: 1 | 2 | 3 | 4 | 5;
  prerequisites: string[];
  learningOutcomes: string[];
  steps: string[];
  expectedOutcome: string;
  bestPractices: string[];
  tags: string[];
  resources: {
    documentation: Array<{ title: string; url: string }>;
    tutorials: Array<{ title: string; url: string }>;
    githubRepos: Array<{ title: string; url: string }>;
  };
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
  id: string;
  title: string;
  description: string;
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
  nodes: {
    id: string;
    title: string;
    description: string;
    type: 'fundamental' | 'beginner' | 'intermediate' | 'advanced';
    position: { x: number; y: number };
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
}

export interface RoadmapNode {
  id: string;
  type: 'fundamental' | 'beginner' | 'intermediate' | 'advanced' | 'project';
  position: { x: number; y: number };
  data: {
    title: string;
    description: string;
    keyConcepts?: string[];
    resources?: {
      documentation: Resource[];
      githubRepos: Resource[];
      articles: Resource[];
    };
    projects?: Project[];
  };
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'prerequisite';
  animated?: boolean;
}
