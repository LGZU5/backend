import mysql from 'mysql2';
import dotenv from 'dotenv'; // Importa la librería dotenv
dotenv.config(); // Carga las variables de entorno desde el archivo .env

const pool = mysql
  .createPool({
    host: process.env.DB_HOST, // Accede a las variables usando process.env
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
  .promise();

  export const signUp = async (email, cryptPass) => {
    try {
      const connection = await pool.getConnection();
      
      // Check if email already exists
      const emailExistsQuery = 'SELECT COUNT(*) as count FROM data_users WHERE email = ?';
      const [emailCount] = await connection.query(emailExistsQuery, [email]);
      if (emailCount[0].count > 0) {
        throw new Error('El correo electrónico ya está registrado');
      }
  
      const query = 'INSERT INTO data_users (email, password) VALUES (?, ?)';
      const values = [email, cryptPass];
      const [result] = await connection.query(query, values);
      connection.release();
      return result;
    } catch (error) {
      throw error; // Asegúrate de lanzar la excepción original
    }
  };

  export const updateName = async (insertId, name) => {
    try {
      const connection = await pool.getConnection();
      const query = 'UPDATE data_users SET name = ? WHERE id = ?';
      const values = [name, insertId];
      const [result] = await connection.query(query, values);
      connection.release();
      return result;
    } catch (error) {
      throw error;
    }
  };

  export const updatePhoneNumber = async (insertId, fullPhoneNumber) => {
    try {
      const connection = await pool.getConnection();
      const query = 'UPDATE data_users SET number = ? WHERE id = ?';
      const values = [fullPhoneNumber, insertId];
      const [result] = await connection.query(query, values);
      connection.release();
      return result;
    } catch (error) {
      throw error;
    }
  };

  export const getUserName = async (insertId) => {
    try {
      const connection = await pool.getConnection();
      const query = 'SELECT name FROM data_users WHERE id = ?';
      const [result] = await connection.query(query, [insertId]);
      connection.release();
  
      return result.length > 0 ? result[0].name : null;
    } catch (error) {
      throw error;
    }
  };

  export const insertImageURL= async (userId, fileLocationWithoutPublic) => {
    try {
      const connection = await pool.getConnection();
      const query = 'UPDATE data_users SET profile_image_url = ? WHERE id = ?';
      const values = [fileLocationWithoutPublic, userId];
      const [result] = await connection.query(query, values);
      connection.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  export const Login = async (email) => {
    try {
      const connection = await pool.getConnection();
      const userQuery = 'SELECT * FROM data_users WHERE email = ?';
      const [userRows] = await connection.query(userQuery, [email]);
      await connection.release();
  
      if (userRows.length === 0) {
        return null; // Usuario no encontrado
      }
      const user = userRows[0];
      return user;
    } catch (error) {
      throw error; // Asegúrate de lanzar la excepción original
    }
  }

  export const getUserData = async (email) => {
    try {
      const connection = await pool.getConnection();
      const query = 'SELECT * FROM data_users WHERE email = ?';
      const [result] = await connection.query(query, [email]);
      connection.release();
  
      return result;
    } catch (error) {
      throw error;
    }
  };

  export const getProfilePhoto = async (email) => {
    try {
      const connection = await pool.getConnection();
      const query = 'SELECT * FROM data_users WHERE email = ?';
      const [result] = await connection.query(query, [email]);
      connection.release();
  
      return result;
    } catch (error) {
      throw error;
    }
  };

  export const editImageProfile= async (email, fileLocationWithoutPublic) => {
    try {
      const connection = await pool.getConnection();
      const query = 'UPDATE data_users SET profile_image_url = ? WHERE email = ?';
      const values = [fileLocationWithoutPublic, email];
      const [result] = await connection.query(query, values);
      connection.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  export const editImageBanner= async (email, fileLocationWithoutPublic) => {
    try {
      const connection = await pool.getConnection();
      const query = 'UPDATE data_users SET banner_image = ? WHERE email = ?';
      const values = [fileLocationWithoutPublic, email];
      const [result] = await connection.query(query, values);
      connection.release();
      return result;
    } catch (error) {
      throw error;
    }
  }
  