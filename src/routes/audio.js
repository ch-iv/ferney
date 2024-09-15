import {transcribedTextStore, appStateStore} from "./stores.js";
import {appState} from "./state.js";

var silenceStart = Date.now();

export async function getMediaRecorder() {
    appStateStore.set(appState.Initializing)
    let mediaRecorder
    let audioChunks = []
    const silenceDuration = 2 // in seconds
    const whisperEndpoint =
        'http://localhost:3000/proxy/asr?task=transcribe&output=json'

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    let audioContext = new AudioContext()
    let mediaStreamSource = audioContext.createMediaStreamSource(stream)
    let scriptProcessorNode = audioContext.createScriptProcessor(4096, 1, 1)

    scriptProcessorNode.onaudioprocess = function (event) {
        const inputBuffer = event.inputBuffer.getChannelData(0)
        const isSilent = isBufferSilent(inputBuffer)
        if (isSilent) {
            if (Date.now() - silenceStart > silenceDuration * 1000) {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop()
                }
            }
        } else {
            silenceStart = Date.now()
        }
    }

    mediaStreamSource.connect(scriptProcessorNode)
    scriptProcessorNode.connect(audioContext.destination)

    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data)
    })

    mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' })
        audioChunks = []

        const { text, elapsedTime } = await sendToWhisperAPI(audioBlob, whisperEndpoint)
        transcribedTextStore.set(text)
    })

    mediaRecorder.addEventListener('start', async () => {
        appStateStore.set(appState.Recording)
    })

    appStateStore.set(appState.Waiting)
    return mediaRecorder
}

export async function tryTranscribeSpeech(mediaRecorder) {
    try {
        mediaRecorder.stop()
        silenceStart = Date.now()
        mediaRecorder.start()
    } catch (err) {
        console.error('Error initializing media recorder:', err)
    }
}

function isBufferSilent(buffer) {
    const threshold = 0.2
    for (let i = 0; i < buffer.length; i++) {
        if (Math.abs(buffer[i]) > threshold) {
            return false
        }
    }
    return true
}

async function sendToWhisperAPI(audioBlob, whisperEndpoint) {
    appStateStore.set(appState.Transcribing)
    const formData = new FormData()
    formData.append('audio_file', audioBlob, 'audio.mp3')

    const startTime = performance.now()

    const response = await fetch(whisperEndpoint, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
        body: formData,
    })

    const endTime = performance.now()
    const elapsedTime = ((endTime - startTime) / 1000).toFixed(2)

    appStateStore.set(appState.Waiting)

    if (response.ok) {
        const data = await response.json()
        return { text: data.text, elapsedTime: elapsedTime }
    } else {
        console.error('Error sending audio to Whisper API:', response)
        alert('Failed to send audio to Whisper API.')
        return 'Error: Failed to convert speech to text.'
    }
}

export async function playAudio(audioPlayer) {
    return new Promise((resolve, reject) => {
        if (!audioPlayer) {
            reject(new Error('Audio player not initialized'));
            return;
        }

        audioPlayer.play().then(() => {
            const handleEnded = () => {
                audioPlayer.removeEventListener('ended', handleEnded);
                resolve();
            };
            const handleError = (error) => {
                audioPlayer.removeEventListener('error', handleError);
                console.error('Audio playback error:', error);
                reject(error);
            };
            audioPlayer.addEventListener('ended', handleEnded);
            audioPlayer.addEventListener('error', handleError);
        }).catch(error => {
            console.error('Play error:', error);
            reject(error);
        });
    });
}