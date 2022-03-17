let port = null
let oldPath = 'COM1'
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
let data = ''

function badany() {
  port = new SerialPort(oldPath, {
    baudRate: 9600,
    parity: 'none',
    dataBits: 8,
    stopBits: 1,
  })

  const parser = new Readline({
    delimiter: '\r\n',
  })
  port.pipe(parser)
  port.on('open', () => {
    parser.on('data', (da) => {
      data = da
    })
  })
}
module.exports = function (app, prisma) {
  app.get('/badanyRead', function (req, res) {
    const { path } = req.query

    if (!port) {
      oldPath = path
      badany()
    }
    if (path !== oldPath) {
      oldPath = path
      port.close()
      port = null
      badany()
    }

    res.json(data)
    data = 0
    port.write('#')
  })
  app.get('/getSerials', async function (req, res) {
    res.json(await SerialPort.list())
  })
}
