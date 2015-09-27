var macAddresses = ["CC:3A:61:BD:6E:59","A4:B8:05:5F:F9:8A","78:4B:87:45:F2:3C", "E8:50:8B:D6:F6:D9", "7C:D1:C3:7F:A8:0E", "B4:B6:76:5D:2D:98"];
var connected = [];

var webdriver = require('selenium-webdriver'),
	By = require('selenium-webdriver').By,
	until = require('selenium-webdriver').until;


var driver;
var count = 0;
var run = function(callback) {
	if(count === 0){
		driver = new webdriver.Builder()
			.forBrowser('firefox')
			.build();
		count++;
	} else if(count === 20){
		count = 0;
	} else {
		count++;
	}


	driver.get('http://192.168.0.1');
	driver.wait(until.elementLocated((By.name('loginUsername'))), 2*1000).then(function(elm){
		elm.sendKeys('admin');
	});
	driver.findElement(By.name('loginPassword')).sendKeys('motorola');
	driver.findElement(By.xpath("//input[@type='submit']")).click();

	driver.get('http://192.168.0.1/wlanAccess.asp');

	driver.findElement(By.xpath("//*[@id='AutoNumber1']/tbody/tr[3]/td[2]/form/table[3]/tbody/tr[2]/td/table/tbody")).then(function(elDriver){
		elDriver.findElements(By.tagName("tr")).then(function(els){
			for(var i = 1; i < els.length; i++){
				var el = els[i];
				el.findElements(By.tagName("td")).then(function(macEl){
					macEl[3].getInnerHtml().then(function(ip){
						macEl[0].getInnerHtml().then(function(mac){
							if(ip === ""){
								connected.push("");
							} else {
								connected.push(mac);
							}
							if(connected.length === els.length - 1){
								done();
							}
						});
					});
				});
			}
		});
	});

	var found = [];
	var ret = [];
	var done = function(){
		for(var i = 0; i < connected.length; i++){
			for(var j = 0; j < macAddresses.length; j++){
				if(connected[i] === macAddresses[j]){
					found.push(connected[i]);
				}
			}
		}
		for(var i = 0; i < found.length; i++){
			if(found[i] === "CC:3A:61:BD:6E:59" || found[i] === "B4:B6:76:5D:2D:98"){ // Andy
				ret.push(0);
			} else if(found[i] === "A4:B8:05:5F:F9:8A" || found[i] === "7C:D1:C3:7F:A8:0E"){ // Taylor
				ret.push(1);
			} else if(found[i] === "78:4B:87:45:F2:3C"){ // Brent
				ret.push(2);
			} else if(found[i] === "E8:50:8B:D6:F6:D9"){ // Lucas
				ret.push(3);
			}
		}
		callback(ret);
		connected = [];
		found = [];
		ret = [];
	};
}

module.exports = run;