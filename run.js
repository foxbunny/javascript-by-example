var execSync = require('child_process').execSync
var fs = require('fs')
var literatejs = require('literatejs')

function main() {
  var module = process.argv[2] + '.md'
  var output = module + '.js'

  literatejs.extract(module)
    .then(function (code) {
      return literatejs.write(output, code)
    })
    .then(function () {
      execSync('flow ' + output, {
        stdio: [process.stdin, process.stdout, process.stderr]
      })
      execSync('babel-node ' + output, {
        stdio: [process.stdin, process.stdout, process.stderr]
      })
    })
    .then(function () {
      fs.unlinkSync(output)
    })
    .catch(function () {
      fs.unlinkSync(output)
    })
}

if (require.main === module) {
  main()
}
