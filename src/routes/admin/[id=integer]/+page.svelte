<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	export let data: PageData;

	const width = 320; // We will scale the photo width to this
	let height = 240; // This will be computed based on the input stream

	// phone 320x480
	// mac 640x480
	let streaming = false;

	let video: Element;
	let canvas: HTMLCanvasElement;
	let photo: Element;
	// let startbutton: Element;

	let pictureData: string;

	let videoWidth = 0;
	let videoHeight = 0;
	let canvasWidth = 240;
	let canvasHeight = 240;

	let selectedCamera = 0;
	let c;
	const constraints = {
		video: {
			width: {
				min: 300,
				ideal: 300,
				max: 1000
			},
			height: {
				min: 300,
				ideal: 300,
				max: 1000
			}
		},
		audio: false
	};

	const initVideo = () => {
		const updatedConstraints = {
			...constraints,
			deviceId: {
				exact: cameras[selectedCamera].id
			}
		};
		c = updatedConstraints;
		navigator.mediaDevices
			.getUserMedia(updatedConstraints)
			// .getUserMedia({ video: true, audio: false })
			.then((stream) => {
				video.srcObject = stream;
				video.play();
			})
			.catch((err) => {
				console.error(`An error occurred: ${err}`);
			});
	};
	const getCameraSelection = async () => {
		let res = '';
		const devices = await navigator.mediaDevices.enumerateDevices();
		const videoDevices = devices.filter((device) => device.kind === 'videoinput');
		let cam = 0;
		const cameras = videoDevices.map((videoDevice) => {
			console.log(videoDevice);
			cam++;
			return { label: videoDevice.label ?? 'cam_' + cam, id: videoDevice.deviceId };
		});
		return cameras;
	};

	let action = 'none';
	let cameras = '';
	onMount(async () => {
		cameras = await getCameraSelection();
		clearphoto();
		initVideo();
		video.addEventListener(
			'canplay',
			(ev) => {
				if (!streaming) {
					// height = (video.videoHeight / video.videoWidth) * width;
					videoWidth = video?.videoWidth;
					videoHeight = video?.videoHeight;
					video.setAttribute('width', width);
					video.setAttribute('height', height);

					canvas.setAttribute('width', canvasWidth);
					canvas.setAttribute('height', canvasHeight);
					// canvas.translate(canvasWidth, 0);
					// canvas.scale(-1, 1);
					streaming = true;
				}
			},
			false
		);
	});

	function takepicture() {
		const context = canvas.getContext('2d');
		if (videoWidth && videoHeight) {
			let sx, sy, sw, sh, dx, dy, dw, dh;
			if (videoWidth > videoHeight) {
				sx = (videoWidth - videoHeight) / 2;
				sy = 0;
				sw = videoHeight;
				sh = videoHeight;
				dx = 0;
				dy = 0;
				dw = canvasWidth;
				dh = canvasHeight;
			} else {
				sx = 0;
				sy = (videoHeight - videoWidth) / 2;
				sw = videoWidth;
				sh = videoWidth;
				dx = 0;
				dy = 0;
				dw = canvasWidth;
				dh = canvasHeight;
			}
			action = `context.drawImage(video, ${sx}, ${sy}, ${sw}, ${sh}, ${dx}, ${dy}, ${dw}, ${dh});`;
			context.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
			pictureData = canvas.toDataURL('image/jpeg');
			// console.log(pictureData);
			photo.setAttribute('src', pictureData);
		} else {
			clearphoto();
		}
	}

	function clearphoto() {
		const context = canvas.getContext('2d');
		context.fillStyle = '#AAA';
		context.fillRect(0, 0, canvas.width, canvas.height);
		pictureData = canvas.toDataURL('image/jpeg');
		photo.setAttribute('src', pictureData);
	}
	function switchCam() {
		selectedCamera = (selectedCamera + 1) % cameras.length;
		initVideo();
	}

	function previewFile() {
		const file = inputfile.files[0];
		const reader = new FileReader();
		reader.addEventListener(
			'load',
			() => {
				// on convertit l'image en une chaîne de caractères base64
				pictureData = reader.result;
				photo.setAttribute('src', pictureData);

			},
			false
		);
		if (file) {
			reader.readAsDataURL(file);
		}
	}
	let imgpreviewdata;
	let inputfile;
</script>

<div>
	<input class="bg-green-700 rounded-md text-white p-4" type="file" on:change={previewFile} bind:this={inputfile} />
</div>

<div class="camera">
	<video id="video" bind:this={video}>Video stream not available.</video>
</div>
<div>
	<button class="bg-green-700 rounded-md text-white p-4" on:click|preventDefault={takepicture}
		>Take photo</button
	>
</div>

<canvas id="canvas" bind:this={canvas} />

<div class="output">
	<img id="photo" bind:this={photo} alt="The screen capture will appear in this box." />
	<form method="POST" action="?/uploadPicture">
		<input type="hidden" value={pictureData} name="pictureData" />
		<button class="bg-green-700 rounded-md text-white p-4">Use this photo</button>
	</form>
</div>


<!-- <img src={data.pictureData} /> -->

<style type="postcss">
	#video {
		border: 1px solid black;
		box-shadow: 2px 2px 3px black;
		width: 320px;
		height: 240px;
		-webkit-transform: scaleX(-1);
		transform: scaleX(-1);
	}
	#photo {
		border: 1px solid black;
		box-shadow: 2px 2px 3px black;
		width: 240px;
		height: 240px;
	}

	#canvas {
		display: none;
	}

	.camera {
		width: 340px;
		display: inline-block;
	}

	.output {
		width: 240px;
		height: 240px;
		display: inline-block;
		vertical-align: top;
		border: 5px solid red;
	}
	/* 
	.startbutton {
		display: block;
		position: relative;
		margin-left: auto;
		margin-right: auto;
		bottom: 32px;
		background-color: rgba(0, 150, 0, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.7);
		box-shadow: 0px 0px 1px 2px rgba(0, 0, 0, 0.2);
		font-size: 14px;
		font-family: 'Lucida Grande', 'Arial', sans-serif;
		color: rgba(255, 255, 255, 1);
	} */
</style>
