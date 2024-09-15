<div class="text-4xl">
	{text}
</div>

<div>
	{state}
</div>

<button on:click={transcribeButtonPress}>Transcribe</button>
<button on:click={begin}>Begin</button>

<audio bind:this={audioPlayer} src="{audioSrc}" controls></audio>

<script>
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
