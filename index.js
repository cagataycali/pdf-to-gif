var spawn = require('electron-spawn')
var path = require('path')

const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function makeGIF (output, delay, loop) {
  await exec(`convert -loop ${loop} -delay ${delay} images/out-*.png ${output}.gif`)
  await exec(`rm images/out-*.png`)
}

module.exports = function (opts, cb) {
  var input = opts.input
  var output = opts.output || 'output'
  var scale = opts.scale || 0.5
  var delay = opts.delay || 100
  var loop = opts.loop || 0

  if (!input) cb(new Error('must provide input file'))
  if (!output) cb(new Error('must provide output file'))

  var electron = spawn(
    path.join(__dirname, 'spawn.js'),
    input.replace(/ /g, '\\ '),
    output.replace(/ /g, '\\ '),
    scale,
    {detached: true}
  )

  electron.stdout.on('data', function (data) {
    var message = data.toString()
    if (message.indexOf('Error: ') === 0) {
      message = message.replace('Error: ', '')
      if (cb) cb(new Error(message))
    }
    if (message.indexOf('Success: ') === 0) {
      setTimeout(function () {
        makeGIF(output, delay, loop)
        if (cb) cb()
      }, 1000)
    }
  })
}
