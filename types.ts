export interface LessonPlanFormParams {
  days: number;
  subject: string;
  gradeLevel: string;
  standard: string;
}

export interface DailyPlan {
  day: number;
  topic: string;
  activities: string[];
  fourCs: {
    collaboration: string;
    communication: string;
    criticalThinking: string;
    creativity: string;
  };
  resources: {
    graphicOrganizer: string;
    readingPrompt: string;
    videoInstruction: {
      description: string;
      url: string;
    };
  };
}

export interface RubricPerformanceLevels {
  exemplary: string;
  proficient: string;
  developing: string;
  beginning: string;
}

export interface RubricCriterion {
  criterion: string;
  levels: RubricPerformanceLevels;
}

export interface GradingRubric {
  title: string;
  criteria: RubricCriterion[];
}

export interface LessonPlan {
  title: string;
  overview: string;
  learningObjectives: string[];
  duration: string;
  dailyBreakdown: DailyPlan[];
  gradingRubric: GradingRubric;
}

// Types for the AI-generated graphic organizer
export interface OrganizerSection {
  sectionTitle: string;
  iconName: 'Pencil' | 'MagnifyingGlass' | 'Book' | 'LightBulb' | 'Users' | 'Compare';
  layout: 'List' | 'Grid' | 'TwoColumn';
  fields: string[];
}

export interface GraphicOrganizer {
  title: string;
  instructions: string;
  sections: OrganizerSection[];
}
