var dino_vision = (function(){

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var video = document.querySelector('video#source');
	var canvasOne = undefined;
	var canvasTwo = undefined;
	var canvasDiff = undefined;
	var diffClone = undefined;

	var ctxOne = undefined;
	var ctxTwo = undefined;
	var ctxDiff = undefined;
	var ctxClone = undefined;

	var WIDTH = undefined;
	var HEIGHT = undefined;

	var maxThreshold = 20;
	var minThreshold = -maxThreshold;

	var leftEyeHolder = document.body.querySelector('#left');
	var rightEyeHolder = document.body.querySelector('#right');

	function calculateDiff(dOne, dTwo){

		var diffImageData = ctxOne.createImageData(WIDTH, HEIGHT);

		for(var y = 0; y < diffImageData.data.length; y += 4){
			var delta = dOne[y] - dTwo[y];

			if(delta < minThreshold || delta > maxThreshold){
				diffImageData.data[y] = 255;
				diffImageData.data[y + 1] = 0;
				diffImageData.data[y + 2] = 0;
				diffImageData.data[y + 3] = 255;
			} else {
				diffImageData.data[y] = diffImageData.data[y + 1] = diffImageData.data[y + 2] = 0;
				diffImageData.data[y + 3] = 255;
			}

		}
		
		ctxDiff.putImageData(diffImageData, 0, 0);
		// ctxClone.putImageData(diffImageData, 0, 0);
		ctxClone.drawImage(canvasDiff, 0, 0);

	}

	function greyScale(imageData){

		for(var x = 0; x < imageData.data.length; x += 4){
			imageData.data[x] = imageData.data[x + 1] = imageData.data[x + 2] = (imageData.data[x] + imageData.data[x + 1] + imageData.data[x + 2]);
		}

		return imageData;

	}

	function draw(){

		ctxTwo.drawImage(canvasOne, 0, 0);
		ctxOne.drawImage(video, 0, 0);

		var g = greyScale(ctxOne.getImageData(0, 0, WIDTH, HEIGHT));

		// console.log(g);

		ctxOne.putImageData(g, 0, 0);

		calculateDiff(ctxOne.getImageData(0,0,WIDTH, HEIGHT).data, ctxTwo.getImageData(0,0,WIDTH, HEIGHT).data);

		requestAnimationFrame(draw);

	}

	navigator.mediaDevices.enumerateDevices()
		.then( function(listOfDevices){
			
			var deviceID = undefined;

			listOfDevices.forEach(function(device){
				if(device.kind === 'videoinput' && (device.label.indexOf('back') > -1 || device.label.indexOf('rear')) ){
					deviceID = device.deviceId;
					return
				}
			});

			var constraints = { audio: false };

			if(deviceID !== undefined){
				constraints.video = { deviceId: { exact: deviceID } };
			} else {
				constraints.video = { facingMode: { exact: "environment" } };
			}

			// Possibly limit video size for speed.
			constraints.video.width = { max : 481 };

			navigator.mediaDevices.getUserMedia(constraints)
				.then(function(stream) {

					video.src = window.URL.createObjectURL(stream);

					setTimeout(function(){

						canvasOne = document.createElement('canvas');
						canvasTwo = document.createElement('canvas');
						canvasDiff = document.createElement('canvas');
						canvasClone = document.createElement('canvas');

						canvasOne.id = 'cone';
						canvasTwo.id = 'ctwo';
						canvasDiff.id = 'cdiff';
						canvasClone.id = 'cclone';

						WIDTH = canvasOne.width = canvasTwo.width = canvasDiff.width = canvasClone.width = video.offsetWidth;
						HEIGHT = canvasOne.height = canvasTwo.height = canvasDiff.height = canvasClone.height = video.offsetHeight;

						ctxOne = canvasOne.getContext('2d');
						ctxTwo = canvasTwo.getContext('2d');
						ctxDiff = canvasDiff.getContext('2d');
						ctxClone = canvasClone.getContext('2d');

						// ctxDiff.globalAlpha = ctxClone.globalAlpha = 0.1

						document.body.appendChild(canvasOne);
						document.body.appendChild(canvasTwo);
						leftEyeHolder.appendChild(canvasDiff);
						rightEyeHolder.appendChild(canvasClone);

						draw();

					}, 1000);

				})
			;

		})
	;

	window.addEventListener('click', function(key){

		if (document.body.requestFullscreen) {
				document.body.requestFullscreen();
		} else if (document.body.msRequestFullscreen) {
				document.body.msRequestFullscreen();
		} else if (document.body.mozRequestFullScreen) {
			document.body.mozRequestFullScreen();
		} else if (document.body.webkitRequestFullscreen) {
			document.body.webkitRequestFullscreen();
		}


	}, false);

})();
