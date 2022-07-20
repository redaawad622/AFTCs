const oracledb = require('oracledb')
const pass = 'Mrakez@@#$%00_<||>_)!@##!'
// const pass = '2007sherif'
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
        //  user: 'ent',
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
          const query = 'select * from ent.V_MRAKEZ_TADREEB'
          let data = await connection.execute(query)

          await connection.close()

          console.log('close connection success')
          // prisma code to insert

          data = data.rows
          res.json(data[0])
          console.log('data', data.length)
          const queryToRun = data.map((value) =>
            prisma.$executeRawUnsafe(
              ` INSERT INTO \`Examiners\` (national_id,triple_number,name,stage,mohafza_code,qualification_code,marital_state,educational_degree)
                  select '${value[2]}','${value[0] || null}', '${value[1]}', '${
                value[3]
              }', ${value[4] || null}, ${value[5] || null},'${
                value[6] || null
              }','${value[7] || null}'
                  where NOT EXISTS (SELECT 1 FROM Examiners WHERE national_id = '${
                    value[2]
                  }')
                 `
            )
          )

          if (queryToRun && queryToRun.length > 0) {
            console.log('start', queryToRun.length)
            await prisma.$transaction(queryToRun)
            console.log('end')
          }
          res.status(200).json(queryToRun)
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
