const dbconfig = require("../config/db.js");
const mysql = require("mysql2");

const dbconn = mysql.createConnection(dbconfig.mysqlconfig);
dbconn.connect((err) => {
  if (err) {
    console.error("Failed to connecting to database");
  }
  console.log("Succesfully connected to database");
});

const userRepo = {
  all_user: async () => {
    return new Promise((resolve, reject) => {
      const sql = "select * from register";
      dbconn.query(sql, (err, rows) => {
        if (err) {
          reject({ code: 100, msg: "user not found in register" });
        } else {
          resolve({ code: 101, msg: "success", data: rows });
        }
      });
    });
  },
  find_userById: async (id) => {
    return new Promise((resolve, reject) => {
      const sql = "select * from register where user_id=?";
      dbconn.query(sql, [id], (err, rows) => {
        if (err || rows <= 0) {
          reject({ code: 100, msg: "user id not found in register" });
        } else {
          resolve({ code: 101, msg: "success", data: rows });
        }
      });
    });
  },
  post_user: async(data)=>{
    return new Promise((resolve, reject) => {
      const sql = "select * from register where user_id=?";
      dbconn.query(sql, [data.userId], (err, rows) => {
        if (err || rows <= 0) {
          reject({ code: 100, msg: "user id not found in register" });
        } else {
          resolve({ code: 101, msg: "success", data: rows });
        }
      });
    });
  }
};

module.exports = { userRepo };
