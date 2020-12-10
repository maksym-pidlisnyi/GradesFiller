const express = require("express");
const app = express();
app.listen(8080);
app.set('view engine', 'twig')

const fs = require('fs');
const Twig = require('twig');

let grades = fs.readFileSync('grades.csv').toString().split('\r\n');
let arr = Array()
for (let i of grades) {
    arr.push(i.split(';'))
}
let tmp = arr.slice()
let arrSorted = tmp.sort( function (a, b){
    let aAvg = a.map(x=>+x).reduce((a, b) => a + b, 0) / a.length
    let bAvg = b.map(x=>+x).reduce((a, b) => a + b, 0) / b.length
    return bAvg < aAvg ?  1 // if b should come earlier, push a to end
        : bAvg > aAvg ? -1 // if b should come later, push a to begin;
        : 0;
})
for (let i of arrSorted) {
    i.push(i.map(x=>+x).reduce((a, b) => a + b, 0) / i.length)
}

Twig.twig({
    id: 'bodyIndex',
    data: fs.readFileSync('bodyIndex.twig').toString()
});

Twig.twig({
    id: 'grades',
    data: fs.readFileSync('grades.twig').toString()
});

let htmlIndex = Twig.twig({
    id: 'index',
    ref: 'bodyIndex',
    allowInlineIncludes: true,
    data: fs.readFileSync('index.twig').toString()
}).render({
    name: 'Main page'
});

let htmlGrades = Twig.twig({
    id: 'gradesPage',
    ref: 'grades',
    allowInlineIncludes: true,
    data: fs.readFileSync('index.twig').toString()
}).render({
    name: 'Grades page',
    arr: arr
});

let htmlGradesAsc = Twig.twig({
    id: 'gradesPageAsc',
    ref: 'grades',
    allowInlineIncludes: true,
    data: fs.readFileSync('index.twig').toString()
}).render({
    name: 'Grades asc page',
    arr: arrSorted
});

let htmlGradesDesc = Twig.twig({
    id: 'gradesPageDesc',
    ref: 'grades',
    allowInlineIncludes: true,
    data: fs.readFileSync('index.twig').toString()
}).render({
    name: 'Grades desc page',
    arr: arrSorted.reverse()
});

app.get('/', function (req, res) {
    res.write(htmlIndex)
})

app.get('/allGrades', function (req, res) {
    res.write(htmlGrades)
})

app.get('/sortAsc', function (req, res) {
    res.write(htmlGradesAsc)
})
app.get('/sortDesc', function (req, res) {
    res.write(htmlGradesDesc)
})

