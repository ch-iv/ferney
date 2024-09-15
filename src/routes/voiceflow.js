const voiceflow_api_key = ""

export const vfInteract = async (userID) => {
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', authorization: voiceflow_api_key},
        body: JSON.stringify({
            action: {type: 'launch'},
            config: {
                tts: true,
                stripSSML: true,
                stopAll: true,
                excludeTypes: ['block', 'debug', 'flow']
            }
        })
    };

    const resp = await fetch('https://general-runtime.voiceflow.com/state/user/' + userID + '/interact?logs=off', options)
    return await resp.json()
}

export const vfInteractWithText = async (userID, payload) => {
    const options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json', authorization: voiceflow_api_key},
        body: JSON.stringify({
            action: {type: 'text', payload: payload},
            config: {
                tts: true,
                stripSSML: true,
                stopAll: true,
                excludeTypes: ['block', 'debug', 'flow', 'path']
            }
        })
    };

    const resp = await fetch('https://general-runtime.voiceflow.com/state/user/' + userID + '/interact?logs=off', options)
    return await resp.json()
}

export const vfState = async (userID) => {
    const options = {method: 'GET', headers: {accept: 'application/json', authorization: voiceflow_api_key}};

    fetch('https://general-runtime.voiceflow.com/state/user/userID', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}