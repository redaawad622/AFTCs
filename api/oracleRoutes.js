const oracledb = require('oracledb')
const pass = '123'
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
          const query = 'select * from COD_GEHA_HOSOL_CODE where GEHA_HSOL_COD not in (1)'
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
}
