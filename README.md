# node-mysql-project

## Bamazon

Create an Amazon-like storefront with MySQL and Inquirer. The app receives orders from customers and depletes stock from the store's inventory. Also, a manager view is available that has a set of menu options a manager can choose from.

## Assignment

### Customer View

1. Create a MySQL database called `bamazon`.
2. Create a Table inside called `products`
3. The table should have the following:
   - item_id
   - product_name
   - department_name
   - price
   - stock_quantity
4. Then create a node app called `bamazonCustomer.js` and display all items available for sale.
5. Then prompt the user asking the ID of the product they would like to purchase, the second asks how many units.
6. Once the order's placed it should check if there's enough inventory in stock, and if so, complete order. (update database with remaining quantity and total cost of item.)

### Manager View

- Has a set of menu options for the manager to choose from:
  - View products for sale
  - View low inventory
  - Add to inventory
  - Add new product
- `View products for sale` lists every item available.
- `View low inventory` lists all items with an inventory count lower than five.
- `Add to inventory` displays a prompt that lets the manager add more of an item in store.
- `Add new product` allows manager to add a new product to the store and updates the table list with the newly added product.

## Node Packages used

- mysql (https://www.npmjs.com/package/mysql)
- inquirer (https://www.npmjs.com/package/inquirer)
- dotenv (https://www.npmjs.com/package/dotenv)

## Demo
