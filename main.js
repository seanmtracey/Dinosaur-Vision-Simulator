var dino_vision = (function(){

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	const video = document.querySelector('video#source');
	var canvasOne = undefined;
	var canvasTwo = undefined;
	var canvasDiff = undefined;
	var diffClone = undefined;

	var ctxOne = undefined;
	var ctxTwo = undefined;
	var ctxDiff = undefined;
	var ctxClone = undefined;

	let WIDTH = undefined;
	let HEIGHT = undefined;

	const maxThreshold = 20;
	const minThreshold = -maxThreshold;

	const leftEyeHolder = document.body.querySelector('#left');
	const rightEyeHolder = document.body.querySelector('#right');

	const INTENSITY_DIVIDER = 4;
	let INTENSITIES = undefined;

	function calculateDiff(dOne, dTwo){
		// debugger;
		const diffImageData = ctxOne.createImageData(WIDTH, HEIGHT);
		let y = 0;
		const DATA_SIZE = diffImageData.data.length;

		while(y < DATA_SIZE){

			const delta = dOne[y] - dTwo[y];
			const normalisedOffset = y / 4;

			if(delta < minThreshold || delta > maxThreshold){
				diffImageData.data[y] = 255 / INTENSITIES[ normalisedOffset ];
				diffImageData.data[y + 1] = 0;
				diffImageData.data[y + 2] = 0;
				diffImageData.data[y + 3] = 255;

				if(INTENSITIES[ normalisedOffset ] > 1){
					INTENSITIES[ normalisedOffset ] -= 1;
				}
			} else {
				diffImageData.data[y] = diffImageData.data[y + 1] = diffImageData.data[y + 2] = 0;
				diffImageData.data[y + 3] = 255;

				if(INTENSITIES[ normalisedOffset ] < INTENSITY_DIVIDER){
					INTENSITIES[ normalisedOffset ] += 1;
				}

			}

			y += 4;

		}
		
		ctxDiff.putImageData(diffImageData, 0, 0);
		ctxClone.drawImage(canvasDiff, 0, 0);


	}

	function greyScale(imageData){

		let x = 0;
		const DATA_SIZE = imageData.data.length;

		while(x < DATA_SIZE){
			imageData.data[x] = imageData.data[x + 1] = imageData.data[x + 2] = (imageData.data[x] + imageData.data[x + 1] + imageData.data[x + 2]);
			x += 4;
		}

		return imageData;

	}

	function draw(){

		ctxTwo.drawImage(canvasOne, 0, 0);
		ctxOne.drawImage(video, 0, 0);

		var g = greyScale(ctxOne.getImageData(0, 0, WIDTH, HEIGHT));

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

					try{
						const vidURL = window.URL.createObjectURL(stream);
						video.src = vidURL;
					} catch(err){

						console.log('Unable to createObjectURL for stream. Setting srcObject to stream instead...');
						video.srcObject = stream;

					}

					setTimeout(function(){

						console.log('Video is playing', !video.paused);
						
						if(video.paused){
							video.play();
						}

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

						INTENSITIES = new Int8Array(WIDTH * HEIGHT).map(I => {return INTENSITY_DIVIDER});

						// debugger;

						ctxOne = canvasOne.getContext('2d');
						ctxTwo = canvasTwo.getContext('2d');
						ctxDiff = canvasDiff.getContext('2d');
						ctxClone = canvasClone.getContext('2d');

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
