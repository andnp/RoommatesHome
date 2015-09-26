var macAddresses = ["CC:3A:61:BD:6E:59","A4:B8:05:5F:F9:8A","78:4B:87:45:F2:3C", "E8:50:8B:D6:F6:D9"];
var connected = [];

var Emitter = require('events');
var emitter = new Emitter();
var webdriver = require('selenium-webdriver'),
	By = require('selenium-webdriver').By,
	until = require('selenium-webdriver').until;


var driver = new webdriver.Builder()
	.forBrowser('firefox')
	.build();

driver.get('http://192.168.0.1');
driver.findElement(By.name('loginUsername')).sendKeys('admin');
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
							emitter.emit('done');
						}
					});
				});
			});
		}
	});
});

var found = [];
emitter.on('done', function(){
	for(var i = 0; i < connected.length; i++){
		for(var j = 0; j < macAddresses.length; j++){
			if(connected[i] === macAddresses[j]){
				found.push(connected[i]);
			}
		}
	}
	console.log(found);
});