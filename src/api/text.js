const { getEntitiesNLU } = require('./watsonNLU')

const textProcessor = async (req, res) => {
  // Primeiro consulta a NLU para voltar as entidades
  res.send(req.body.text)
  const texto = "O Fiat Uno é um bom carro, com motor muito forte e consumo incrível"
//   const entities = await getEntitiesNLU(texto)
//   res.json(entities)
  // Depois filtra apenas as entidades, sentimentos e o que foi identificado como mention

  // Agora executa a lógica para o processamento da recomendação com base no objeto e na regra

};

function recommendation(objeto) {
  const entities = objeto.entities;
//   const positives = entities.filter((entry) => {
//     return entry.sentiment > 0;
//   });
  const negatives = entities.filter((entry) => {
    return entry.sentiment < 0;
  });

  // Ver se não existe negativas, e retornar objeto vazio pois não há recomendação
  if (negatives.length == 0) {
    return {
      recommendation: "",
      entities: [],
    };
  }

  return getWorstSentiment(negatives)

}

function getWorstSentiment(negativeEntities) {
  const entities = negativeEntities
  let worstSentiment = { sentiment: 0 };
  entities.forEach((entry) => {
    if (worstSentiment.sentiment > entry.sentiment) {
      worstSentiment = entry;
    }
  });

  // procurar se existem sentimentos com mesmo peso
  tiebrakerCriteria = [];
  tiebrakerCriteria.push(worstSentiment);
  entities.forEach((entry) => {
    if (
      worstSentiment.sentiment + 0.1 >= entry.sentiment &&
      worstSentiment.sentiment - 0.1 <= entry.sentiment &&
      worstSentiment.entity != entry.entity
    ) {
      tiebrakerCriteria.push(entry);
    }
  });

  if (tiebrakerCriteria.length > 1) {
    const criteryItems = [
      "SEGURANCA",
      "CONSUMO",
      "DESEMPENHO",
      "MANUTENCAO",
      "CONFORTO",
      "DESIGN",
      "ACESSORIOS",
    ];
    for(let i = 0; i < criteryItems.length; i++){
        let pos = tiebrakerCriteria.map(e => e.entity).indexOf(criteryItems[i]);
        if(pos >= 0){
            worstSentiment = tiebrakerCriteria[pos]
            break;
        }
    }
    
  }

  return worstSentiment;
}

retornoNLU = {
  recommendation: "MAREA",
  entities: [
    {
      entity: "CONSUMO",
      sentiment: -0.999,
      mention: "10.7km/l",
    },
    {
      entity: "CONFORTO",
      sentiment: 0.799,
      mention: "Banco de couro",
    },
    {
      entity: "SEGURANCA",
      sentiment: -0.899,
      mention: "Airbag",
    },
  ],
};


module.exports = { textProcessor };
