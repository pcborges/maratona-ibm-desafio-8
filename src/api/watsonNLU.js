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

async function getEntitiesNLU(textInput) {
  const analyzeParams = {
    text: textInput,
    features: {
      entities: {
        model: wksCredentials.modelId,
        sentiment: true,
      },
    },
  };

  naturalLanguageUnderstanding
    .analyze(analyzeParams)
    .then((analysisResults) => {
      
      const entities = JSON.stringify(analysisResults, null, 2);
      console.log(entities)
      return entities;
    })
    .catch((err) => {
      return { error: err };
    });
}

module.exports = { getEntitiesNLU };
