"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_sarif_builder_1 = require("node-sarif-builder");
const path = require("path");
const url_1 = require("url");
const sarifFormatter = function (formatter) {
    formatter.on('end', (event) => {
        const arrAllMessages = event.arrAllMessages;
        const sarifBuilder = new node_sarif_builder_1.SarifBuilder();
        const sarifRunBuilder = new node_sarif_builder_1.SarifRunBuilder().initSimple({
            toolDriverName: 'HTMLHint',
            toolDriverVersion: '1.1.4',
            url: 'https://htmlhint.com/',
        });
        const addedRuleSet = new Set();
        arrAllMessages.forEach((result) => {
            result.messages.forEach((message) => {
                const rule = message.rule;
                if (addedRuleSet.has(rule)) {
                    return;
                }
                addedRuleSet.add(rule);
                const sarifRuleBuiler = new node_sarif_builder_1.SarifRuleBuilder().initSimple({
                    ruleId: rule.id,
                    shortDescriptionText: rule.description,
                    helpUri: rule.link,
                });
                sarifRunBuilder.addRule(sarifRuleBuiler);
            });
        });
        arrAllMessages.forEach((result) => {
            result.messages.forEach((message) => {
                const sarifResultBuilder = new node_sarif_builder_1.SarifResultBuilder();
                const ruleId = message.rule.id;
                const sarifResultInit = {
                    level: message.type === 'info'
                        ? 'note'
                        : message.type.toString(),
                    messageText: message.message,
                    ruleId: ruleId,
                    fileUri: process.env.SARIF_URI_ABSOLUTE
                        ? (0, url_1.pathToFileURL)(result.file).toString()
                        : path.relative(process.cwd(), result.file),
                    startLine: message.line,
                    startColumn: message.col,
                    endLine: message.line,
                    endColumn: message.col,
                };
                sarifResultBuilder.initSimple(sarifResultInit);
                sarifRunBuilder.addResult(sarifResultBuilder);
            });
        });
        sarifBuilder.addRun(sarifRunBuilder);
        console.log(sarifBuilder.buildSarifJsonString({ indent: true }));
    });
};
module.exports = sarifFormatter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FyaWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY2xpL2Zvcm1hdHRlcnMvc2FyaWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyREFLMkI7QUFFM0IsNkJBQTRCO0FBQzVCLDZCQUFtQztBQUduQyxNQUFNLGNBQWMsR0FBc0IsVUFBVSxTQUFTO0lBQzNELFNBQVMsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDNUIsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQTtRQUczQyxNQUFNLFlBQVksR0FBRyxJQUFJLGlDQUFZLEVBQUUsQ0FBQTtRQUd2QyxNQUFNLGVBQWUsR0FBRyxJQUFJLG9DQUFlLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDdkQsY0FBYyxFQUFFLFVBQVU7WUFDMUIsaUJBQWlCLEVBQUUsT0FBTztZQUMxQixHQUFHLEVBQUUsdUJBQXVCO1NBQzdCLENBQUMsQ0FBQTtRQUdGLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUFRLENBQUE7UUFDcEMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2hDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ2xDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7Z0JBQ3pCLElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDMUIsT0FBTTtpQkFDUDtnQkFDRCxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUN0QixNQUFNLGVBQWUsR0FBRyxJQUFJLHFDQUFnQixFQUFFLENBQUMsVUFBVSxDQUFDO29CQUN4RCxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ2Ysb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFdBQVc7b0JBQ3RDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSTtpQkFDbkIsQ0FBQyxDQUFBO2dCQUNGLGVBQWUsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDMUMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUdGLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNoQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNsQyxNQUFNLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQTtnQkFDbkQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7Z0JBQzlCLE1BQU0sZUFBZSxHQUFHO29CQUN0QixLQUFLLEVBQ0gsT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNO3dCQUNyQixDQUFDLENBQUMsTUFBTTt3QkFDUixDQUFDLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQW1CO29CQUMvQyxXQUFXLEVBQUUsT0FBTyxDQUFDLE9BQU87b0JBQzVCLE1BQU0sRUFBRSxNQUFNO29CQUNkLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQjt3QkFDckMsQ0FBQyxDQUFDLElBQUEsbUJBQWEsRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO3dCQUN2QyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQztvQkFDN0MsU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJO29CQUN2QixXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUc7b0JBQ3hCLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSTtvQkFDckIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxHQUFHO2lCQUNkLENBQUE7Z0JBQ1Ysa0JBQWtCLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFBO2dCQUM5QyxlQUFlLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUE7WUFDL0MsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLFlBQVksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ2xFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUEifQ==