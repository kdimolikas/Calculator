/**
 * Constructs a Calculator that handles the contents of user input and the derived result 
 * @constructor
 * @param {Element} exprElement the element containing the operation to be evaluated  
 * @param {String} exprData the operation to be evaluated 
 * @param {Element} resElement the element containing the result of the evaluation
 * @param {String} resData the result of the evaluation
 */
function Calculator(exprElement, exprData, resElement, resData){
	
	this.expressionElement = exprElement;
	this.expressionData = exprData;
	this.resultElement = resElement;
	this.resultData = resData;
	this.isNewOperation = false;
	
	exprElement.addEventListener("change", this, false);
	resElement.addEventListener("change", this, false);
	
	this.exec = function(){
		
		if (typeof this.expressionData === 'undefined'){
			return 'Err:Unable to execute this operation.:('
		}
		
		return new Function('return ' + this.expressionData)();
	}; 
}

Calculator.prototype.handleEvent = function(event){
	switch(event.type){
		case "change":
			if (event.target.id === 'expr'){
				this.changeExpression(this.expressionElement.innerHTML);
			}else if (event.target.id === 'result'){
				this.changeResult(this.resultElement.innerHTML);
			}
			break;
		default:
			//Nothing
			break;
	}
};

Calculator.prototype.changeExpression = function(value){
	this.expressionData = value;
	this.expressionElement.innerHTML = value;
};

Calculator.prototype.changeResult = function(value){
	if (typeof value === 'undefined'){
		value = 0; 
	}
	this.resultData = value;
	this.resultElement.innerHTML = value;
};

