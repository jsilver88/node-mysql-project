const mysql = require("mysql");
const inquirer = require("inquirer");
let Table = require("cli-table3");

let connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: process.env.password,
  database: "bamazon_DB",
});

connection.connect(function (err) {
  console.log("Connected as id: " + connection.threadId);
  if (err) throw err;
});

function bamazonManager() {
  inquirer
    .prompt([
      {
        name: "manager",
        type: "list",
        message: "Choose from the following:",
        choices: [
          "View products for sale",
          "View low inventory",
          "Add to inventory",
          "Add new products",
          "Exit",
        ],
      },
    ])
    .then(function (answer) {
      if (answer.manager === "View products for sale") {
        bamazonProducts();
      } else if (answer.manager === "View low inventory") {
        lowInventory();
      } else if (answer.manager === "Add to inventory") {
        addInventory();
      } else if (answer.manager === "Add new products") {
        newProduct();
      } else if (answer.manager === "Exit") {
        console.log("Successfully logged out. Goodbye!");
        process.exit();
      }
    });
}

bamazonManager();
