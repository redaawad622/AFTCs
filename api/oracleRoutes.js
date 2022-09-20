const oracledb = require('oracledb')
const pass = 'Mrakez@@#$%00_<||>_)!@##!'
const entPass = 'ent'
module.exports = function (app, prisma) {
  app.post('/getDataFromTag', async (req, res) => {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    let stage = year + '1'
    if ([1, 2, 3].includes(month)) {
      stage = year + '2'
    } else if ([4, 5, 6].includes(month)) {
      stage = year + '3'
    } else if ([7, 8, 9].includes(month)) {
      stage = year + '4'
    } else if ([10, 11, 12].includes(month)) {
      stage = year + '1'
    }
    try {
      // eslint-disable-next-line no-var
      var connection = await oracledb.getConnection({
        user: 'ent',
        password: entPass,
        // connectString: '192.9.202.125:1521/REDA',
        connectString:
          '(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = 128.14.3.11)(PORT = 1521)))(CONNECT_DATA = (SERVICE_NAME = isca1)))',
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
          const id = req.headers.id
          console.log('get data for stage ', stage)
          // Always close connections
          const query = `SELECT  g.KAWMY_NUM,g.MOSALSAL,g.C_MAR1,g.MILAD,g.SH_NAME,e.MARHLA,e.BARCODE_NO,e.MOHAFZA_C,m.C_MOSTAWA,g.C_EGTEMAEA,m.C_MOAHEL
          FROM     TAG.ESTKBAL_D e, TAG.GOND g,TAG.FAHS_MASTER f,TAG.MAHL_D m
          WHERE    f.C_MOSTAWA_TEBY <> 4 AND MARHLA='${stage}' AND g.MOSALSAL = e.MOSALSAL AND g.MOSALSAL = f.MOSALSAL AND g.MOSALSAL = m.MOSALSAL AND g.MILAD = e.MILAD AND g.MILAD = f.MILAD AND g.MILAD = m.MILAD  AND  g.C_MAR1 = e.C_MAR1 AND g.C_MAR1 = f.C_MAR1 AND g.C_MAR1 = m.C_MAR1`

          let data = await connection.execute(query)
          await connection.close()
          console.log('close connection success')
          data = data.rows
          console.log('data', data.length)
          const queryToRun = data.map((value) =>
            prisma.$executeRawUnsafe(
              ` INSERT OR IGNORE INTO \`Examiners\` (national_id,triple_number,name,stage,barcode,mohafza_code,qualification_code,marital_state,educational_degree,user_id)
                  select '${value[0]}','${
                value[1] + '/' + value[2] + '/' + value[3]
              }', '${value[4]}', '${value[5]}', '${value[6]}', ${
                value[7] || null
              },${value[8] || null},'${value[9]}','${value[10]}',${Number(id)}`
            )
          )
          let output = null
          if (queryToRun && queryToRun.length > 0) {
            console.log('start', queryToRun.length)
            output = await prisma.$transaction(queryToRun)
            console.log('end')
          }
          res.status(200).json(output)
        } catch (err) {
          res.status(422).json({
            type: 'db error',
            message: err.message,
          })
        }
      }
    }
  })
  app.get('/getStageSold', async (_, res) => {
    try {
      // eslint-disable-next-line no-var
      var connection = await oracledb.getConnection({
        user: 'MRAKEZ_TADREEB',
        //  user: 'ent',
        password: pass,
        // connectString: '192.9.202.125:1521/REDA',
        connectString:
          '(DESCRIPTION =(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST =192.9.202.17)(PORT = 1521)))(CONNECT_DATA = (SERVICE_NAME = entnew)))',
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
          console.log('data', data[0])
          const queryToRun = data.map((value) =>
            prisma.$executeRawUnsafe(
              ` INSERT or replace INTO \`Examiners\` (national_id,triple_number,name,stage,mohafza_code,qualification_code,marital_state,educational_degree)
                  select '${value[2]}','${value[0] || null}', '${value[1]}', '${
                value[3]
              }', ${value[4] || null}, ${value[5] || 0},'${
                value[7] || null
              }','${value[6] || null}'
                  where NOT EXISTS (SELECT 1 FROM Examiners WHERE national_id = '${
                    value[2]
                  }')
                 `
            )
          )
          let out = null
          if (queryToRun && queryToRun.length > 0) {
            console.log('start', queryToRun.length)
            out = await prisma.$transaction(queryToRun)
            console.log('end')
          }
          res.status(200).json(out)
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
