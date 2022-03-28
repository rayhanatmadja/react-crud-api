const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "localhost",
  password: "",
  user: "root",
  database: "rest_api",
});

// connect db
db.connect(err => {
  if (err) console.log(err);
  else console.log("db connect");
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET Method
app.get("/pegawai", (req, res) => {
  let sql = "select * from pegawai";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      let response = {
        count: result.length,
        pegawai: result,
      };

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(response));
    }
  });
});

// POST Method (Search Data)
app.post("/pegawai", (req, res) => {
  let find = req.body.find;
  let sql =
    "select * from pegawai where nip like '%" +
    find +
    "%' or nama like '%" +
    find +
    "%' or alamat like '%" +
    find +
    "%'";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      let response = {
        count: result.length,
        pegawai: result,
      };

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(response));
    }
  });
});

// POST Method (Save Data)
app.post("/pegawai/save", (req, res) => {
  let data = {
    nip: req.body.nip,
    nama: req.body.nama,
    alamat: req.body.alamat,
  };
  let message = "";

  let sql = "insert into pegawai set ?";
  db.query(sql, data, (err, result) => {
    if (err) {
      message = err.message;
    } else {
      message = result.affectedRows + " row inserted";
    }

    let response = {
      message: message,
    };

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
  });
});

// PUT Mtethod (Update Data)
app.put("/pegawai/update", (req, res) => {
  let data = [
    {
      nip: req.body.nip,
      nama: req.body.nama,
      alamat: req.body.alamat,
    },
    req.body.nip,
  ];
  let message = "";

  let sql = "update pegawai set ? where nip = ?";
  db.query(sql, data, (err, result) => {
    if (err) {
      message = err.message;
    } else {
      message = result.affectedRows + " row updated";
    }

    let response = {
      message: message,
    };

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
  });
});

// DELETE Method
app.delete("/pegawai/:nip", (req, res) => {
  let data = {
    nip: req.params.nip,
  };
  let message = "";
  let sql = "delete from pegawai where ?";
  db.query(sql, data, (err, result) => {
    if (err) {
      message = err.message;
    } else {
      message = result.affectedRows + " row deleted";
    }

    let response = {
      message: message,
    };

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response));
  });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
