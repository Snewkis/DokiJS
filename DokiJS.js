/**
 * DokiJS
 *
 * DokiJS is a Javascript documentation tool that generates API from comments of your javascript files, using a syntax similar to tools like Javadoc, Yuidoc and JsDoc.
 * 
 * @author Snewkis
 * @version 1.0.0
 */

/**
 * Minimist Module
 *
 * Get user arguments from command line.
 */
function hasKey(n,t){var o=n;return t.slice(0,-1).forEach(function(n){o=o[n]||{}}),t[t.length-1]in o}function isNumber(n){return"number"==typeof n||(!!/^0x[0-9a-f]+$/i.test(n)||/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(n))}
const minimist=(n,t)=>{t||(t={});var o={bools:{},strings:{},unknownFn:null};"function"==typeof t.unknown&&(o.unknownFn=t.unknown),"boolean"==typeof t.boolean&&t.boolean?o.allBools=!0:[].concat(t.boolean).filter(Boolean).forEach(function(n){o.bools[n]=!0});var e={};Object.keys(t.alias||{}).forEach(function(n){e[n]=[].concat(t.alias[n]),e[n].forEach(function(t){e[t]=[n].concat(e[n].filter(function(n){return t!==n}))})}),[].concat(t.string).filter(Boolean).forEach(function(n){o.strings[n]=!0,e[n]&&(o.strings[e[n]]=!0)});var s=t.default||{},i={_:[]};Object.keys(o.bools).forEach(function(n){a(n,void 0!==s[n]&&s[n])});var r=[];function a(n,t,s){if(!s||!o.unknownFn||(r=n,a=s,o.allBools&&/^--[^=]+$/.test(a)||o.strings[r]||o.bools[r]||e[r])||!1!==o.unknownFn(s)){var r,a,f=!o.strings[n]&&isNumber(t)?Number(t):t;l(i,n.split("."),f),(e[n]||[]).forEach(function(n){l(i,n.split("."),f)})}}function l(n,t,e){var s=n;t.slice(0,-1).forEach(function(n){void 0===s[n]&&(s[n]={}),s=s[n]});var i=t[t.length-1];void 0===s[i]||o.bools[i]||"boolean"==typeof s[i]?s[i]=e:Array.isArray(s[i])?s[i].push(e):s[i]=[s[i],e]}function f(n){return e[n].some(function(n){return o.bools[n]})}-1!==n.indexOf("--")&&(r=n.slice(n.indexOf("--")+1),n=n.slice(0,n.indexOf("--")));for(var c=0;c<n.length;c++){var u=n[c];if(/^--.+=/.test(u)){var b=u.match(/^--([^=]+)=([\s\S]*)$/),h=b[1],p=b[2];o.bools[h]&&(p="false"!==p),a(h,p,u)}else if(/^--no-.+/.test(u)){a(h=u.match(/^--no-(.+)/)[1],!1,u)}else if(/^--.+/.test(u)){h=u.match(/^--(.+)/)[1];void 0===(g=n[c+1])||/^-/.test(g)||o.bools[h]||o.allBools||e[h]&&f(h)?/^(true|false)$/.test(g)?(a(h,"true"===g,u),c++):a(h,!o.strings[h]||"",u):(a(h,g,u),c++)}else if(/^-[^-]+/.test(u)){for(var v=u.slice(1,-1).split(""),d=!1,k=0;k<v.length;k++){var g;if("-"!==(g=u.slice(k+2))){if(/[A-Za-z]/.test(v[k])&&/=/.test(g)){a(v[k],g.split("=")[1],u),d=!0;break}if(/[A-Za-z]/.test(v[k])&&/-?\d+(\.\d*)?(e-?\d+)?$/.test(g)){a(v[k],g,u),d=!0;break}if(v[k+1]&&v[k+1].match(/\W/)){a(v[k],u.slice(k+2),u),d=!0;break}a(v[k],!o.strings[v[k]]||"",u)}else a(v[k],g,u)}h=u.slice(-1)[0];d||"-"===h||(!n[c+1]||/^(-|--)[^-]/.test(n[c+1])||o.bools[h]||e[h]&&f(h)?n[c+1]&&/true|false/.test(n[c+1])?(a(h,"true"===n[c+1],u),c++):a(h,!o.strings[h]||"",u):(a(h,n[c+1],u),c++))}else if(o.unknownFn&&!1===o.unknownFn(u)||i._.push(o.strings._||!isNumber(u)?u:Number(u)),t.stopEarly){i._.push.apply(i._,n.slice(c+1));break}}return Object.keys(s).forEach(function(n){hasKey(i,n.split("."))||(l(i,n.split("."),s[n]),(e[n]||[]).forEach(function(t){l(i,t.split("."),s[n])}))}),t["--"]?(i["--"]=new Array,r.forEach(function(n){i["--"].push(n)})):r.forEach(function(n){i._.push(n)}),i};

/**
 * imports
 */
const fs = require("fs");
const path = require('path');
const glob = require("glob");
const commentParser = require("comment-parser");

/**
 * arguments enter by the user
 */
let args = minimist(process.argv.slice(2));
let fileParsed = [];

/**
 * Default arguments
 */
const defaultargs = {
	dir: "."
};

for (let el in defaultargs) {
	if (args[el] == undefined || args[el] == null || args[el] == "") {
		args[el] = defaultargs[el];
	}
}

/**
 * remove an element from an array
 */
function remove(array, element) {
	return array.filter(el => el !== element);
}

// fs.readFile("", 'utf8', function(err, contents) {
//     console.log(contents);
// });
 
let getDirectories = (src, callback) => {
	glob(src + '/**/*', callback);
};

getDirectories(args.dir, (err, res) => {
	if (err) {
		console.log("Error", err);
	} else {
		/**
		 * remove node modules
		 */
		res.forEach((el, i) => {
			if (el.startsWith("./node_modules")) {
				res = remove(res, el);
			}
		});

		/**
		 * remove non js file
		 */
		res.forEach((el, i) => {
			if (path.extname(el) !== ".js") {
				res = remove(res, el);
			}
		});

		/**
		 * read content
		 */
		function readFileDone(callback) { 
			res.forEach((el, i) => {
	
				fs.readFile(el, "utf8", (err, contents) => {
					
					/**
					 * comment-parser
					 * https://github.com/yavorskiy/comment-parser
					 *
					 * thanks to Sergiy Yavorsky, alias yavorskiy
					 */
					let parsed_content = commentParser(contents);
	
					let data = {
						parse: parsed_content
					}
					
					console.log(data);
					
					fileParsed.push(data);
        	    	
        	    	if (i == res.length-1) {
						callback();
        	    	}

				});
			});
		}

		/**
		 * start reading
		 */
		readFileDone(parsed_done);
	}
});

/**
 * when the parsing is done
 */
function parsed_done() {

	console.log(fileParsed);

}
