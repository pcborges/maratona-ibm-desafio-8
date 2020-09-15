const express = require("express");
const {textProcessor} = require('./src/api/text')
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/text', (req, res) => {
  req.on('data', (data) => {
    console.log(JSON.stringify(data));
  });
  // textProcessor(req,res)
})

const port = 3000;
app.listen(port, () => {
  console.log(`Executando na porta ${port}...`);
});
