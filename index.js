var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

var port = 8080;
var productsPath = path.join(__dirname, 'products.txt');
var categoriesPath = path.join(__dirname, 'categories.txt');
var computers = [];
var categories = [];

var categoriesRouter = express.Router();

fs.readFile(categoriesPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading categories file:', err);
        return;
    }
    try {
        categories = JSON.parse(data);
        console.log(categories)
    } catch (parseError) {
        console.error('Error parsing categories JSON:', parseError);
    }
});

function findCategory(category) {
    return categories.find(cat => cat.category === category);
}

categoriesRouter.route("/")
    .get((req, res) => {     
        const result = `<pre>${categories.map(cat => `Category: ${cat.category}`).join('<br>')}</pre>`;
        res.setHeader('Content-Type', 'text/html');
        res.send(result);
    });

categoriesRouter.route("/:category")
    .get((req, res) => {
        var category = findCategory(req.params.category);
        if (category) {
            const result = `Category: ${category.category}`;
            res.setHeader('Content-Type', 'text/plain');
            res.send(result);
        } else {
            res.status(404).send('Category not found');
        }
    });

app.use("/categories", categoriesRouter);

fs.readFile(productsPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading products file:', err);
        return;
    }
    try {
        computers = JSON.parse(data);
    } catch (parseError) {
        console.error('Error parsing products JSON:', parseError);
    }
});

function findComputerByName(name) {
    return computers.find(computer => computer.name === name);
}

var productsRouter = express.Router();

productsRouter.route("/")
    .get((req, res) => {     
        const result = `<pre>${computers.map(computer => `Name: ${computer.name}, Price: ${computer.price}`).join('<br>')}</pre>`;
        res.setHeader('Content-Type', 'text/html');
        res.send(result);
    });

productsRouter.route("/:name")
    .get((req, res) => {
        var computer = findComputerByName(req.params.name);
        if (computer) {
            const result = `Name: ${computer.name}, Price: ${computer.price}`;
            res.setHeader('Content-Type', 'text/plain');
            res.send(result);
        } else {
            res.status(404).send('Computer not found');
        }
    });

app.use("/products", productsRouter);



app.get('/', (req, res) => {
    res.send('Main page');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
