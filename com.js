#!/usr/bin/env node
const { Command } = require('commander');
const fs = require('fs');
const path = require('path'); // Import the path module

const program = new Command();

program
    .command('create <modelName> <tableName>')
    .description('create modelName')
    .action((modelName, tableName) => {
        if (modelName && tableName) {
            createModel(modelName, tableName);
            createTable(tableName);
            createController(modelName);
        }
    });

program
    .command('createController <controllerName> ')
    .description('create controllerName')
    .action((controllerName) => {
        if (controllerName) {
            createControllerOnly(controllerName);
        }
    });

program.parse(process.argv);


function createModel(modelName, tableName) {
    let folderPath = path.join(__dirname, 'testing');
    let content = '';
    folderPath = path.join(__dirname, 'models');
    try {
        modelName = `${modelName.replace(new RegExp("model", 'gi'), '').trim()}Model`;
    } catch (error) { }
    content = `
const Model = require("../app/Model");

class ${modelName} extends Model {
    constructor() {
        super({ db_file_name: "${tableName}" });
    }
}

module.exports = new ${modelName}();
`;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    // Build the complete file path using the hardcoded folder path
    const filePath = path.join(folderPath, `${modelName}.js`);
    // Write the file to disk
    fs.writeFileSync(filePath, content);
    console.log(`created successfully ${filePath}`);
}

function createControllerOnly(controllerName) {
    let folderPath = path.join(__dirname, 'testing');
    let content = '';
    folderPath = path.join(__dirname, 'controllers');
    try {
        controllerName = `${controllerName.replace(new RegExp("model", 'gi'), '').trim()}Controller`;
    } catch (error) { }
    content = `

const Controller = require("../app/Controller");

class ${controllerName} extends Controller {
    async get(req, res) {
        
    }
}

module.exports = ${controllerName};
`;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    // Build the complete file path using the hardcoded folder path
    const filePath = path.join(folderPath, `${controllerName}.js`);
    // Write the file to disk
    fs.writeFileSync(filePath, content);
    console.log(`created successfully ${filePath}`);
}

function createController(controllerName) {
    let folderPath = path.join(__dirname, 'testing');
    let modelName = String(controllerName);
    let content = '';
    folderPath = path.join(__dirname, 'controllers');
    try {
        controllerName = `${controllerName.replace(new RegExp("model", 'gi'), '').trim()}Controller`;
    } catch (error) { }
    try {
        modelName = `${modelName.replace(new RegExp("model", 'gi'), '').trim()}Model`;
    } catch (error) { }
    content = `

const Controller = require("../app/Controller");
const ${modelName} = require("../models/${modelName}");

class ${controllerName} extends Controller {
    async get(req, res) {
        if (req.query.id) {
            let data = await ${modelName}.findOne({ id: req.query.id });
            return res.send({
                "status": "success",
                "code": "1",
                "data": data
            });
        }
        else{
            let data = await ${modelName}.lookup(req);
            return res.send({
                "status": "success",
                "code": "1",
                "data": data
            });
        }
    }

    async update(req, res) {
        if (!req.query.id || !req.body.data) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{id} and {data} fields are required"
            });
        }
        let data = await ${modelName}.updateOne(req.query.id, req.body.data);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }

    async create(req, res) {
        if (!req.body.data) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{data} is required"
            });
        }
        let data = await ${modelName}.save(req.body.data);
        if (data?._id) {
            return res.send({
                "status": "success",
                "code": "1",
                "data": data
            });
        }
        return res.send({
            "status": "success",
            "code": "2",
            "message": "error",
            "errors": data
        });
    }

    async delete(req, res) {
        if (!req.query.id) {
            return res.send({
                "status": "failed",
                "code": "2",
                "message": "{id} is required"
            });
        }
        let data = await ${modelName}.deleteOne(req.query.id);
        return res.send({
            "status": "success",
            "code": "1",
            "data": data
        });
    }
}

module.exports = ${controllerName};
`;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    // Build the complete file path using the hardcoded folder path
    const filePath = path.join(folderPath, `${controllerName}.js`);
    // Write the file to disk
    fs.writeFileSync(filePath, content);
    console.log(`created successfully ${filePath}`);
}

function createTable(tableName) {

    let folderPath = path.join(__dirname, 'testing');
    let content = '';
    folderPath = path.join(__dirname, 'databases');
    try {
        tableName = `${tableName.replace(new RegExp("_table", 'gi'), '').trim()}`;
    } catch (error) { }
    content = `
const { Schema } = require("mongoose");

class ${tableName}_table {
    model = "${tableName}";
    fields = {
        name: {
            type: String,
            default: null
        }
    };
}

module.exports = new ${tableName}_table;
`;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    // Build the complete file path using the hardcoded folder path
    const filePath = path.join(folderPath, `${tableName}_table.js`);
    // Write the file to disk
    fs.writeFileSync(filePath, content);
    console.log(`created successfully ${filePath}`);
}