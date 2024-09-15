
<style>
	@import url('https://fonts.googleapis.com/css2?family=Patrick+Hand:wght@400&display=swap');
	.text-ferney {
		font-family: 'Patrick Hand', cursive;
		line-height: 2; /* Adjust line-height to ensure text isn't cut off */
	}
	.animate-gradient {
		background: linear-gradient(45deg, #a8caba, #d4e9e1, #a1c4fd);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient 6s ease infinite;
	}
	@keyframes gradient {
		0% { background-position: 0% 0%; }
		50% { background-position: 100% 100%; }
		100% { background-position: 0% 0%; }
	}
</style>

<div class="bg-gradient-to-t from-sky-400 to-sky-500 flex items-center justify-center min-h-screen w-full">
		<h1 class="text-ferney text-[200px] font-bold text-white">
			Ferney
		</h1>



<img alt="grass overlay" src={grass} class="w-full absolute bottom-0"/>

</div>

<div class="absolute bottom-[20px] w-full">
	<div class="flex flex-col w-full items-center justify-center gap-5">


		<div class="flex flex-row gap-4">
			<button class="bg-green-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400" on:click={transcribeButtonPress}>Transcribe speech</button>
			<button class="bg-green-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400" on:click={begin}>Begin conversation</button>
		</div>

		<div class="text-1xl text-white">
			State: {state}
		</div>
	</div>
</div>





<!--<audio bind:this={audioPlayer} src="{audioSrc}" controls></audio>-->

<script>
	import grass from '$lib/images/grass.png'
	import { onMount } from 'svelte';
	import { getMediaRecorder, tryTranscribeSpeech, playAudio } from './audio.js';
	import { transcribedTextStore, appStateStore } from "./stores.js";
	import { defaultState, appState } from "./state.js";
	import { vfInteract, vfState, vfInteractWithText } from "./voiceflow.js";

	let text = '';
	let state = defaultState;
	let audioSrc = 'data:audio/x-wav;base64,...'; // Shortened for clarity
	let audioPlayer = null;
	let mediaRecorder = null;

	transcribedTextStore.subscribe(value => {
		text = value;
	});

	appStateStore.subscribe(value => {
		state = value;
	});

	onMount(async () => {
		//mediaRecorder = await getMediaRecorder();
	});



	const begin = async () => {
		const userID = Math.floor(Math.random() * 10000);
		let first = true;
		let resp = {};

		while (true) {
			try {
				if (first) {
					first = false;
					resp = await vfInteract(userID);
				} else {
					console.log("Recording")
					mediaRecorder = await getMediaRecorder();
					await tryTranscribeSpeech(mediaRecorder);
					resp = await vfInteractWithText(userID, text);
				}

				console.log(resp);

				for (const block of resp) {
					console.log(block);
					if (block.type === "speak") {
						audioSrc = block.payload.src;
						const audio = new Audio(audioSrc)
						await playAudio(audio);
					} else if (block.type === "end") {
						console.log("Got end block. Loop stopped.");
						return;
					}
				}
			} catch (error) {
				console.error('Error in begin function:', error);
				return;
			}
		}
	};

	const transcribeButtonPress = async () => {
		if (mediaRecorder) {
			await tryTranscribeSpeech(mediaRecorder);
			appStateStore.set(appState.Waiting);
		} else {
			console.error('Media recorder not initialized');
		}
	};
</script>
