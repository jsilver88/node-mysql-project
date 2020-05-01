const mysql = require("mysql");
const inquirer = require("inquirer");
var Table = require("cli-table3");

let connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "060660Jr",
  database: "bamazon_DB",
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
}

bamazonCustomer();
