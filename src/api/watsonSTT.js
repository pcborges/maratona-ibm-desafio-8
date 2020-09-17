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
  var recognizeStream = speechToText.recognizeUsingWebSocket(params);

  // Pipe in the audio.
  fs.createReadStream(filePath).pipe(recognizeStream);
  // Listen for events.
  recognizeStream.on("data", function (event) {
     data = event
    onEvent("Data:", event);
  });
  recognizeStream.on("error", function (event) {
    onEvent("Error:", event);
  });
  recognizeStream.on("close", function (event) {
    onEvent("Close:", event);
  });
  recognizeStream.on("end", function (event) {
    onEvent("FIM:", event);
  });

  // Display events on the console.
  function onEvent(name, event) {
    console.log(name, JSON.stringify(event, null, 2));
  }
}

module.exports = { getAudioTranscription };
