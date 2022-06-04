// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { readFileSync, readdirSync, mkdirSync, writeFileSync } = require('fs');
const vscode = require('vscode');
var extensionPath = "";



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	loadInputs();
	
	let disposable = vscode.commands.registerCommand('script-generator-fivem.generate-script', function (uri) {
		loadInputs(uri.fsPath)
	});
	extensionPath = context.extensionPath + "/template"
	
	
	context.subscriptions.push(disposable);
}
	
function deactivate() {}


var InputData = {
	scriptName : {
		title : "Nom du script",
		placeholder : "7Admin ...",
		nextInput : "description",
		value : "",
		input : null
	},
	description : {
		title : "Description du script",
		placeholder : "Menu admin ...",
		nextInput : "",
		value : "",
		input : null
	}
}

var startInput = "scriptName"


function loadInputs(script) {

	for (const key in InputData) {

		InputData[key].input = vscode.window.createInputBox();
		
		InputData[key].input.title = InputData[key].title;
		InputData[key].input.placeholder = InputData[key].placeholder;
	
		InputData[key].input.onDidAccept(function() {
			if (InputData[key].input.value.trim().length > 0) {
				InputData[key].value = InputData[key].input.value

				InputData[key].input.hide()

				if (InputData[key].nextInput != "") {
					InputData[InputData[key].nextInput].input.show()
				} else {
					startProcessing(script)
				}

		
			} else {
				vscode.window.showErrorMessage(`Tu n'a pas rempli: (${InputData[key].title}).`)
			}

		})
	
		if (startInput == key) {
			InputData[key].input.show();
		}

	}
	
	
}


function startProcessing(url) {
	var folder = getGeneratedFolder("");

	
	mkdirSync(`${url}/${InputData.scriptName.value}`)
	writeFolder(`${url}/${InputData.scriptName.value}`, folder);

	vscode.window.showInformationMessage(`Tu a crée le script '${InputData.scriptName.value}'.`)
}

function Folder(url) {
	var folder = {
		url : url,
		files : {},
		folders : {}
	}

	return folder
}


function getGeneratedFolder(url) {
	var folder = Folder(url)

	var files = readdirSync(extensionPath + url, { withFileTypes: true, encoding : 'utf-8' });

		
	for (const file of files) {
		if (file.isDirectory()) {
			folder.folders[file.name] = getGeneratedFolder(`${url}/${file.name}`)
		} else {
			folder.files[file.name] = readFileSync(`${extensionPath + url}/${file.name}`, {encoding : 'utf-8'})
			
			for (const key in InputData) {
				folder.files[file.name] = folder.files[file.name].replace("${" + key + "}", InputData[key].value)
			}
		}
	}

	return folder;
}



function writeFolder(url, folder) {

	url = url

	for (const key in folder.files) {
		writeFileSync(url + "/"+ key, folder.files[key], {encoding : 'utf-8'});
	}


	for (const key in folder.folders) {
		var fold = folder.folders[key]
		mkdirSync(url  + "/" + folder.url + fold.url)

		writeFolder(url  + "/" + folder.url + fold.url, fold)
	}

}







module.exports = {
	activate,
	deactivate
}