import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'

module.exports = function (app, prisma, types) {
  app.post('/saveFake', async (req, res) => {
    console.log('start')
    try {
      const buffer = readFileSync('./prisma/units.mdb')
      const reader = new MDBReader(buffer)
      const table = await reader.getTable('HAYAA_TNZ_UNIT_CODE')
      // table.getColumnNames() // ['id', 'name', 'color']
      console.log('fetching')
      let data = await table.getData()
      console.log('map data....')

      data = data.map((v) => {
        return prisma.$executeRawUnsafe(
          `INSERT INTO \`UnitNames\` (name) select '${v.UNIT_NAME}';`
        )
      })
      console.log('start insert ', data.length)
      const whatDone = await prisma.$transaction(data)
      console.log('done')
      res.json(
        `عدد ما تم تحديثه (${
          whatDone.filter((e) => e === 1).length
        }) عدد الاخطاء و ما لم يتم تحديثه (${
          whatDone.filter((e) => e === 0).length
        })`
      )
    } catch (error) {
      console.log(error)
      return res.status(422).json(error)
    }
  })
  app.get('/readExaminerFromMdb', async (req, res) => {
    const buffer = readFileSync('./prisma/db.mdb')
    const reader = new MDBReader(buffer)
    const table = await reader.getTable('Examiners')
    // table.getColumnNames() // ['id', 'name', 'color']
    let data = await table.getData()
    const exist = await prisma.Examiners.findMany()
    data = data.filter(
      (q) => exist.findIndex((a) => a.national_id === q.national_id) < 0
    )
    const values = data
      .map(
        (value) =>
          `('${value.national_id}', '${value.name}', '${value.stage}', ${
            value.mohafza_code || null
          }, ${value.qualification_code || null})`
      )
      .join(',\n\t')

    await prisma.$executeRawUnsafe(
      `INSERT INTO \`Examiners\` (national_id, name,stage,mohafza_code,qualification_code) VALUES \n\t${values};`
    )
    res.json(data)
  })
  app.post('/readUnitsFromMdb', async (req, res) => {
    console.log('start')
    try {
      const buffer = readFileSync('./prisma/TNZ_GEHA_CODE.mdb')
      const reader = new MDBReader(buffer)
      const table = await reader.getTable('TNZ_GEHA_CODE')
      // table.getColumnNames() // ['id', 'name', 'color']
      console.log('fetching')
      let data = await table.getData()
      console.log('map data....')

      data = data.map((v) => {
        return prisma.$executeRawUnsafe(
          `UPDATE Examiners SET UNIT_NAME ='${v.UNIT_NAME}',GEHA_NAME ='${
            v.GEHA_NAME
          }',TAMARKZ_NAME ='${v.TAMARKZ_NAME}',UNIT_ARMY_NAME ='${
            v.UNIT_ARMY_NAME
          }',ARMY_TAGNEED_NAME ='${v.ARMY_TAGNEED_NAME}',sold_id ='${
            v.MIL_NO || null
          }' WHERE triple_number = '${v.RAKMSOLASY}'`
        )
      })
      console.log('start update ', data.length)
      const whatDone = await prisma.$transaction(data)
      console.log('done')
      res.json(
        `عدد ما تم تحديثه (${
          whatDone.filter((e) => e === 1).length
        }) عدد الاخطاء و ما لم يتم تحديثه (${
          whatDone.filter((e) => e === 0).length
        })`
      )
    } catch (error) {
      console.log(error)
      return res.status(422).json(error)
    }
  })
  app.post('/writeExaminerToMdb', async (req, res) => {
    const buffer = readFileSync('./prisma/db.mdb')
    const reader = new MDBReader(buffer)
    const table = await reader.getTable('Examiners')
    // table.getColumnNames() // ['id', 'name', 'color']
    const data = await table.getData()
    const exist = await prisma.Examiners.findMany()
    data.filter(
      (q) => exist.findIndex((a) => a.national_id === q.national_id) < 0
    )
    const examiners = []
    await data.forEach(async (e) => {
      const ex = await prisma.Examiners.upsert({
        where: {
          national_id: e.national_id,
        },
        update: {},
        create: e,
      })
      examiners.push(ex)
    })

    res.json(examiners)
    // [{id: 5, name: 'Ashley', color: 'black'}, ...]
  })

  app.get('/saveWeapon', async (req, res) => {
    const buffer = readFileSync('./prisma/selah_cod.mdb')
    const reader = new MDBReader(buffer)
    const table = await reader.getTable('SELAH_COD')
    // table.getColumnNames() // ['id', 'name', 'color']
    const data = await table.getData()
    const values = data
      .map((value) => `('${value.V_SELAH}', '${value.MIL_SELAH}')`)
      .join(',\n\t')

    await prisma.$executeRawUnsafe(
      `INSERT INTO \`Weapons\` (V_SELAH, MIL_SELAH) VALUES \n\t${values};`
    )
    res.json(data)
  })
}
