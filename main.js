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

	var maxThreshold = 20;
	var minThreshold = -maxThreshold;

	var leftEyeHolder = document.body.querySelector('#left');
	var rightEyeHolder = document.body.querySelector('#right');

	function calculateDiff(dOne, dTwo){

		// var diffImageData = ctxOne.getImageData(0, 0, canvasDiff.width, canvasDiff.height);
		var diffImageData = ctxOne.createImageData(canvasDiff.width, canvasDiff.height);
		var d = diffImageData.data;

		for(var y = 0; y < d.length; y += 4){
			var delta = dOne[y] - dTwo[y];

			if(delta < minThreshold || delta > maxThreshold){
				diffImageData.data[y] = 255;
				diffImageData.data[y + 1] = 0;
				diffImageData.data[y + 2] = 0;
				diffImageData.data[y + 3] = 255;
			} else {
				diffImageData.data[y] = 0;
				diffImageData.data[y + 1] = 0;
				diffImageData.data[y + 2] = 0;
				diffImageData.data[y + 3] = 255;
			}

		}
		
		ctxDiff.putImageData(diffImageData, 0, 0);
		ctxClone.putImageData(diffImageData, 0, 0);

	}

	function greyScale(imageData){

		var d = imageData.data;

		for(var x = 0; x < d.length; x += 4){

			var grey = d[x] + d[x + 1] + d[x + 2];

			d[x] = grey;
			d[x + 1] = grey;
			d[x + 2] = grey;

		}

		imageData.data = d;

		return imageData;

	}

	function draw(){

		ctxTwo.drawImage(canvasOne, 0, 0);
		ctxOne.drawImage(video, 0, 0);

		var g = greyScale(ctxOne.getImageData(0, 0, canvasOne.width, canvasOne.height));

		// console.log(g);

		ctxOne.putImageData(g, 0, 0);

		calculateDiff(ctxOne.getImageData(0,0,canvasOne.width, canvasOne.height).data, ctxTwo.getImageData(0,0,canvasOne.width, canvasOne.height).data);

		requestAnimationFrame(draw);

	}

	navigator.getUserMedia (
		{
			"video": {
				optional: [
					{minWidth: 320},
					// {minWidth: 640},
					// {minWidth: 1024},
					// {minWidth: 1280},
					// {minWidth: 1920},
					// {minWidth: 2560}
				]
			},
			audio: false
		}, function(stream){

			video.src = window.URL.createObjectURL(stream);
			video.play();

			setTimeout(function(){

				canvasOne = document.createElement('canvas');
				canvasTwo = document.createElement('canvas');
				canvasDiff = document.createElement('canvas');
				canvasClone = document.createElement('canvas');

				canvasOne.id = 'cone';
				canvasTwo.id = 'ctwo';
				canvasDiff.id = 'cdiff';
				canvasClone.id = 'cclone';

				canvasOne.width = canvasTwo.width = canvasDiff.width = canvasClone.width = video.offsetWidth;
				canvasOne.height = canvasTwo.height = canvasDiff.height = canvasClone.height = video.offsetHeight;

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


		}, function(err){
			console.log('Something went wrong', err);
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
