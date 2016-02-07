/// <reference path="../typings/tsd.d.ts"/>

import generator = require("./sequelize-auto-ts");
import schema = require("./schema");
import fs = require("fs");
import path = require("path");
import _ = require("lodash");
var prompt = require("prompt");

console.log("sequelize-auto-ts");
console.log("");
console.log("Automatically generate sequelize definition statements and TypeScript types for your database.")
console.log("");

if (process.argv.length > 2)
{
    processFromCommandLines();
}
else
{
    processFromPrompt();
}

function processFromCommandLines()
{
    var args:string[] = process.argv.slice(2);
    var modelFactory:boolean = false;

    var i = args.indexOf('-mf');
    if (i !== -1) {
        modelFactory = true;
        args.splice(i, 1);
    }

    // Should match "--excludeTables=[thing,bob,and]"
    var excludeTablesRegex = '^--excludeTables\=\\[((?:\\w+)(?:,\\w+)*)?\\]';
    var excludeTablesIndex = _.findIndex(args, (arg:string) => arg.match(excludeTablesRegex));
    if(excludeTablesIndex !== -1) {
        var excludeTablesStr = args[excludeTablesIndex].match(excludeTablesRegex)[1];
    }
    var excludeTables:string[] = excludeTablesStr ? excludeTablesStr.split(',') : [];

    var allOptions: schema.GenerateOptions = {
        database: args[0],
        username: args[1],
        password: args[2],
        targetDirectory: args[3],
        options: {},
        schemaOptions: {
            excludeTables,
            naming: {
                defaults: {
                    caseType: 'pascal'
                },
                associationName: {
                    tail: null,
                    caseType: 'snake',
                },
                methodName: {
                    caseType: 'camel'
                },
                getterName: {
                    caseType: 'camel'
                },
            }
        }
    };
    if(args.length===1) allOptions = loadSettings(args[0]);

    if (!args.length || (!allOptions && args.length < 4)) {
        showHelp();
        process.exit(1);
    }
    allOptions.modelFactory = modelFactory;

    generate(allOptions);
}

function loadSettings(filePath:string)
{
    var json:any = loadJSON(filePath);
    if (!json) {
        var fileName:string = path.basename(filePath);
        json = loadJSON(fileName);
        if (!json) {
            json = loadFileFromParentDir(fileName);
        }
    }
    return json;
}
function loadFileFromParentDir(filePath:string, limit:number = 10) {
    if (!limit) return;
    limit--;
    filePath = '../' + filePath;
    var raw:any = loadJSON(filePath);
    if (!raw) {
        raw = loadFileFromParentDir(filePath, limit);
    }
    return raw;
}
function loadJSON(jsonPath:string) {
    try {
        var raw:any = fs.readFileSync(jsonPath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return;
    }
}

function processFromPrompt()
{
    var schema = {
        properties: {
            database: { description: "Database name", required: true },
            username: { description: "Username", required: true },
            password: { description: "Password", required: false, hidden: true },
            targetDirectory: { description: "Target directory", required: true }
        }
    };

    prompt.start();

    prompt.get(schema, function(err, result)
    {
        result.options = null;
        generate(<schema.GenerateOptions>result);
    })
}

function generate(options:schema.GenerateOptions):void
{
    console.log("Database : " + options.database);
    console.log("Username : " + options.username);
    console.log("Password : <hidden>");
    console.log("Target   : " + options.targetDirectory);
    console.log("Excluding: " + options.schemaOptions.excludeTables.join(','));
    console.log("");

    if (!fs.existsSync(options.targetDirectory))
    {
        showHelp();
        throw Error("Target directory does not exist: " + options.targetDirectory);
    }

    generator.generate(options, function(err)
    {
        if (err)
        {
            throw err;
        }
    });
}

function showHelp():void
{
    console.log("");
    console.log("Option 1: Command line arguments");
    console.log("");
    console.log("    sequelize-auto-ts settingsFile");
    console.log("");
    console.log("            settingsFile    - The path of the file for settings");
    console.log("");
    console.log("    or");
    console.log("");
    console.log("    sequelize-auto-ts database username password targetDirectory");
    console.log("");
    console.log("            database        - The name of the local database to generate typings/definitions from");
    console.log("            username        - database user with access to read from database");
    console.log("            password        - password for user");
    console.log("            targetDirectory - The directory where generated files should be placed");
    console.log("            excludeTables   - comma seperated list of tables to exclude, for example: `--excludeTables=[SequelizeMeta]`");
    console.log("            mf              - If given, option `-mf` causes sequelize-model-factory to be used as a template instead of sequelize-model which means [TODO]");
    console.log("");
    console.log("Option 2: Interactive");
    console.log("");
    console.log("    sequelize-auto-ts");
    console.log("");
    console.log("            This will launch in interactive mode where user will be prompted for all required inputs.");
    console.log("");
}
