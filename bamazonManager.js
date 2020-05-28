require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");

let connection = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

connection.connect(function (err) {
  if (err) throw err;
});

function bamazonManager() {
  inquirer
    .prompt([
      {
        name: "manager",
        type: "list",
        message: "Choose from the following",
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

    for (let i = 0; i < res.length; i++) {
      let results = res[i];
      console.log(
        results.item_id +
        " | " +
        results.product_name +
        " | " +
        results.department_name +
        " | " +
        results.price +
        " | " +
        results.stock_quantity
      );
    }
    bamazonManager();
  });
}

function lowInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      let results = res[i];
      if (results.stock_quantity < 5) {
        console.log(
          results.item_id +
          " | " +
          results.product_name +
          " | " +
          results.department_name +
          " | " +
          results.price +
          " | " +
          results.stock_quantity
        );

        console.log("Inventory's low, please restock.");
      } else {
        console.log("Inventory's stocked.");
      }
    }
    bamazonManager();
  });
}

function addInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      let results = res[i];
      console.log(
        results.item_id +
        " | " +
        results.product_name +
        " | " +
        results.department_name +
        " | " +
        results.price +
        " | " +
        results.stock_quantity
      );
    }

    inquirer
      .prompt([
        {
          name: "item_id",
          type: "input",
          message: "What item # would you like to add?",
          validate: function (value) {
            if (isNaN(value) == false) {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          name: "amount",
          type: "input",
          message: "Enter quantity amount",
          validate: function (value) {
            if (isNaN(value) == false) {
              return true;
            } else {
              return false;
            }
          },
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT * FROM products WHERE ?",
          [
            {
              item_id: answer.item_id,
            },
          ],
          function (err, item) {
            if (err) throw err;
            console.log("Product added successfully.");
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity:
                    parseFloat(item[0].stock_quantity) +
                    parseFloat(answer.amount),
                },
                {
                  item_id: answer.item_id,
                },
              ],
              function (err) {
                if (err) throw err;
                bamazonManager();
              }
            );
          }
        );
      });
  });
}

function newProduct() {
  inquirer
    .prompt([
      {
        name: "newProduct",
        type: "input",
        message: "Name of product",
      },
      {
        name: "department",
        type: "input",
        message: "Enter department category",
      },
      {
        name: "price",
        type: "input",
        message: "Enter cost of item ($)",
        validate: function (value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "amount",
        type: "input",
        message: "Enter quantity amount",
        validate: function (value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        },
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.newProduct,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.amount,
        },
        function (err, res) {
          if (err) throw err;
          console.log(answer.newProduct + " added.");
          bamazonManager();
        }
      );
    });
}

bamazonManager();
