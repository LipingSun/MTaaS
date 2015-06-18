var pkgcloud = require('pkgcloud');
_ = require('underscore');
var client = pkgcloud.compute.createClient({
    provider: 'openstack', // required
    username: 'facebook100006758537716', // required
    password: 'lhzNAMoxN9WvaU2e', // required
    region: 'RegionOne',
    authUrl: 'http://8.21.28.222:5000' // required
  });
/*for (p in client)
	console.log(p+": "+client[p]);*/

client.getImages(function (err, images) {
    if (err) {
        console.dir(err);
        return;
    }

    client.getServers(function(err,servers){
    	if (err) {
		        console.dir(err);
	        	return;
	   	}
	 	
       for(var i=0;i<servers.length;i++){
			var server=servers[i];
			var tar_image = _.findWhere(images, { id: server.imageId});
			if(tar_image.id==server.imageId){
				
				
				console.log("Already have such server");
				//return;
				
			}
       }
       client.getFlavors(function (err, flavors) {
    	    if (err) {
    	        console.dir(err);
    	        return;
    	    }

    	    // then get our base images
    	    client.getImages(function (err, images) {
    	        if (err) {
    	            console.dir(err);
    	            return;
    	        }

    	        // Pick a 512MB instance flavor
    	        var flavor = _.findWhere(flavors, { name: 'm1.medium' });

    	        // Pick an image based on Ubuntu 12.04
    	        var image = _.findWhere(images, { name: 'HostVersionA' }); // Check if this version is correct

    	        // Create our first server
    	        client.createServer({
    	            name: 'serverTest',
    	            image: image,
    	            flavor: flavor
    	        }, handleServerResponse);
    	        
    	    });
       });
    });
});
       
function handleServerResponse(err, server) {
    if (err) {
        console.dir(err);
        return;
    }

    console.log('SERVER CREATED: ' + server.name + ', waiting for active status');

    // Wait for status: RUNNING on our server, and then callback
    server.setWait({ status: server.STATUS.running }, 10000, function (err) {
        if (err) {
            console.dir(err);
            return;
        }

        console.log('SERVER INFO');
        console.log(server.name);
        console.log(server.status);
        console.log(server.id);

        console.log('Make sure you DELETE server: ' + server.id +
            ' in order to not accrue billing charges');
    });
}			
			
				/*client.destroyServer(server, function (err, server) { 
					server.setWait({ status: server.STATUS.stopped }, 10000, function (err) {
				        if (err) {
				            console.dir(err);
				            return;
				        }

				        console.log('SERVER INFO');
				        console.log(server.name);
				        console.log(server.status);
				       

				        console.log(server.name +
				            'deleted');
				    });
				})
			}
       }
	 		//console.log(p+": "+servers[i][p]);*/


/*client.getImages(function (err, images) {
    if (err) {
        console.dir(err);
        return;
    }
    
    for(var i=0;i<images.length;i++){
		var image=images[i];
		console.log("image id: "+image.id+", image.name: "+image.name);
    }
    // Pick a 512MB instance flavor
   // var flavor = _.findWhere(flavors, { name: 'emuOK' });

    // Pick an image based on Ubuntu 12.04
    
    var tar_image = _.findWhere(images, { name: 'emuOk' });
    for(x in tar_image )
    console.log(x+": "+tar_image[x]);
 });


/*client.getFlavors(function (err, flavors) {
    if (err) {
        console.dir(err);
        return;
    }

    // then get our base images
    client.getImages(function (err, images) {
        if (err) {
            console.dir(err);
            return;
        }

        // Pick a 512MB instance flavor
        var flavor = _.findWhere(flavors, { name: 'm1.tiny' });

        // Pick an image based on Ubuntu 12.04
        var image = _.findWhere(images, { name: 'cirros-0.3.3-x86_64' }); // Check if this version is correct

        // Create our first server
        client.createServer({
            name: 'server1',
            image: image,
            flavor: flavor
        }, handleServerResponse);

        // Create our second server
        client.createServer({
            name: 'server2',
            image: image,
            flavor: flavor
        }, handleServerResponse);
    });
});

// This function will handle our server creation,
// as well as waiting for the server to come online after we've
// created it.
function handleServerResponse(err, server) {
    if (err) {
        console.dir(err);
        return;
    }

    console.log('SERVER CREATED: ' + server.name + ', waiting for active status');

    // Wait for status: RUNNING on our server, and then callback
    server.setWait({ status: server.STATUS.running }, 10000, function (err) {
        if (err) {
            console.dir(err);
            return;
        }

        console.log('SERVER INFO');
        console.log(server.name);
        console.log(server.status);
        console.log(server.id);

        console.log('Make sure you DELETE server: ' + server.id +
            ' in order to not accrue billing charges');
    });
    
}*/