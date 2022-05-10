const oracledb = require('oracledb')
const pass = 'Mrakez@@#$%00_<||>_)!@##!'
module.exports = function (app, prisma) {
  app.get('/tryConnection', async (req, res) => {
    try {
      // eslint-disable-next-line no-var
      var connection = await oracledb.getConnection({
        user: 'ent',
        password: pass,
        // connectString: '192.9.202.125:1521/REDA',
        connectString:
          '(DESCRIPTION =(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST =192.9.202.125)(PORT = 1521)))(CONNECT_DATA = (SERVICE_NAME = orcl)))',
      })
      console.log('connected to database')
    } catch (err) {
      res.status(422).json({
        type: 'connection error',
        message: err.message,
      })
    } finally {
      if (connection) {
        try {
          // Always close connections
          // const query=`SELECT g.SH_NAME, e.MOSALSAL, e.C_MAR1, e.MILAD, e.MARHLA, e.MOHAFZA_C, e.BARCODE_NO
          // FROM     TAG.ESTKBAL_D e, TAG.GOND g
          // WHERE    e.MOSALSAL = g.MOSALSAL AND e.MILAD = g.MILAD AND e.MILAD = g.MILAD AND e.C_MAR1 = g.C_MAR1`
          const query =
            'select * from COD_GEHA_HOSOL_CODE where GEHA_HSOL_COD not in (1)'
          const result = await connection.execute(query)
          await connection.close()
          console.log('close connection success')
          res.status(200).json(result)
        } catch (err) {
          res.status(422).json({
            type: 'db error',
            message: err.message,
          })
        }
      }
    }
  })
  app.get('/getStageSold', async (req, res) => {
    try {
      // eslint-disable-next-line no-var
      var connection = await oracledb.getConnection({
        user: 'MRAKEZ_TADREEB',
        password: pass,
        // connectString: '192.9.202.125:1521/REDA',
        connectString:
          '(DESCRIPTION =(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST =192.9.202.16)(PORT = 1521)))(CONNECT_DATA = (SERVICE_NAME = entnew)))',
      })
      console.log('connected to database')
    } catch (err) {
      res.status(422).json({
        type: 'connection error',
        message: err.message,
      })
    } finally {
      if (connection) {
        try {
          // Always close connections
          // const query=`SELECT g.SH_NAME, e.MOSALSAL, e.C_MAR1, e.MILAD, e.MARHLA, e.MOHAFZA_C, e.BARCODE_NO
          // FROM     TAG.ESTKBAL_D e, TAG.GOND g
          // WHERE    e.MOSALSAL = g.MOSALSAL AND e.MILAD = g.MILAD AND e.MILAD = g.MILAD AND e.C_MAR1 = g.C_MAR1`
          const query = 'select * from ent.v_mrakez_tadreeb'
          let data = await connection.execute(query)
          await connection.close()

          console.log('close connection success')
          // prisma code to insert
          const exist = await prisma.Examiners.findMany()
          res.json('done')
          data = data.rows.filter(
            (q) => exist.findIndex((a) => a.national_id === q[2]) < 0
          )

          const values = data
            .map(
              (value) =>
                `('${value[2]}','${value[0] || null}', '${value[1]}', '${
                  value[3]
                }', ${value[4] || null}, ${value[5] || null})`
            )
            .join(',\n\t')
          if (values && values.length > 0) {
            await prisma.$executeRawUnsafe(
              `INSERT INTO \`Examiners\` (national_id,triple_number,name,stage,mohafza_code,qualification_code) VALUES \n\t${values}`
            )
          }
          res.status(200).json(data.length)
        } catch (err) {
          res.status(422).json({
            type: 'db error',
            message: err.message,
          })
        }
      }
    }
  })
  app.get('/getStageSoldNew', async (req, res) => {
    try {
      // eslint-disable-next-line no-var
      var connection = await oracledb.getConnection({
        user: 'MRAKEZ_TADREEB',
        password: pass,
        // connectString: '192.9.202.125:1521/REDA',
        connectString:
          '(DESCRIPTION =(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST =192.9.202.16)(PORT = 1521)))(CONNECT_DATA = (SERVICE_NAME = entnew)))',
      })
      console.log('connected to database')
    } catch (err) {
      res.status(422).json({
        type: 'connection error',
        message: err.message,
      })
    } finally {
      if (connection) {
        try {
          // Always close connections
          // const query=`SELECT g.SH_NAME, e.MOSALSAL, e.C_MAR1, e.MILAD, e.MARHLA, e.MOHAFZA_C, e.BARCODE_NO
          // FROM     TAG.ESTKBAL_D e, TAG.GOND g
          // WHERE    e.MOSALSAL = g.MOSALSAL AND e.MILAD = g.MILAD AND e.MILAD = g.MILAD AND e.C_MAR1 = g.C_MAR1`
          let exist = await prisma.Examiners.findMany({
            select: {
              national_id: true,
            },
          })
          exist = exist.map((a) => a.national_id)

          const query = `select * from ent.v_mrakez_tadreeb`
          const data = await connection.execute(query)
          let nationals = data.rows.map((x) => x[2])
          nationals=nationals.filter((n) => !exist.includes(n))
          await connection.close()
          res.json(nationals)

          console.log('close connection success')
          // prisma code to insert

          const response = data.rows.concat(exist)
          response.sort()

          const values = data
            .map(
              (value) =>
                `('${value[2]}','${value[0] || null}', '${value[1]}', '${
                  value[3]
                }', ${value[4] || null}, ${value[5] || null})`
            )
            .join(',\n\t')
          if (values && values.length > 0) {
            await prisma.$executeRawUnsafe(
              `INSERT INTO \`Examiners\` (national_id,triple_number,name,stage,mohafza_code,qualification_code) VALUES \n\t${values}`
            )
          }
          res.status(200).json(data.length)
        } catch (err) {
          res.status(422).json({
            type: 'db error',
            message: err.message,
          })
        }
      }
    }
  })
}
