const nluCredentials = require("../credentials/watson-nlu.json");
const wksCredentials = require("../credentials/watson-wks.json");
const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: "2020-09-13",
  authenticator: new IamAuthenticator({
    apikey: nluCredentials.apikey,
  }),
  serviceUrl: nluCredentials.url,
});

const analyzeParams = {
  text: "O Fiat Uno é um carro fraco e o motor é horrível",
  features: {
    entities: {
      model: ksCredentials.modelId,
      sentiment: true,
    },
  },
};

naturalLanguageUnderstanding
  .analyze(analyzeParams)
  .then((analysisResults) => {
    console.log(JSON.stringify(analysisResults, null, 2));
  })
  .catch((err) => {
    console.log("error:", err);
  });
