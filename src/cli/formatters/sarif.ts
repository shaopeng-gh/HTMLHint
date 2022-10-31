import { FormatterCallback } from '../formatter'
import {
  SarifBuilder,
  SarifResultBuilder,
  SarifRuleBuilder,
  SarifRunBuilder,
} from 'node-sarif-builder'
import { Rule } from '../../core/types'
import * as path from 'path'
import { pathToFileURL } from 'url'
import { Result } from 'sarif'

const sarifFormatter: FormatterCallback = function (formatter) {
  formatter.on('end', (event) => {
    const arrAllMessages = event.arrAllMessages

    // SARIF builder
    const sarifBuilder = new SarifBuilder()

    // SARIF Run builder
    const sarifRunBuilder = new SarifRunBuilder().initSimple({
      toolDriverName: 'HTMLHint',
      toolDriverVersion: '1.1.4',
      url: 'https://htmlhint.com/',
    })

    // SARIF rules
    const addedRuleSet = new Set<Rule>()
    arrAllMessages.forEach((result) => {
      result.messages.forEach((message) => {
        const rule = message.rule
        if (addedRuleSet.has(rule)) {
          return
        }
        addedRuleSet.add(rule)
        const sarifRuleBuiler = new SarifRuleBuilder().initSimple({
          ruleId: rule.id,
          shortDescriptionText: rule.description,
          helpUri: rule.link,
        })
        sarifRunBuilder.addRule(sarifRuleBuiler)
      })
    })

    // Add SARIF results (individual errors)
    arrAllMessages.forEach((result) => {
      result.messages.forEach((message) => {
        const sarifResultBuilder = new SarifResultBuilder()
        const ruleId = message.rule.id
        const sarifResultInit = {
          level:
            message.type === 'info'
              ? 'note'
              : (message.type.toString() as Result.level),
          messageText: message.message,
          ruleId: ruleId,
          fileUri: process.env.SARIF_URI_ABSOLUTE
            ? pathToFileURL(result.file).toString()
            : path.relative(process.cwd(), result.file),
          startLine: message.line,
          startColumn: message.col,
          endLine: message.line,
          endColumn: message.col,
        } as const
        sarifResultBuilder.initSimple(sarifResultInit)
        sarifRunBuilder.addResult(sarifResultBuilder)
      })
    })

    sarifBuilder.addRun(sarifRunBuilder)
    console.log(sarifBuilder.buildSarifJsonString({ indent: true }))
  })
}

module.exports = sarifFormatter
