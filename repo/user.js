const dbconfig = require("../config/db.js");
const mysql = require("mysql2");

const dbconn = mysql.createConnection(dbconfig.mysqlconfig);
dbconn.connect((err) => {
  if (err) {
    console.error("Failed to connecting to database");
    return;
  }
  console.log("Succesfully connected to database");
});

const queryDB = (sql, value = []) => {
  return new Promise((resolve, reject) => {
    dbconn.query(sql, value, (err, rows) => {
      if (err) {
        reject({ msg: "Database query error", error: err });
      } else {
        resolve(rows);
      }
    });
  });
};

const userRepo = {
  all_user: async () => {
    try {
      const sql = "SELECT * FROM register";
      const rows = await queryDB(sql);
      return { code: 101, msg: "success", data: rows };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  find_userById: async (id) => {
    try {
      const sql = "select * from register where user_id=?";
      const rows = await queryDB(sql, [id]);
      if (rows.length === 0) {
        throw { code: 100, msg: "user id not found in register" };
      }
      return { code: 101, msg: "success", data: rows };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  post_user: async (data) => {
    try {
      const sql = "select * from register where user_id=?";
      const rows = await queryDB(sql, [data.userId]);
      if (rows.length === 0) {
        throw { code: 100, msg: "user id not found in register" };
      }
      return { code: 101, msg: "success", data: rows };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

module.exports = { userRepo };
