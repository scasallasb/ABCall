const mysql = require('mysql2/promise');

class IncidentRepository {
  constructor() {
    const host = 'db-abcall.mysql.database.azure.com';
    this.pool = mysql.createPool({
      host: host,
      user: 'abcalladm',
      password: 'Archng2024*',
      database: 'abcall',
      port: 3306,
      ssl: {
        rejectUnauthorized: true
      }
    });
  }

  async getAllIncidentsWithUsers() {
    let connection;
    try {
      connection = await this.pool.getConnection();

      const [rows] = await connection.query(`
        SELECT 
          i.idIncidente, i.tipoIncidente, i.descripcionIncidente, i.fechaIncidente, i.estadoIncidente,
          u.idUsuario, u.nombreUsuario, u.cedula, u.emailUsuario, u.telefonoUsuario, u.direccionUsuario
        FROM incidente i
        JOIN usuario u ON i.cedula = u.cedula
      `);

      return rows.map(row => ({
        idIncidente: row.idIncidente,
        tipoIncidente: row.tipoIncidente,
        descripcionIncidente: row.descripcionIncidente,
        fechaIncidente: row.fechaIncidente,
        estadoIncidente: row.estadoIncidente,
        usuario: {
          idUsuario: row.idUsuario,
          nombreUsuario: row.nombreUsuario,
          cedula: row.cedula,
          emailUsuario: row.emailUsuario,
          telefonoUsuario: row.telefonoUsuario,
          direccionUsuario: row.direccionUsuario
        }
      }));

    } catch (error) {
      
      throw new Error('Error al conectar a la base de datos o al obtener los incidentes con los usuarios.');
    } finally {
      
      if (connection) {
        connection.release();
      }
    }
  }
}


const instance = new IncidentRepository();
Object.freeze(instance);

module.exports = instance;
