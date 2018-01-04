var pdf = require('pdfjs-dist')
var fs = require('fs')

module.exports = function (args) {
  var input = args[1]
  var output = args[2]
  var scale = args[3]

  if (!fs.existsSync(input)) {
    error('file ' + input + ' not found')
  }

  var data = fs.readFileSync(input)

  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')

  function save (doc, i = 1) {
    doc.getPage(i).then(function (page) {
      var viewport = page.getViewport(scale)

      canvas.height = viewport.height
      canvas.width = viewport.width

      var renderer = {
        canvasContext: ctx,
        viewport: viewport
      }

      page.render(renderer).then(function () {
        ctx.globalCompositeOperation = 'destination-over'
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        var img = canvas.toDataURL('image/png')
        img = img.replace(/^data:image\/png;base64,/, '')
        fs.writeFileSync('images/out-' + i + '.png', img, 'base64')
        ++i
        if (i === doc.numPages) {
          success('file ' + output + ' written')
        } else {
          save(doc, i)
        }
      })
    })
  }

  pdf.getDocument(data).then(function (doc) {
    console.log(doc.numPages)
    save(doc, 1)
  })
}

function error (message) {
  console.log('Error: ' + message)
  exit()
}

function success (message) {
  console.log('Success: ' + message)
  exit()
}

function exit () {
  require('remote').require('app').quit()
}
