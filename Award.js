const fs = require('fs');
const md5 = require('js-md5');

let request = require('async-request'),
	response;
	
function toWei(amount) {
	return web3._extend.utils.toWei(amount, 'ether')
}

function fromWei(amount) {
	return web3._extend.utils.fromWei(amount, 'ether')
}

const real_world_number = 2;

module.exports = async() => {
	let all_transactions = [];

	let url = 'http://api.etherscan.io/api?module=account&action=tokentx&address=0x1d29d34686f3d26816816170c65b436dc011d3ff&startblock=0&endblock=999999999&sort=asc&apikey=YourApiKeyToken';
	response = await request(url);
	let all_buys = JSON.parse(response.body);
	for (let k = 0; k < all_buys.result.length; k++){
		if (all_buys.result[k].from=='0x0000000000000000000000000000000000000000'){
			continue;
		}
		if (parseInt(fromWei(all_buys.result[k].value))>50){
			all_buys.result[k].ticket = md5(""+(parseInt(all_buys.result[k].hash.substr(all_buys.result[k].hash.length-8,8),16)+real_world_number));
			console.log(all_buys.result[k].hash,all_buys.result[k].hash.substr(all_buys.result[k].hash.length-8,8),parseInt(all_buys.result[k].hash.substr(all_buys.result[k].hash.length-8,8),16),md5(""+(parseInt(all_buys.result[k].hash.substr(all_buys.result[k].hash.length-8,8),16)+real_world_number)));
			all_buys.result[k].realvalue = parseInt(fromWei(all_buys.result[k].value));

			all_transactions.push(all_buys.result[k]);
		}
		
	}

	url = 'http://api.etherscan.io/api?module=account&action=tokentx&address=0x64396f0e37d523e8ff32e1eb02dd7dded84cd34f&startblock=0&endblock=999999999&sort=asc&apikey=YourApiKeyToken';
	response = await request(url);
	all_buys = JSON.parse(response.body);
	for (let k = 0; k < all_buys.result.length; k++){
		if (all_buys.result[k].from=='0x0000000000000000000000000000000000000000'){
			continue;
		}
		if (all_buys.result[k].hash=='0x838ac86eaf77437fb559abf93a6412b84bb0d01d9b3eb5577c498927c0e27f08'){
			continue;
		}
		if (parseInt(fromWei(all_buys.result[k].value))>50){
			all_buys.result[k].ticket = md5(""+(parseInt(all_buys.result[k].hash.substr(all_buys.result[k].hash.length-8,8),16)+real_world_number));
			console.log(all_buys.result[k].hash,all_buys.result[k].hash.substr(all_buys.result[k].hash.length-8,8),parseInt(all_buys.result[k].hash.substr(all_buys.result[k].hash.length-8,8),16),md5(""+(parseInt(all_buys.result[k].hash.substr(all_buys.result[k].hash.length-8,8),16)+real_world_number)));
			all_buys.result[k].realvalue = parseInt(fromWei(all_buys.result[k].value));

			all_transactions.push(all_buys.result[k]);
		}
	}

	let all_transactions_count = all_transactions.length;
	let winners_1 = Math.ceil(all_transactions_count*0.02);
	let winners_2 = Math.ceil(all_transactions_count*0.25);
	let winners_3 = all_transactions_count - winners_1 - winners_2;

	console.log('all_transactions_count',all_transactions_count);
	console.log('winners_1',winners_1);
	console.log('winners_2',winners_2);
	console.log('winners_3',winners_3);

	all_transactions.sort(function (a, b) {
		return parseInt(a.ticket,16) - parseInt(b.ticket,16);
	});

	for (var i = 0; i<=all_transactions.length - 1; i++) {
		let result_t = {hash:all_transactions[i].hash,address:all_transactions[i].to,ticket:all_transactions[i].ticket,realvalue:all_transactions[i].realvalue};

		if (i<winners_1){
			result_t.awardLevel = 1;
		} else if (i<winners_1+winners_2){
			result_t.awardLevel = 2;
		} else {
			result_t.awardLevel = 3;
		}

		console.log(result_t);
	}
}
