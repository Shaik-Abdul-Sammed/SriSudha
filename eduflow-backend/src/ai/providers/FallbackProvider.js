import { BaseProvider } from './BaseProvider.js'

export class FallbackProvider extends BaseProvider {
  /**
   * @param {BaseProvider[]} providers Array of providers to attempt in order
   */
  constructor(providers = []) {
    super()
    if (!providers.length) {
      throw new Error('FallbackProvider requires at least one provider')
    }
    this.providers = providers
    this.name = 'fallback'
  }

  async _executeWithFallback(operationName, args) {
    let lastError = null
    const errors = []

    for (const provider of this.providers) {
      try {
        // console.log(`[FallbackProvider] Attempting ${operationName} with ${provider.constructor.name}...`)
        const result = await provider[operationName](...args)
        // console.log(`[FallbackProvider] Success with ${provider.constructor.name}`)
        this.lastSuccessfulProviderName = provider.constructor.name
        return result
      } catch (err) {
        // console.warn(`[FallbackProvider] ${provider.constructor.name} failed during ${operationName}: ${err.message}`)
        lastError = err
        errors.push({ provider: provider.constructor.name, error: err.message })
      }
    }

    // console.error(`[FallbackProvider] All providers failed for ${operationName}. Errors:`, errors)
    throw lastError
  }

  async chat(messages, systemPrompt) {
    return this._executeWithFallback('chat', [messages, systemPrompt])
  }

  async extractStructured(text, schema) {
    return this._executeWithFallback('extractStructured', [text, schema])
  }

  async generateCode(spec) {
    return this._executeWithFallback('generateCode', [spec])
  }

  async analyzeAndRepair(errorLog, codeFiles) {
    return this._executeWithFallback('analyzeAndRepair', [errorLog, codeFiles])
  }
}
