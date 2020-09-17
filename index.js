const express = require("express");
const {textProcessor} = require('./src/api/text')
const { getAudioTranscription } = require('./src/api/watsonSTT')
const bodyParser = require("body-parser");
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/recommendation', upload.single('audio'), async (req, res) => {
  try{
  if(req.file && req.body.car && !req.body.text){
    const transcription = await getAudioTranscription(req.file.path)
    console.log(transcription)
  }else if(req.body.text && req.body.car && !req.file){
    const processed = await textProcessor(req.body.text, req.body.car)
    res.json(processed)
  }else{
    res.send({
      "recommendation": "",
      "entities": []
    })
  }
  }catch(err){
    res.send({
      "recommendation": "",
      "entities": []
    })
  }

})

const port = 3000;
app.listen(port, () => {
  console.log(`Executando na porta ${port}...`);
});
