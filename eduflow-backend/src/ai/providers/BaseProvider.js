/**
 * Abstract base class for all AI providers.
 * Every provider must implement these methods.
 */
export class BaseProvider {
  /** @param {Array<{role:string,content:string}>} messages @param {string} systemPrompt @returns {Promise<string>} */
  async chat(messages, systemPrompt) { throw new Error('Not implemented') }
  /** @param {string} text @param {Object} schema @returns {Promise<Object>} */
  async extractStructured(text, schema) { throw new Error('Not implemented') }
  /** @param {Object} spec @returns {Promise<Array<{filename:string,content:string}>>} */
  async generateCode(spec) { throw new Error('Not implemented') }
  /** @param {string} errorLog @param {Array<{filename:string,content:string}>} codeFiles @returns {Promise<Array<{filename:string,content:string}>>} */
  async analyzeAndRepair(errorLog, codeFiles) { throw new Error('Not implemented') }
}
