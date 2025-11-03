import { GoogleGenAI, Type } from "@google/genai";
import { LessonPlanFormParams, LessonPlan, GraphicOrganizer } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const rubricSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The title for the grading rubric (e.g., 'Final Project Grading Rubric')." },
        criteria: {
            type: Type.ARRAY,
            description: "A list of criteria to evaluate the project.",
            items: {
                type: Type.OBJECT,
                properties: {
                    criterion: { type: Type.STRING, description: "The specific skill or knowledge area being assessed (e.g., 'Content Accuracy', 'Presentation Skills')." },
                    levels: {
                        type: Type.OBJECT,
                        description: "Descriptions for each performance level.",
                        properties: {
                            exemplary: { type: Type.STRING, description: "Description for 'Exemplary' performance (4 points)." },
                            proficient: { type: Type.STRING, description: "Description for 'Proficient' performance (3 points)." },
                            developing: { type: Type.STRING, description: "Description for 'Developing' performance (2 points)." },
                            beginning: { type: Type.STRING, description: "Description for 'Beginning' performance (1 point)." }
                        },
                        required: ["exemplary", "proficient", "developing", "beginning"]
                    }
                },
                required: ["criterion", "levels"]
            }
        }
    },
    required: ["title", "criteria"]
};

const lessonPlanSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative and engaging title for the project-based lesson plan." },
    overview: { type: Type.STRING, description: "A brief, 1-2 paragraph overview of the entire project." },
    learningObjectives: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-5 clear, measurable learning objectives for the lesson plan."
    },
    duration: { type: Type.STRING, description: "The total duration of the project (e.g., '5 Days')." },
    dailyBreakdown: {
      type: Type.ARRAY,
      description: "A day-by-day breakdown of the lesson plan.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "The day number in the sequence." },
          topic: { type: Type.STRING, description: "The main topic or theme for the day." },
          activities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of step-by-step activities for the day."
          },
          fourCs: {
            type: Type.OBJECT,
            properties: {
              collaboration: { type: Type.STRING, description: "A specific activity or prompt focusing on collaboration." },
              communication: { type: Type.STRING, description: "A specific activity or prompt focusing on communication." },
              criticalThinking: { type: Type.STRING, description: "A specific activity or prompt focusing on critical thinking." },
              creativity: { type: Type.STRING, description: "A specific activity or prompt focusing on creativity." },
            },
            required: ["collaboration", "communication", "criticalThinking", "creativity"]
          },
          resources: {
            type: Type.OBJECT,
            properties: {
              graphicOrganizer: { type: Type.STRING, description: "A suggestion for a relevant graphic organizer (e.g., 'Venn Diagram to compare...')." },
              readingPrompt: { type: Type.STRING, description: "A short, engaging reading prompt related to the day's topic." },
              videoInstruction: {
                type: Type.OBJECT,
                description: "A suggestion for a short instructional video, including a description and a search URL.",
                properties: {
                    description: { type: Type.STRING, description: "A descriptive title for the video suggestion (e.g., 'Khan Academy video explaining photosynthesis')." },
                    url: { type: Type.STRING, description: "A valid, searchable URL for the video (e.g., 'https://www.youtube.com/results?search_query=photosynthesis+for+kids')." }
                },
                required: ["description", "url"]
              },
            },
            required: ["graphicOrganizer", "readingPrompt", "videoInstruction"]
          },
        },
        required: ["day", "topic", "activities", "fourCs", "resources"]
      }
    },
    gradingRubric: rubricSchema,
  },
  required: ["title", "overview", "learningObjectives", "duration", "dailyBreakdown", "gradingRubric"]
};

const graphicOrganizerSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The main title of the graphic organizer." },
    instructions: { type: Type.STRING, description: "Simple, clear instructions for the student on how to fill out the organizer." },
    sections: {
      type: Type.ARRAY,
      description: "The main content sections of the organizer.",
      items: {
        type: Type.OBJECT,
        properties: {
          sectionTitle: { type: Type.STRING, description: "The title for this section of the organizer." },
          iconName: {
            type: Type.STRING,
            description: "A descriptive name for an icon related to the section. Use one of: 'Pencil', 'MagnifyingGlass', 'Book', 'LightBulb', 'Users', 'Compare'.",
            enum: ['Pencil', 'MagnifyingGlass', 'Book', 'LightBulb', 'Users', 'Compare']
          },
          layout: {
            type: Type.STRING,
            description: "The layout for the fields in this section.",
            enum: ['List', 'Grid', 'TwoColumn']
          },
          fields: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of prompts or labels for the student to write their responses."
          }
        },
        required: ["sectionTitle", "iconName", "layout", "fields"]
      }
    }
  },
  required: ["title", "instructions", "sections"]
};


export const generateLessonPlan = async (params: LessonPlanFormParams): Promise<LessonPlan> => {
  const { days, subject, gradeLevel, standard } = params;

  const prompt = `
    Create a detailed, project-based lesson plan for a ${gradeLevel} ${subject} class.
    The lesson plan should span ${days} days.
    It must be aligned with the following Oklahoma Academic Standard: "${standard}".

    The final project should be engaging and allow students to demonstrate their understanding of the standard.
    For each day, provide a clear breakdown that includes:
    1. A main topic.
    2. A list of activities.
    3. Specific integration of the 4 C's of 21st Century Learning: Collaboration, Communication, Critical Thinking, and Creativity.
    4. Resource suggestions, including a specific Graphic Organizer, a Short Reading Prompt, and a Video Instruction idea. For the video instruction, provide both a descriptive title and a valid, searchable URL (e.g., to YouTube or Khan Academy).
    5. A comprehensive grading rubric for the final project. The rubric should have multiple criteria, each with descriptions for four performance levels: Exemplary, Proficient, Developing, and Beginning.

    Generate the output in the specified JSON format. Ensure all fields are populated with high-quality, relevant content for a teacher to use.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan: LessonPlan = JSON.parse(jsonText);
    return parsedPlan;
  } catch (error) {
    console.error("Error generating lesson plan from Gemini API:", error);
    throw new Error("API call failed. Please check the console for more details.");
  }
};

export const generateGraphicOrganizer = async (description: string, topic: string): Promise<GraphicOrganizer> => {
    const prompt = `
    Design a printable, student-friendly graphic organizer based on the following request: "${description}".
    The overall topic is "${topic}".
    The organizer should be visually clean and easy for a student to understand and fill out.
    Generate a title, simple instructions, and content sections.
    For each section, choose an appropriate icon and layout from the available options.
    The fields should be clear prompts for student input.
    
    Generate the output in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: graphicOrganizerSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating graphic organizer from Gemini API:", error);
    throw new Error("Failed to generate the graphic organizer.");
  }
};
