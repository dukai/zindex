var UPYun = require('upyun').UPYun;

var yunClient = new UPYun('foto-sensors', 'dukai', 'shuanger');
yunClient.setApiDomain('v0.api.upyun.com');

var redis = require('redis'),
	redisClient = redis.createClient(6379, '192.168.0.46', {
		detect_buffers: true
	});

var popAndUploadOne = function(){
	redisClient.lpop('sensor_photos_queue', function(err, reply){
		if(!reply){
			setTimeout(popAndUploadOne, 2000);
			return;
		}

		console.log(reply);

		redisClient.get(new Buffer(reply), function(err, fotoReply){
			var fs = require('fs');
			var pieces = reply.split(":");
			var fileName = pieces[pieces.length - 1];
			fs.writeFile(fileName, fotoReply, function(err){
				popAndUploadOne();
			});


			yunClient.writeFile('/' + pieces[1] + "/" + pieces[2], fotoReply, true, function(err, result){
				console.log(err);
			});
		})
	});
};


popAndUploadOne();