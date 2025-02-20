export interface Resource {
  title: string;
  type: "documentation" | "video" | "tutorial" | "article";
  url: string;
  source: string;
}

export interface Project {
  title: string;
  description: string;
  requirements: string[];
}

export interface SubTopic {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  resources: Resource[];
  projects: Project[];
}

export interface MainTopic {
  id: string;
  title: string;
  description: string;
  prerequisites: string[];
  subTopics: SubTopic[];
}

export interface RoadmapData {
  mainTopics: MainTopic[];
  connections: Array<{
    source: string;
    target: string;
  }>;
}
