import {createToken, encodeCard} from "public/stripeAPI.js";
import {charge} from 'backend/stripeProxy';
var payment;
export function payNow(event) {
createToken(encodeCard(createCard()))
.then((token) => {
console.log("Card token: " + token);
charge(token, payment)
.then((chargeResponse) => {
console.log("Charge ID: " + chargeResponse.id);
});
});
}
​
Public Code:
​
import {fetch} from 'wix-fetch';
 
export async function createToken(card) {
//Go to stripe.com to create a test key and replace the one in the example
const apiKey = "YOUR_API_HERE";
 
const response = await fetch("https://api.stripe.com/v1/tokens", {
method: 'post',
headers: {
"Content-Type": "application/x-www-form-urlencoded",
"Authorization": "Bearer " + apiKey
},
body: card
});
 
if (response.status >= 200 && response.status < 300) {
const json = await response.json()
return json.id;
}
const responseText = await response.text();
console.log(responseText);
return response.status;
}
 
export function encodeCard(card){
let encoded = "";
for (let [k, v] of Object.entries(card)) {
encoded = encoded.concat("card[", k, "]=", encodeURI(v), "&");
}
return encoded.substr(0, encoded.length - 1);
}
​
Backend Code:
​
import {fetch} from 'wix-fetch';
 
export async function charge(token,payment) {
const cart = payment;
//Go to stripe.com to create a test key and replace th eone in the example
const apiKey = "YOUR_API_HERE";
 
const response = await fetch("https://api.stripe.com/v1/charges", {
method: 'post',
headers: {
"Content-Type": "application/x-www-form-urlencoded",
"Authorization": "Bearer " + apiKey
},
body: encodeBody(token, cart)
});
 
if (response.status >= 200 && response.status < 300) {
return await response.json();
}
return await response.text();
}
 
function encodeBody(token, cart){
let encoded = "";
for (let [k, v] of Object.entries(cart)) {
encoded = encoded.concat(k,"=", encodeURI(v), "&");
}
encoded = encoded.concat("source=", encodeURI(token));
return encoded;
}