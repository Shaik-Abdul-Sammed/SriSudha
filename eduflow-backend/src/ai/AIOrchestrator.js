import { createAIProvider } from './providers/providerFactory.js'
import { OFFICER_PROMPTS } from './officers/officerPrompts.js'

const INSTITUTION_KNOWLEDGE_SCHEMA = {
  name: 'string - institution full name',
  shortName: 'string - abbreviated name',
  tagline: 'string',
  vision: 'string',
  mission: 'string',
  type: 'string - college/school/university/polytechnic',
  location: { city: 'string', state: 'string', country: 'string' },
  departments: ['array of department name strings'],
  courses: ['array of {name, duration, type} objects'],
  infrastructure: {
    hasHostel: 'boolean', hasTransport: 'boolean', hasLibrary: 'boolean',
    hasCanteen: 'boolean', hasLabs: 'boolean', hasPlacement: 'boolean', hasSports: 'boolean',
  },
  contact: { phone: 'string', email: 'string', website: 'string' },
  socialMedia: { facebook: 'string', instagram: 'string', youtube: 'string' },
  brandColors: { primary: 'hex color string', accent: 'hex color string' },
  languages: ['array of language name strings'],
  facilities: ['array of facility description strings'],
  feeStructure: ['array of {course, amount, frequency} objects if available'],
}

function buildSystemPrompt(digitalTwin) {
  const base = `You are EduFlow AI OS, an Autonomous Institution Operating System.\nYou are an AI Administrative Workforce for educational institutions — not a chatbot, not a code generator.\nYou autonomously perform institutional administrative work: generating reports, analyzing data, predicting outcomes, and automating workflows.\nYou are precise, professional, action-oriented, and always show measurable ROI (hours saved, money saved).\nNever say you cannot do something without providing an alternative path forward.`
  if (!digitalTwin || Object.keys(digitalTwin).length === 0) {
    return base + `\n\nNo institution is configured yet. Begin the onboarding interview to understand the institution.`
  }
  return base + `\n\nInstitution Digital Twin:\n${JSON.stringify(digitalTwin, null, 2)}`
}

export class AIOrchestrator {
  constructor() {
    this.provider = createAIProvider()
  }

  /** General OS-level chat (onboarding, knowledge import, general queries) */
  async chat(institutionId, messages, digitalTwin = {}) {
    const systemPrompt = buildSystemPrompt(digitalTwin)
    return this.provider.chat(messages, systemPrompt)
  }

  /** Officer-specific chat with specialized persona */
  async officerChat(officerType, messages, digitalTwin = {}) {
    const promptFn = OFFICER_PROMPTS[officerType]
    if (!promptFn) throw new Error(`Unknown officer type: ${officerType}`)
    const systemPrompt = promptFn(digitalTwin)
    return this.provider.chat(messages, systemPrompt)
  }

  /** Extract structured institution knowledge from raw text/documents */
  async extractKnowledge(text) {
    return this.provider.extractStructured(text, INSTITUTION_KNOWLEDGE_SCHEMA)
  }

  /** Generate Flutter module code */
  async generateModule(spec, digitalTwin = {}) {
    return this.provider.generateCode({ ...spec, institutionContext: digitalTwin })
  }

  /** Auto-repair Flutter build errors */
  async repairBuild(errorLog, codeFiles) {
    return this.provider.analyzeAndRepair(errorLog, codeFiles)
  }
}
