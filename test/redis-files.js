var UPYun = require('upyun').UPYun;

var yunClient = new UPYun('foto-sensors', 'dukai', 'shuanger');
yunClient.setApiDomain('v0.api.upyun.com');

var redis = require('redis'),
	redisClient = redis.createClient(6379, 'yeedev', {
		detect_buffers: true
	});

var popAndUploadOne = function(){
	redisClient.lpop('sensor_photos_queue', function(err, reply){
		if(!reply){
			setTimeout(popAndUploadOne, 2000);
			return;
		}

		console.log("begin upload " + reply);

		redisClient.get(new Buffer(reply), function(err, fotoReply){
			var fs = require('fs');
			var pieces = reply.split(":");
			var fileName = pieces[pieces.length - 1];
			/*
			fs.writeFile(fileName, fotoReply, function(err){

			});
			*/
			yunClient.writeFile('/' + pieces[1] + "/" + pieces[2], fotoReply, true, function(err, result){
				err && console.log(err);
				console.log("success upload " + reply);
				popAndUploadOne();
			});
		})
	});
};


popAndUploadOne();

var popAndDeleteOne = function(){
	redisClient.lpop('sensor_photos_delete_queue', function(err, reply){
		if(!reply){
			setTimeout(popAndDeleteOne, 2000);
			return;
		}

		console.log("begin delete " + reply);
		var pieces = reply.split(":");
		var fileName = pieces[pieces.length - 1];
		yunClient.deleteFile('/' + pieces[1] + "/" + pieces[2], function(err, result){
			err && console.log(err);
			console.log("success delete " + reply);
			popAndDeleteOne();
		});
	});
}

popAndDeleteOne();