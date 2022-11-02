const ChildProcess = require('child_process')
const fs = require('fs')
const path = require('path')

describe('CLI', () => {
  describe('Formatter: sarif', () => {
    it('should have stdout output with formatter sarif', (done) => {
      const expectedFileContent = fs
        .readFileSync(path.resolve(__dirname, 'sarif.sarif'), 'utf8')
        .replace(
          /\{\{path\}\}/g,
          path.resolve(__dirname, 'example.html').replace(/\\/g, '\\\\')
        )

      const expected = JSON.parse(expectedFileContent)

      ChildProcess.exec(
        [
          'node',
          path.resolve(__dirname, '../../../bin/htmlhint'),
          path.resolve(__dirname, 'example.html'),
          '--format',
          'sarif',
        ].join(' '),
        (error, stdout, stderr) => {
          expect(typeof error).toBe('object')
          expect(error.code).toBe(1)

          expect(stdout).toBe('')

          const jsonStdout = JSON.parse(stdout)
          expect(typeof jsonStdout).toBe('object')
          expect(
            jsonStdout['runs'][0]['artifacts'][0]['location']['uri']
          ).toContain('example.html')

          const stdoutResults = jsonStdout['runs'][0]['results']
          const stdoutRules = jsonStdout['runs'][0]['tool']['driver']['rules']

          expect(stdoutResults).toBeInstanceOf(Array)
          expect(stdoutResults.length).toBe(
            expected['runs'][0]['results'].length
          )

          expect(stdoutRules).toBeInstanceOf(Array)
          expect(stdoutRules.length).toBe(
            expected['runs'][0]['tool']['driver']['rules'].length
          )

          for (let i = 0; i < stdoutResults.length; i++) {
            expect(stdoutResults[i]).toEqual(expected['runs'][0]['results'][i])
          }

          for (let i = 0; i < stdoutRules.length; i++) {
            expect(stdoutRules[i]).toEqual(
              expected['runs'][0]['tool']['driver']['rules'][i]
            )
          }

          expect(stderr).toBe('')
          done()
        }
      )
    })
  })
})
