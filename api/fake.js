module.exports = function (app, prisma) {
  app.post('/examinerFake', async (req, res) => {
    let { number } = req.body
    if (!number) {
      number = 1000
    }
    for (let index = 0; index < number; index++) {
      await prisma.Examiners.create({
        data: {
          national_id: String(
            Math.floor(10000000000000 + Math.random() * 90000000000000)
          ),
          triple_number:
            Math.floor(1000 + Math.random() * 9000) +
            '/' +
            Math.floor(100 + Math.random() * 900) +
            Math.floor(1000 + Math.random() * 9000),
          name: makeid(5) + ' ' + makeid(4),
          stage: String(Math.floor(10000 + Math.random() * 90000)),

          sold_id: String(
            Math.floor(1000000000000 + Math.random() * 9000000000000)
          ),
        },
      })
    }
    res.json('done')
  })
}
function makeid(length) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
