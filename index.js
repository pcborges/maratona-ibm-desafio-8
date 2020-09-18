const express = require("express");
const { textProcessor } = require("./src/api/text");
const { getAudioTranscription } = require("./src/api/watsonSTT");
const bodyParser = require("body-parser");
const multer = require("multer");
var upload = multer({ dest: "uploads/" });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/recommendation", upload.single("audio"), async (req, res) => {
  try {
    if (req.file && req.body.car && !req.body.text) {
      const transcription = await getAudioTranscription(req.file.path);
      const textSanitized = transcription.results
        .map((el) => el.alternatives[0].transcript)
        .join("");
      console.log("Texto sanitizado", textSanitized)
      const processed = await textProcessor(textSanitized, req.body.car);
      res.json(processed);
    } else if (req.body.text && req.body.car && !req.file) {
      const processed = await textProcessor(req.body.text, req.body.car);
      res.json(processed);
    } else {
      res.send({
        recommendation: "",
        entities: [],
      });
    }
  } catch (err) {
    res.send({
      recommendation: "",
      entities: [],
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Estou executando na porta ${port}...`);
});