/**
 *Statistics functions 
 @this {StatsFunctions}
 */
 function StatsFunctions(){
	
	/**
	 * Converts a string to an array of numbers
	 * @param {String} ds a string consisted of elements separated by comma
	 * @returns {Array<Number>} an array of numbers
	 */
	function parseDataset(ds){
		
		//regular expression for operations
		let re = /\d+[\*\/%\+-]{1}\d+/;
		var data = ds.split(',');
		
		data.forEach((value,index,arr) => {
			if (re.exec(value)){
				value = execOperation(value);
			}
			arr[index] = parseFloat(value);
		});
		
		return data;
	}
	
	/**
	 * Checks if the given condition satisfies a regular expression 
	 * @param {String} cnd represents a logical condition 
	 * @returns {Boolean} true if condition holds, false otherwise
	 */
	function isTrue(cnd){
		
		/**
		 * @constant operatorsHash each property defines a comparison between the 2 args 
		 */
		const operatorsHash = {
			'&gt':function(a,b){return a > b;},
			'>':function(a,b){return a > b;},
			'&lt':function(a,b){return a < b;},
			'<':function(a,b){return a < b;},
			'&gt=':function(a,b){return a >= b;},
			'>=':function(a,b){return a >= b;},
			'&lt=':function(a,b){return a <= b;},
			'<=':function(a,b){return a <= b;},
			'==':function(a,b){return a == b;},
			'!=':function(a,b){return a != b;}
		};

		//regular expression for comparison operators
		var re = /\d+|(&[lg][et]=?|!=|==|>=?|<=?){1}|\d+/g;
		var tokens = cnd.match(re);

		if (tokens === null){
			console.log('No match found');
			return false;
		}

		if (tokens.length !== 3){
			console.log('Err:invalid condition');
			return false;
		}
		
		var oper1 = parseFloat(tokens[0]);
		var oper2 = parseFloat(tokens[2]);
		var compOper = operatorsHash[tokens[1]];
		
		return compOper(oper1, oper2);
	}
	
	/**
	 * Loops through an array and checks if each element satisfies the condition
	 * @param {Array<String>} arr an array of elements
	 * @param {String} cond a string that represents a logical condition
	 * @returns {Array<String>} the elements of the given Array that satisfy the condition 
	 */
	function parseCondition(arr, cond){
		
		let res = [];
		
		arr.forEach(val => {
			let cnd = val + cond;
			let expr = isTrue(cnd);
			if (expr){
				res.push(val);
			}
		});
		
		return res;
	}
	
	/**
	 * Executes an operation
	 * @param {String} oper represents an operation 
	 * @returns {String} the result of an operation
	 */
	function execOperation(oper){
		return new Function('return ' + oper)();
	}
	
	/**
	 * Computes the sum of dataset's elements
	 * @param {String} dataset a string consisted of elements separated by comma character
	 * @returns {Number} the sum of dataset's elements
	 */
	this.getTotal = function(dataset){
		
		let tot = 0;
		let data = parseDataset(dataset);
		
		for (let i = 0; i < data.length; i++){
			tot += data[i];
		}
		
		return tot;
	};
	
	/**
	 * Computes the average value of dataset's elements
	 * @param {String} dataset a string consisted of elements separated by comma character
	 * @returns {Number} the average value
	 */
	this.getAverage = function(dataset){
		
		let tot = 0;
		let data = parseDataset(dataset);
		
		for (let i = 0; i < data.length; i++){
			tot += data[i];
		}
		
		return tot/data.length;
	};
	
	/**
	 * Computes the variance of dataset's elements
	 * @param {String} dataset a string consisted of elements separated by comma
	 * @returns {Number} the variance of the given elements
	 */
	this.getVariance = function(dataset){
		
		let sum = 0;
		let avg = this.getAverage(dataset);
		let data = parseDataset(dataset);
		
		for (let i = 0; i < data.length; i++){
			sum += (data[i] - avg) ** 2;
		} 
		
		return sum/data.length;
	};
	
	/**
	 * Computes the standard deviation of dataset's elements
	 * @param {String} dataset a string consisted of elements separated by comma character
	 * @returns {Number} the standard deviation of the given elements
	 */
	this.getStandDeviation = function(dataset){
		return Math.sqrt(this.getVariance(dataset));
	};
	
	/**
	 * Computes the number of dataset's elements 
	 * @param {String} dataset a string consisted of elements separated by comma character
	 * @returns {Number} the number of the given elements
	 */
	this.getCount = function(dataset){
		
		let data = parseDataset(dataset);
		
		return data.length;
	};
	
	/**
	 * Computes the median element within the given dataset
	 * @param {String} dataset a string consisted of elements separated by comma character
	 * @returns {Number} the median value
	 */
	this.getMedian = function(dataset){
		
		let data = parseDataset(dataset);
		data.sort(function(a,b){return a-b;});
		let medIndex = (data.length % 2 == 0) ? (data.length/2) - 1 : Math.round(data.length/2) - 1;
		
		return data[medIndex];
	};
	
	/**
	 * Computes the number of the elements that satisfy a condition
	 * @param {String} dataset a string consisted of elements separated by comma character
	 * @returns {Number} the number of elements satisfying a condition
	 */
	this.getCountIf = function(dataset){
		
		let params = dataset.split(';');

		if (params.length < 2){
			console.log('Err:invalid operation');
			return;
		}

		let data = params[0].split(',');
		let cond = params[1] + params[2];
		let matches = parseCondition(data, cond);

		return matches.length; 
	}
	
	/**
	 * Computes the occurences of each value in the dataset
	 * @param {String} dataset a string consisted of elements separated by comma character
	 * @returns {Object} an object with each item of the dataset and its frequency 
	 */
	this.getFrequency = function(dataset){
		
		let freq = {};
		let data = parseDataset(dataset);
		
		data.forEach(item => {
			if (!freq.hasOwnProperty(item)){
				freq[item] = 1;
			}else{
				freq[item] += 1;
			}
		});
		
		return JSON.stringify(freq);
	};
	
	/**
	 * Computes the k-largest value of the dataset
	 * @param {String} dataset a string consisted of elements separated by comma character
	 * @returns {Number} the k-largest value of the dataset
	 */
	this.getKLarge = function(dataset){
		
		let arg1 = dataset.split(';')[0];
		let index;
		
		try{
			index = parseFloat(dataset.split(';')[1]);
		}catch(err){
			console.log(err);
		};
		
		let data = parseDataset(arg1);
		data.sort(function(a,b){return a-b;});
		
		return data[index - 1];
	};
}

