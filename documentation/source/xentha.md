# User

## Registration and login

### **POST** /user
Register a new user

POST parameters:

-	`string` username
-	`string` firstname
-	`string` lastname
-	`string` password

JSON response:  
`object` user: {

-	`string` name
-	`string` firstname
-	`string` lastname  
}


### **POST** /user/login
Register a new user

POST parameters:

-	`string` username
-	`string` password

JSON response:  
`object` user: {

-	`string` name
-	`string` firstname
-	`string` lastname  
}

## Games


### **POST** /game
Create a new game

POST parameters:  

-	`string` name

JSON response:  
`object` game: {
-	`string` name
-	`string` apiKey  
}

### **GET** /game
Get all games

POST parameters:

-	`string` name

JSON response:  
`object` games: [{

-	`string` name  
}]
