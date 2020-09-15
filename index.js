const express = require("express");
const {textProcessor} = require('./src/api/text')
const bodyParser = require("body-parser");
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/text', upload.none(), async (req, res) => {
  if(!req.body.text || !req.body.car){
    res.json({"error": "Necessário enviar o texto e o nome do veículo"})
  }
  try{
    const processed = await textProcessor(req.body.text, req.body.car)
    res.json(processed)
  }catch(err){
    res.status(400).send({"Error": err})
  }

})

const port = 3000;
app.listen(port, () => {
  console.log(`Executando na porta ${port}...`);
});
