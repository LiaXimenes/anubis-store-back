# AnúbisStore (back-end)
My friend and I create this pet store together. You can view are products, register and maybe even buy thing if you like our store 😻 take a look!


![Peek anubisStore](https://user-images.githubusercontent.com/81389119/129632978-b9f2e87b-14d6-4607-be82-627aebd79828.gif)

## About
This is a web apllication built to be a e-commerce. At the store you can find products, search for them with tags, a register page and a cart.
Below are the implemented features:

* Sign-up
* Sign-in
* List of all products
* List of products by their tags
* Add product to your cart
* Remove product from your cart

## Technologies
The following tools and frameworks were used in the construction of the project:

* Node.js
* Express
* PostgreSQL
* Jest

## How to Run
1. Clone this repository
2. Clone the front-end repository at https://github.com/LiaXimenes/anubis-store-front
3. Follow instructions to run front-end https://github.com/LiaXimenes/anubis-store-front
4. Create a database using the ``dump.sql`` file inside the ``dump``
- 4.1 Open your terminal in the same path as the ``dump.sql`` file is located.
- 4.2 Access PostgreSQL
```bash
sudo su postgres
psql postgres
```
- 4.3 Create a database
```bash
CREATE DATABASE [database_name];
```
- 4.4 Then, quit psql and import the dump.sql file to your database
```bash
\q
psql [database_name] < dump.sql
```
- 4.5 Finally, you can connect your terminal on your database!
```bash
\c [database_name]
```
5. Install dependencies
```bash
npm i
```
6. Run the back-end with
```bash
npm run dev
```
