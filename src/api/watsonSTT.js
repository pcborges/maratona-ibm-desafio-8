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
  model: "pt-BR_BroadbandModel",
  keywords: ["carro", "desempenho", "conforto"],
  keywordsThreshold: 0.5,
  maxAlternatives: 3,
};

// Create the stream.
var recognizeStream = speechToText.recognizeUsingWebSocket(params);

// Pipe in the audio.
fs.createReadStream("./assets/audio_sample.flac").pipe(recognizeStream);

// Listen for events.
recognizeStream.on("data", function (event) {
  onEvent("Data:", event);
});
recognizeStream.on("error", function (event) {
  onEvent("Error:", event);
});
recognizeStream.on("close", function (event) {
  onEvent("Close:", event);
});

// Display events on the console.
function onEvent(name, event) {
  console.log(name, JSON.stringify(event, null, 2));
}
