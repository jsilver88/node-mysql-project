require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
var Table = require("cli-table3");

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

function bamazonCustomer() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    var table = new Table({
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
      let results = res[i];
      table.push([
        results.item_id,
        results.product_name,
        results.department_name,
        results.price,
        results.stock_quantity,
      ]);
    }
    console.log(table.toString());
  });

  inquirer
    .prompt([
      {
        name: "itemId",
        type: "input",
        message: "Enter the ID # you would like to purchase.",
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
        message: "Enter quantity amount.",
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
      let custAmount = answer.amount;
      let custItem = answer.itemId;
      connection.query(
        "SELECT * FROM products WHERE ?",
        { item_id: custItem },
        function (err, item) {
          if (err) throw err;
          if (custAmount <= item[0].stock_quantity) {
            console.log("We have " + item[0].product_name + " in stock.");
            console.log(
              "Here's your order: " +
                item[0].product_name +
                ". Quantity: " +
                custAmount +
                ". Order total: " +
                item[0].price * custAmount
            );
            connection.query(
              "UPDATE products SET stock_quantity=? WHERE item_id=?",
              [item[0].stock_quantity - custAmount, custItem],
              function (err, remainder) {
                if (err) throw err;
                reOrder();
              }
            );
          } else {
            console.log("Insufficient quantity amount!");
            bamazonCustomer();
          }
        }
      );
    });
}

function reOrder() {
  inquirer
    .prompt([
      {
        name: "addToOrder",
        type: "list",
        message: "Would you like to continue shopping?",
        choices: ["Yes", "No"],
      },
    ])
    .then(function (answer) {
      if (answer.addToOrder === "Yes") {
        bamazonCustomer();
      } else {
        console.log("Thank you for your business...Goodbye");
        connection.end();
      }
    });
}

bamazonCustomer();
