async function convertBlobToWav(audioContext, blob) {
    try {
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(
            arrayBuffer
        );
        const monoAudioBuffer = downmixToMono(audioContext, audioBuffer);
        return audioBufferToWav(monoAudioBuffer);
    } catch (error) {
        console.error("Error converting Blob to WAV:", error);
    }
}

function audioBufferToWav(buffer) {
    const numOfChannels = buffer.numberOfChannels,
        length = buffer.length * numOfChannels * 2 + 44,
        result = new DataView(new ArrayBuffer(length)),
        channels = [],
        sampleRate = buffer.sampleRate;
    let offset = 0,
        pos = 0;

    function setUint16(data) {
        result.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        result.setUint32(pos, data, true);
        pos += 4;
    }

    // RIFF identifier
    setUint32(0x46464952);
    // file length minus RIFF identifier length and file description length
    setUint32(length - 8);
    // RIFF type
    setUint32(0x45564157);

    // format chunk identifier
    setUint32(0x20746d66);
    // format chunk length
    setUint32(16);
    // sample format (raw)
    setUint16(1);
    // channel count
    setUint16(numOfChannels);
    // sample rate
    setUint32(sampleRate);
    // byte rate (sample rate * block align)
    setUint32(sampleRate * numOfChannels * 2);
    // block align (channel count * bytes per sample)
    setUint16(numOfChannels * 2);
    // bits per sample
    setUint16(16);

    // data chunk identifier
    setUint32(0x61746164);
    // data chunk length
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
        for (let i = 0; i < numOfChannels; i++) {
            const sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            result.setInt16(
                pos,
                sample < 0 ? sample * 0x8000 : sample * 0x7fff,
                true
            ); // convert to PCM
            pos += 2;
        }
        offset++;
    }

    return new Blob([result], { type: "audio/wav" });
}

async function blobToBase64(audioContext, blob) {
    const wavBlob = await convertBlobToWav(audioContext, blob);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = reader.result.split(",")[1];
            resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(wavBlob);
    });
}

function downmixToMono(audioContext, buffer) {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;

    // Create a new AudioBuffer with 1 channel
    const monoBuffer = audioContext.createBuffer(1, length, sampleRate);
    const monoData = monoBuffer.getChannelData(0);

    // Iterate over each sample and average the channels
    for (let i = 0; i < length; i++) {
        let sum = 0;
        for (let channel = 0; channel < numberOfChannels; channel++) {
            sum += buffer.getChannelData(channel)[i];
        }
        monoData[i] = sum / numberOfChannels;
    }

    return monoBuffer;
}


module.exports = { blobToBase64, convertBlobToWav }