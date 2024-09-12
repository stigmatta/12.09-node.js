var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

var port = 8080;
var filePath = path.join(__dirname, 'products.txt'); 
var computers = [];

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    try {
        computers = JSON.parse(data);
    } catch (parseError) {
        console.error('Ошибка при парсинге JSON:', parseError);
    }
});

function findComputerByName(name) {
    return computers.find(computer => computer.name === name);
}

app.get('/name/:compName', function(request, response) {
    var computer = findComputerByName(request.params.compName);
    if (computer) {
        response.json(computer); 
    } else {
        response.status(404).send('Компьютер не найден'); 
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
