const fs = require("fs");
const { IamAuthenticator } = require("ibm-watson/auth");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const sttCredentials = require("../credentials/watson-stt.json");

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: sttCredentials.apikey,
  }),
  serviceUrl: sttCredentials.url,
});

var params = {
  objectMode: true,
  contentType: "audio/flac",
  model: "pt-BR_NarrowbandModel",
};

// Create the stream.
async function getAudioTranscription(filePath) {
  let recognizeStream = speechToText.recognizeUsingWebSocket(params);

  
  return new Promise((resolve, reject) => {
    // Pipe in the audio.
    fs.createReadStream(filePath).pipe(recognizeStream);
    // Listen for events.
    recognizeStream.on("data", function (event) {
      resolve(event)
    });
    recognizeStream.on("error", reject);
    // recognizeStream.on("end", function (event) {
    //   console.log("END", event)
    // });
  })

}

module.exports = { getAudioTranscription };
