const { getEntitiesNLU } = require("./watsonNLU");

const textProcessor = async (text, car) => {
  // Primeiro consulta a NLU para voltar as entidades
  try {
    const dataNLU = await getEntitiesNLU(text);
    const entitiesNLU = await extractEntities(dataNLU);
    const recommendationEntity = await recommendation(entitiesNLU);
    let car = "";
    if (recommendationEntity) {
      car = getRecommendedCar(recommendationEntity.entity);
    } 

    return {"recommendation": car, "entities": [entitiesNLU]};
  } catch (err) {
    console.log("Deu Ruim", err);
    return { Error: err };
  }

  //   res.json(entities)
  // Depois filtra apenas as entidades, sentimentos e o que foi identificado como mention

  // Agora executa a lógica para o processamento da recomendação com base no objeto e na regra
};

function extractEntities(object) {
  return object.result.entities.map((el) => {
    return { entity: el.type, sentiment: el.sentiment.score, mention: el.text };
  });
}

function recommendation(objeto) {
  const entities = objeto;
  //   const positives = entities.filter((entry) => {
  //     return entry.sentiment > 0;
  //   });
  const negatives = entities.filter((entry) => {
    return entry.sentiment < 0;
  });

  // Ver se não existe negativas, e retornar objeto vazio pois não há recomendação
  if (negatives.length == 0) {
    return null;
  }

  return getWorstSentiment(negatives);
}

function getWorstSentiment(negativeEntities) {
  const entities = negativeEntities;
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
    for (let i = 0; i < criteryItems.length; i++) {
      let pos = tiebrakerCriteria.map((e) => e.entity).indexOf(criteryItems[i]);
      if (pos >= 0) {
        worstSentiment = tiebrakerCriteria[pos];
        break;
      }
    }
  }

  return worstSentiment;
}

function getRecommendedCar(entity) {
  switch (entity) {
    case "SEGURANCA":
      return "TORO";
    case "CONSUMO":
      return "FIAT 500";
    case "DESEMPENHO":
      return "MAREA";
    case "MANUTENCAO":
      return "FIORINO";
    case "CONFORTO":
      return "LINEA";
    case "DESIGN":
      return "TORO";
    case "ACESSORIOS":
      return "RENEGADE";
  }
}

// TORO
// DUCATO
// FIORINO
// CRONOS
// FIAT 500
// MAREA
// LINEA
// ARGO
// RENEGADE

module.exports = { textProcessor };
