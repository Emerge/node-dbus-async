var dbus = require('../index.js');
var sessionBus = dbus.systemBus();
//sessionBus.connection.on('message', console.log);
var exampleIface = {
    name: 'org.bluez.Agent',
    methods: {
        Release: ['', ''],
        Authorize: ['os', 'd'],
        RequestPinCode: ['o', 's'],
        RequestPasskey: ['o', 'u'],
        DisplayPasskey: ['ou', ''],
        RequestConfirmation: ['ou', ''],
        ConfirmModeChange: ['s', ''],
        Cancel: ['', '']
    },
    signals: { },
    properties: { }
};


var example = {
    Release: console.log,
    Authorize:  function(path, arg) {
      console.log(arg);
      if(arg === "0000110d-0000-1000-8000-00805f9b34fb") {
		//Should raise new Error
	console.log("Incoming, Rejecting though");
	throw { name : "org.bluez.Error.Rejected", message:"Connection rejected by user" };
      }
    },
    RequestPinCode: console.log,
    RequestPasskey:  console.log,
    DisplayPasskey:  console.log,
    RequestConfirmation: function(path, arg){
	//pair later..
	return function(cb){
		setTimeout(function(){
			console.log("Now!");
			cb();
		}, 3000);
	};
    },
    ConfirmModeChange:  console.log,
    Cancel:  console.log
};

path = "/test/agent";
sessionBus.exportInterface(example, path, exampleIface);
sessionBus.getService('org.bluez').getInterface(
    '/',
    'org.bluez.Manager', function(err, dev) {
	dev.DefaultAdapter(function(err, d){
		sessionBus.getService('org.bluez').getInterface(d, "org.bluez.Adapter", function(err, a){
			a.RegisterAgent(path, "", console.log);
		});
	});
});
