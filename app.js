const path = require("path");
const express = require("express");
const hbs = require("hbs");
const app = express();
const port = 3000;
const admin = require("firebase-admin");
const cors = require("cors");
const { auth } = require("firebase-admin");
const elasticsearch = require("elasticsearch");
const { Console } = require("console");
const { O_APPEND } = require("constants");

// Initialize elasticsearch
const esClient = elasticsearch.Client({
  host: "http://192.168.1.8:9200/",
});

// Handlebars partials
hbs.registerPartials(__dirname + "/views/partials");

// Set dynamic views file
app.set("views", path.join(__dirname, "views"));

// Set view engine
app.set("view engine", "hbs");

// Set public folder as static folder for static file
app.use(express.static("public"));

// Index
app.get("/", (req, res) => {
  res.render("Login", {
    title: "Login",
  });
});

// Login
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
  });
});

// Laporan
app.get("/laporan", (req, res) => {
  res.render("dashboard/laporan", {
    title: "Laporan",
  });
});

// Kategori
app.get("/kategori", (req, res) => {
  esClient
    .search({
      index: "kategori",
      body: {
        query: {
          match_all: {},
        },
        sort: [
          {
            id: {
              order: "asc",
            },
          },
        ],
      },
    })
    .then((response) => {
      var resJson = response.hits;
      var allHits = resJson.hits;
      var dataID = [];
      var dataKategori = [];
      var dataLayanan = [];
      var count = Object.keys(allHits).length;
      for (var i = 0; i < count; i++) {
        dataID[i] = allHits[i]._source.id;
        dataKategori[i] = allHits[i]._source.nama_kategori;
        dataLayanan[i] = allHits[i]._source.nama_layanan;
        var tabel = [];
        for (var j = 0; j < count; j++) {
          tabel.push(
            "<tr>\
          <td>" +
              dataID[j] +
              "</td>\
          <td>" +
              dataKategori[j] +
              "</td>\
          <td>" +
              dataLayanan[j] +
              "</td>\
              </tr>"
          );
        }
        // var data = [];
        // for (var j = 0; j < 1; j++) {
        //   data.push(dataID, dataKategori, dataLayanan);
        // }
      }
      // Convert JSON to string
      var dK = JSON.stringify(tabel);
      res.render("dashboard/kategori", {
        title: "Kategori",
        total: count,
        dK: dK,
      });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error" });
    });
});

// User
app.get("/user", (req, res) => {
  res.render("dashboard/user", {
    title: "User",
  });
});

// Layanan
app.get("/layanan", (req, res) => {
  res.render("dashboard/layanan", {
    title: "Layanan Publik",
  });
});

// Admin
app.get("/admin", (req, res) => {
  res.render("dashboard/admin", {
    title: "Administrator",
  });
});

// Profil
app.get("/akun", (req, res) => {
  res.render("dashboard/akun", {
    title: "Akun",
  });
});

// Listen
app.listen(port, () => {
  console.log(`MedanHub listening at http://localhost:${port}`);
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.send("<h1><center>404 Error<br>Page not found</center></h1>");
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});
