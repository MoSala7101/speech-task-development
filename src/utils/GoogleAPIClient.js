// "AIzaSyBRqLY7bt6x2U4ADcZhE-HvNsVEKghbO9U";
const API_KEY = process.env.VUE_APP_API_KEY
const fetchUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${API_KEY}`

const requestBody = {
    config: {
        encoding: "WEBM_OPUS",
        languageCode: "en-US",
    },
    audio: {
        // content: base64Data,
    },
};

const fetchOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    // body: JSON.stringify(requestBody),
}

/**
 * Speech-To-Text API errors related variable to handle request resending  
 */
let audioEncoding = null
let audioChannelCount = null
let audioSampleRate = null
let resendCount = 0
const MAX_RESEND_COUNT = 6

let errorMessage = ""

const browserNotupportedMessage = { sender: "ai", text: 'Sorry, Your Browser Not Supported Yet' }

/**
 * This function handles sending recorded audio to Google Speech-To-Text API proccess 
 * if there any error in response it updates the related variable and resend another request
 * if resend requests reached the MAX_RESEND_COUNT 
 * it returns browserNotupportedMessage
 * @param base64Data 
 * @returns {Object} transcription {sender , text}
 */

async function getAudioTranscription(base64Data) {
    resendCount += 1
    if (resendCount >= MAX_RESEND_COUNT) return { ...browserNotupportedMessage }
    try {
        let data = await getRequestReuslt(base64Data)
        errorMessage = data?.error?.message
        if (errorMessage) {
            console.log(`Resend NO. ${resendCount} errorMessage: ${errorMessage}`);
            if (errorMessage.includes("encoding")) {
                updateAudioEncoding(errorMessage)
                getAudioTranscription(base64Data)
            }
            else if (errorMessage.includes("audio_channel_count")) {
                updateAudioChannelCount(errorMessage)
                getAudioTranscription(base64Data)
            }

            else if (errorMessage.includes("sample_rate") || errorMessage.includes("sample rate")) {
                updateSampleRate(errorMessage)
                getAudioTranscription(base64Data)
            }
        } else {
            let transcript = getMessageObject(data)
            console.log("transcript from module: ", transcript);
            return transcript
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * Reseting the resend variables for further requests
 */
function resetResendVariables() {
    audioEncoding = null
    audioChannelCount = null
    audioSampleRate = null
    errorMessage = ""
    resendCount = 0
}

/**
 * if Google Speech-To-Text API returns an error with the sent audio encoding 
 * which is ( vary from browser to another )
 * it updates the audioEncoding variable with mentioned value in response message
 * @param {String} errorMessage 
 */
function updateAudioEncoding(errorMessage) {
    const match = errorMessage.match(/Specify (.*?) encoding/); // Regex to capture the encoding
    if (match && match[1]) {
        audioEncoding = match[1].trim(); // Return the captured encoding (OGG_OPUS in this case)
    }
}


/**
 * if Google Speech-To-Text API returns an error related to audio channel_count ( e.g firefox ) 
 * it updates the audioChannelCount variable with mentioned value in response message
 * @param {String} errorMessage 
 */
function updateAudioChannelCount(errorMessage) {
    let headerCount = errorMessage.split('header')[1].replaceAll('`', '')
    audioChannelCount = parseInt(headerCount); // Parse the captured string to integer
}


/**
 * if Google Speech-To-Text API returns an error related to audio sample_rate_hertz ( e.g firefox ) 
 * it updates the audioSampleRate variable or remove it based on response message 
 * @param {String} errorMessage 
 */
function updateSampleRate(errorMessage) {
    if (errorMessage.includes('sample_rate_hertz') && errorMessage.includes('unspecified')) {
        audioSampleRate = null; // Parse the captured string to integer
    }
    else if (errorMessage.includes(48000)) {
        audioSampleRate = 48000;
    }
    else if (errorMessage.includes(24000)) {
        audioSampleRate = 24000;
    }
}

/**
 * This function is responsible to send a new request with updated requestBody config
 * @param base64Data 
 * @returns {Object} data
 */
async function getRequestReuslt(base64Data) {
    // update request body with audio data
    requestBody.audio.content = base64Data

    if (audioEncoding) {
        requestBody.config.encoding = audioEncoding
    }

    if (audioChannelCount) {
        requestBody.config['audio_channel_count'] = audioChannelCount
    }

    // if an response error with specified sample rate will be set 
    // if not specidied in a response will be removed from  
    if (audioSampleRate) {
        requestBody.config['sampleRateHertz'] = audioSampleRate
    } else {
        delete requestBody.config['sampleRateHertz']
    }

    // update fetch options with request body
    fetchOptions.body = JSON.stringify(requestBody)

    const response = await fetch(fetchUrl, fetchOptions);
    const data = await response.json();
    return data;
}

/**
 * This function is responsible to extract the transcription text from response ( if found )
 * then return an object to be rendered in UI
 * @param {Object} data 
 * @returns {Object} transcription {sender , text}
 */
function getMessageObject(data) {
    let t = { ...browserNotupportedMessage }
    if (data?.results?.length) {
        t.sender = "client"
        t.text = data?.results
            ?.map((result) => result.alternatives[0].transcript)
            .join("\n");
    }
    return t
}

module.exports = { getAudioTranscription, resetResendVariables }