/**
 *Initializes Calculator object on page load and defines a set of events 
 */
 function init(){
	
	var calc = new Calculator(document.querySelector("#expr"), "", document.querySelector("#result"), "");
	var stats = new StatsFunctions();
		
	/**
	 *Event handler for math functions 
	 */
	function handleMButtonClick(event){
		calc.changeExpression("Math." + event.target.value + "(" + calc.expressionData + ")");
		calc.changeResult(calc.exec());
		calc.isNewOperation = true;
	}
	
	var mathBtns = document.querySelectorAll(".m-btn");
	mathBtns.forEach(function(btn){
		btn.addEventListener("click", handleMButtonClick, false);
	});
	
	/**
	 * Event handler for statistics functions
	 */
	function handleSButtonClick(event){
		switch(event.target.name){
			case "tot":
				calc.changeResult(stats.getTotal(calc.expressionData));
				calc.changeExpression(event.target.value + "("+calc.expressionData+")");
				break;
			case "avg":
				calc.changeResult(stats.getAverage(calc.expressionData));
				calc.changeExpression("Avg("+calc.expressionData+")");
				break;
			case "var":
				calc.changeResult(stats.getVariance(calc.expressionData));
				calc.changeExpression("Var("+calc.expressionData+")");
				break;
			case "stDev":
				calc.changeResult(stats.getStandDeviation(calc.expressionData));
				calc.changeExpression("StDev("+calc.expressionData+")");
				break;
			case "cnt":
				calc.changeResult(stats.getCount(calc.expressionData));
				calc.changeExpression("Count("+calc.expressionData+")");
				break;
			case "med":
				calc.changeResult(stats.getMedian(calc.expressionData));
				calc.changeExpression("Median("+calc.expressionData+")");
				break;
			case "cntIf":
				calc.changeResult(stats.getCountIf(calc.expressionData));
				calc.changeExpression("CountIf("+calc.expressionData+")");
				break;
			case "freq":
				calc.changeResult(stats.getFrequency(calc.expressionData));
				calc.changeExpression("Freq("+calc.expressionData+")");
				break;
			case "kLrg":
				calc.changeResult(stats.getKLarge(calc.expressionData));
				calc.changeExpression("k-Large("+calc.expressionData+")");
				break;
		}
		calc.isNewOperation = true;
	}
	
	var statsBtns = document.querySelectorAll(".s-btn");
	statsBtns.forEach(function(btn){
		btn.addEventListener("click", handleSButtonClick, false);
	});
	
	/**
	 * Copy data from src to trg
	 * @param {Element} src
	 * @param {Element} trg
	 */
	function copyData(src, trg){
		var source = document.getElementById(src);
		calc.changeExpression("");
		calc.changeResult("");
		document.getElementById(trg).innerHTML = source.value;
		calc.changeExpression(document.getElementById(trg).innerHTML);
	}
	
	document.querySelector('#custom-oper').oninput = function(){
		copyData(this.id, 'expr');
	}
	
	//Clear button onclick event
	document.querySelector("input[name='clear']").onclick = function(){
		calc.changeExpression("");
		calc.changeResult("");
		document.getElementById('custom-oper').value = '';
	};
	
	//Deletion button onclick event
	document.querySelector("input[name='del']").onclick = function(){
		calc.changeExpression(calc.expressionData.substr(0,calc.expressionData.length-1));
	};
	
	//Buttons of the main board
	var defaultBtns = document.querySelectorAll("input[type='button']" +
										 ":not([name='clear'])" +
										 ":not([name='del'])" +
										 ":not([name='equal'])" +
										 ":not([name='comma'])" +
										 ":not(.operators)" +
										 ":not(.m-btn)"+
										 ":not(.s-btn)");
	defaultBtns.forEach(function(item){	
		item.onclick = function(){
			let content;
			calc.isNewOperation = false;
			content = calc.expressionData + item.value;
			calc.changeExpression(content);
		};
		
	});
	
	/**
	 * Parses a file and returns a summary for the function used
	 * @param {Element} target the element that triggers doc parsing 
	 * @param {Element} metadataDoc the doc that is parsed 
	 * @returns {string} a summary of the functionality related to the target element
	 */
	function getMetadata(target, metadataDoc){
		
		var noDesc = 'No description available';
		var txt; 
		var buttons = metadataDoc.getElementsByTagName("buttons");
		var btnList;
		var nodes;

		for (let i = 0; i < buttons.length; i++){
			let attrs = buttons[i].attributes;
			if (attrs.getNamedItem("category").nodeValue === target.className){
				btnList = buttons[i].childNodes;
				break;
			}
		}
		
		if (btnList == null){
			console.log("Err:no nodes of the given category");
			return noDesc;
		}

		var btnNode = btnList[0];
		for (let j = 0; j < btnList.length; j++){
			if (btnNode.nodeType == 1){
				let trgAttrs = target.attributes;
				if (btnNode.getAttribute("name") === trgAttrs.getNamedItem("name").nodeValue){
					nodes = btnNode.childNodes;
					break;
				}
			}
			btnNode = btnNode.nextSibling;
		}
		
		if (nodes == null){
			console.log("Err:no nodes available with the given name");
			return noDesc;
		}

		var childNode = nodes[0];
		txt = '';
		for (let i = 0; i < nodes.length; i++){
			if (childNode.nodeType == 1){
				txt += "<b>" + childNode.nodeName + "</b>" + "<br/>" + childNode.childNodes[0].nodeValue + "<br/>";
			}
			childNode = childNode.nextSibling;
		}
		
		return txt;
	}
	
	/**
	 * Sends an XMLHTTP request to parse metadata.xml file
	 * @param {Element} target the element that triggers doc parsing 
	 */
	function loadMetadataDoc(target){
	
		var xhttp = new XMLHttpRequest();
		
		/**
		 * @this {XMLHttpRequest}
		 */
		xhttp.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				var metadataDoc = this.responseXML;
				var tooltip = document.querySelector("#tooltip");
				var tooltipText = getMetadata(target, metadataDoc);
				tooltip.innerHTML = tooltipText;
				tooltip.style.display = "block";

			}
		};
		
		/**
		 * @this {XMLHttpRequest}
		 */
		xhttp.onerror = function(){
			if (this.status == 0){
				console.log("Network error");
			}
		};
		
		xhttp.open("GET", "metadata.xml", true);
		xhttp.send();
	}
	
	/**
	 * Handles mouse over event
	 * @param {Event} event 
	 */
	function handleMouseOver(event){
		
		var target = event.target;
		var tooltip = document.querySelector("#tooltip");
		var rect = target.getBoundingClientRect();
		
		if (target.className === 'm-btn' || target.className === 's-btn'){
			loadMetadataDoc(target);
			tooltip.style.top = (rect.top - 110) + 'px';
			tooltip.style.left = (rect.left + 60) + 'px';
			target.style.fontWeight = 'bold';
			target.style.fontSize = '1em';
		}
			
		if (target.name !== 'del' && target.name !== 'clear'){
			target.style.backgroundColor = 'lightgrey';
		}
	}
	
	/**
	 * Handles mouse out event
	 * @param {Event} event 
	 */
	function handleMouseOut(event){
		var target = event.target;
		var tooltip = document.querySelector("#tooltip");
		if (target.className === 'm-btn' || target.className === 's-btn'){
			tooltip.style.bottom = 0;
			tooltip.style.left = 0;
			tooltip.style.display = "none";
		}
		if (target.name !== 'del' && target.name !== 'clear'){
			target.style.backgroundColor = 'buttonface';
		}
		target.style.fontWeight = 'normal';
		target.style.fontSize = '.9em';
	}
	
	var allButtons = document.querySelectorAll("input[type='button']");
	allButtons.forEach(function(btn){
		btn.addEventListener("mouseover", handleMouseOver, false);
		btn.addEventListener("mouseout", handleMouseOut, false);
	});
		
	var operators = document.querySelectorAll(".operators, input[name='comma']");
	operators.forEach(function(item){
		item.onclick = function(){
			
			let oldContent = calc.expressionData;
			let newContent;
	
			if (calc.isNewOperation){
				newContent = calc.resultData + item.value;	
			}else{
				newContent = oldContent + item.value;
			}
			calc.changeExpression(newContent);
		};
	});
	
	document.querySelector("input[name='equal']").onclick = function(){
		calc.changeResult(calc.exec());
		calc.isNewOperation = true;
	};
	
	var menuBtns = document.querySelectorAll(".menu-btns");
	menuBtns.forEach(function(item){
		item.onclick = function(e){
			var board;
			
			switch(e.target.id){
				case "math-btn":
					board = document.getElementById("math-board");
					break;
				case "stats-btn":
					board = document.getElementById("stats-board");
					break;
			}
			
			if(board.style.display === "none"){
				board.style.display = "inline-block";
				e.target.innerHTML = "Hide " + e.target.innerHTML.substr(5, e.target.innerHTML.length); 
			}else{
				board.style.display = "none";
				e.target.innerHTML = "Show " + e.target.innerHTML.substr(5, e.target.innerHTML.length); 
			}
		};
	});
	
	document.getElementById("menu-btn").onclick = function(){
		var mBtn = document.getElementById("advanced-fts");
		if(mBtn.style.display === "none"){
			mBtn.style.display = "block";
		}else{
			mBtn.style.display = "none";
		}
	};
}