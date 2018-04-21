import { lstat } from 'fs';

// Download NPMs
var mysql = require('mysql');
var inquirer = require('inquirer');

// Connect to SQL database using Socket
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon",
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"  
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
   ask(); 
});

var ask = function(){
   
   
   // request details from all available items to purchase from 
	connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
 // once they have this info, prompt what they would like to purchase
     inquirer.prompt([
         { 
             name: "choice", 
             type: "rawlist", 
             // function that provides list of items 
             choices: function() {
                 var choiceArray = [];
                 for (var i = 0; i < results.length; i++) {
                     choiceArray.push('Product: ' + results[i].product_name + '\t' + 'Department: ' + results[i].department_name 
                         + '\t' + 'Price: $'+ results[i].price + '\t' + 'Units Available: ' + results[i].stock_quantity);
                 }

                 return choiceArray; 
             }, 
             // asks what they would like to purchase. 
             message: "What item would you like to purchase?"
         }

     ]).then(function(answer){ 
         switch(answer.choice){
         }
         buyItem();
     })
 })
}


function buyItem(){ 
 inquirer.prompt([
 {
     name: "units", 
     type: "input", 
     message: "How many units would you like to buy?",
     validate: function(value){ 
         if (isNaN(value) === false){ 
             return true; 
         }
             return false; 
     }
 }
 ]).then(function(answer){ 
     deducts(3, 2);
     // console.log("this works");
 })	
}

function deducts(id, quantity){ 
 if (quantity > 0){ 
     connection.query('SELECT stock_quantity FROM products WHERE id', function(error, results){ 
         if (error) throw error; 
         if (results[0].stock_quantity >= quantity){ 
             console.log("Thanks for doing business with us!"); 
         } else { 
             console.log("Sorry, we dont have enough of those");
         }
         AskQuestion();
     })
 }
}

  connection.end();