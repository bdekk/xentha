# Consumer Calls

## Registration and login

### **POST** /consumer/register
Tries to register a new consumer.

POST parameters:

-	`string` email
-	`string` password
-	`string` name
-	`string` address
-	`string` postal
-	`string` city
-	`string` phonenr
-	bool gender _A string containing "male" or "female"_
-	`string` dateOfBirth _In the format yyyy-mm-dd e.g. 1984-01-21_
-	`string` deviceToken _The Iphone device token used to send push notifications to the device. Note: can be NULL_
-	`string` size _optional_
-	`string` imageUrl _optional The url of the users profile picture. Note: can be NULL_

JSON response:
{

-	`boolean` success
	-	`integer` id

}

### **POST** /consumer/login
Tries to login a user.

POST parameters:

-	`string` email
-	`string` password

JSON response:
{

-	`boolean` success
-	`string` token
-	`integer` id
-	`object` consumer {
	-	`string` password
	-	`string` email
	-	`string` dateOfBirth _In the format of `yyyy-mm-dd`_
	-	`string` name
	-	`string` address
	-	`string` postal
	-	`string` phonenr
	-	`string` city
	-	`string` gender _A `string` containing "male" or "female"_
	-	`integer` id
	-	`string` deviceToken _The Iphone device token used to send pushnotifications to the device. Note: can be NULL_
	-	`string` imageUrl _The URL of the users profile picture. Note: can be NULL_
	-	`string` size
	-	`array` savedOffers [
		-	"`integer` id"
	-	]
	-	`array` followedRetailers [
		-	"`integer` id"
	-	]

}


### **POST** /consumer/profile/edit  <span class="label label-info">new</span>
Edit the card id of a card.

GET parameters:

-	`string` token consumer token

POST parameters:

-	`string` address new address
- `string` city new city
- `string` postal new postal
- `string` phonenr new phonenr

JSON response:
{

-	`boolean` success
-	`integer` id _The `integer`ernal id of the consumer that was just edited._

}

## Qlever-cards

### **POST** /consumer/cards/add
Adds a new card to the consumer.

The same card number cannot be reused for the combination of retailer and consumer.

GET parameters:

-	`string` token

POST parameters:

-	`integer` retailerId
-	`string` cardId The cardnumber as used by the retailer (shop)
- `boolean` favorite Is this a favorited card?
- `string` note A note for the card.

JSON response:
{

-	`boolean` success
-	`integer` id _The `integer`ernal id of the card that was just created._

}

### **GET** /consumer/cards/:retailerId/:cardId/points
Retrieves the pointss of the given card. Note: The `cardId` is the number on the card, in the api named `cardId` and not the internal card id field called `id`!

GET parameters:

-	`string` token

JSON response:
{

-	`boolean` success
-	`double` points

}

### **GET** /consumer/cards/list <span class="label label-info">updated</span>
Lists all the cards added by the consumer.

GET parameters:

-	`string` token

JSON response:
{

-	`boolean` success
-	`array` cards [ {
	-	`integer` id
	-	`integer` consumerId
	-	`integer` retailerId
	-	`string` cardId
	-	`double` points
  - `boolean` favorite
  - `string` note A note for the card.
	-	`string` dateAdded _In the format of `yyyy-mm-dd hh:mm:ss`_
	-	`string` retailerName
	-	`string` retailerColor _Hex color starting with # example: #00FF00_
	-	`integer` retailerLogoMainId
	-	`integer` retailerLogoWhite
-	} ]
}

### **DELETE** /consumer/cards/{id}
Removes  the card with `id` from the database. This is not the `card_id` field!

GET parameters:

-	`string` token

JSON response:
{

-	`boolean` success

}

### **POST** /consumer/cards/{id}  <span class="label label-info">updated</span>
Update the information on a card with `id` from the database. This is not the `card_id` field!

GET parameters:

-	`string` token

POST parameters:

-	`string` cardId The new number of the card (not the id)
- `boolean` favorite Favorite of card by the customer.
- `string` note A note for the card.

JSON response:
{

-	`boolean` success
-	`integer` id _The id of the card that was just updated._

}


## Non-Qlever cards

### **POST** /consumer/cards/nonqlever/add <span class="label label-warning">deprecated</span>
<div class="alert alert-warning" role="alert">
#### Deprecated routine
This call is not used anymore and will likely disappear in future versions.
</div>

Adds a new card to the consumer.

#### GET parameters

| Parameter      | Type            | Description |
| :------------- | :-------------- | :------------- |
| **token**      | `string`        | Valid authentication token |


#### POST parameters

| Parameter      | Type            | Description |
| :------------- | :-------------- | :------------- |
| **retailerId** | `integer`       | Id of the retailer for which a card should be added
| **cardId**     | `string`        | The number on the card that should be added

#### JSON response:
```json
{
  "success": true,
  "id": 11869
}
```

