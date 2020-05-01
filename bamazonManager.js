require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
let Table = require("cli-table3");

let connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
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

function bamazonProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    let table = new Table({
      head: [
        "Item ID",
        "Product Name",
        "Department Name",
        "Price",
        "Stock Quantity",
      ],
      colWidths: [10, 25, 25, 10, 25],
    });

    for (let i = 0; i < res.length; i++) {
      let tableInput = res[i];
      table.push([
        tableInput.item_id,
        tableInput.product_name,
        tableInput.department_name,
        tableInput.price,
        tableInput.stock_quantity,
      ]);
    }
    console.log(table.toString());
    bamazonManager();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    let table = new Table({
      head: [
        "Item ID",
        "Product Name",
        "Department Name",
        "Price",
        "Stock Quantity",
      ],
      colWidths: [10, 25, 25, 10, 25],
    });
    for (let i = 0; i < res.length; i++) {
      let tableInput = res[i];
      if (tableInput.stock_quantity < 5) {
        table.push([
          tableInput.item_id,
          tableInput.product_name,
          tableInput.department_name,
          tableInput.price,
          tableInput.stock_quantity,
        ]);
        console.log("Inventory's low, please restock.");
      } else {
        console.log("Inventory's stocked.");
      }
    }
    console.log(table.toString());
    bamazonManager();
  });
}

bamazonManager();
