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

function getAudioTranscription(base64Data) {
    // update request body with audio data
    requestBody.audio.content = base64Data
    // update fetch options with request body
    fetchOptions.body = JSON.stringify(requestBody)
    let transcript = ""
    fetch(fetchUrl, fetchOptions)
        .then((response) => response.json())
        .then((data) => {
            transcript = excractText(data)
            // return "Hi"
        })
        // .then((data) => excractText(data))
        .catch((error) => console.error("Error sending audio data:", error));

    return transcript
}

function excractText(data) {
    let t = data
    if (data?.results?.length) {
        t = data?.results
            ?.map((result) => result.alternatives[0].transcript)
            .join("\n");
    }
    return t
}

module.exports = { getAudioTranscription }