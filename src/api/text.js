const { getEntitiesNLU } = require("./watsonNLU");

const textProcessor = async (text, car) => {
  // Primeiro consulta a NLU para voltar as entidades
  try {
    const dataNLU = await getEntitiesNLU(text);
    const entitiesNLU = await sanitizeEntities(dataNLU);
    const negativeEntities = await getNegativeEntities(entitiesNLU);
    if (!negativeEntities) {
      return {
        recommendation: "",
        entities: [],
      };
    }
    const worstSentimentFiltered = await getWorstSentiment(negativeEntities);
    if (worstSentimentFiltered) {
      recommendedCar = getRecommendedCar(worstSentimentFiltered.entity, car);
    }

    return { recommendation: recommendedCar, entities: entitiesNLU };
  } catch (err) {
    return { Error: err };
  }

  //   res.json(entities)
  // Depois filtra apenas as entidades, sentimentos e o que foi identificado como mention

  // Agora executa a lógica para o processamento da recomendação com base no objeto e na regra
};

function sanitizeEntities(object) {
  return object.result.entities.map((el) => {
    return { entity: el.type, sentiment: el.sentiment.score, mention: el.text };
  });
}

function getNegativeEntities(entities) {
  const negatives = entities.filter((entry) => {
    return entry.sentiment < 0 && entry.entity != "MODELO";
  });

  // Ver se não existe negativas, e retornar objeto vazio pois não há recomendação
  if (negatives.length == 0) {
    return null;
  } else {
    return negatives;
  }
}

function getWorstSentiment(negativeEntities) {
  const groupedNegativeEntities = groupEntities(negativeEntities);
  let worstSentiment = { sentiment: 0 };
  groupedNegativeEntities.forEach((entry) => {
    if (worstSentiment.sentiment > entry.sentiment) {
      worstSentiment = entry;
    }
  });

  // procurar se existem sentimentos com mesmo peso
  tiebreakerCriteria = [];
  tiebreakerCriteria.push(worstSentiment);
  groupedNegativeEntities.forEach((entry) => {
    if (
      worstSentiment.sentiment + 0.1 >= entry.sentiment &&
      worstSentiment.sentiment - 0.1 <= entry.sentiment &&
      worstSentiment.entity != entry.entity
    ) {
      tiebreakerCriteria.push(entry);
    }
  });

  console.log("TIEBREAKE", tiebreakerCriteria);

  if (tiebreakerCriteria.length > 1) {
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
      let pos = tiebreakerCriteria
        .map((e) => e.entity)
        .indexOf(criteryItems[i]);
      if (pos >= 0) {
        worstSentiment = tiebreakerCriteria[pos];
        break;
      }
    }
  }

  return worstSentiment;
}

function getRecommendedCar(entity, car) {
  car = car.toUpperCase();
  switch (entity) {
    case "SEGURANCA":
      return car.includes("TORO") ? "XXX" : "TORO";
    case "CONSUMO":
      return "FIAT 500";
    case "DESEMPENHO":
      return "MAREA";
    case "MANUTENCAO":
      return "FIORINO";
    case "CONFORTO":
      return "LINEA";
    case "DESIGN":
      return car.includes("TORO") ? "XXX" : "TORO";
    case "ACESSORIOS":
      return "RENEGADE";
  }
}

function groupEntities(entities) {
  console.log("GROUP ENTITIES", entities);
  var result = entities.reduce(function (acc, val) {
    var o = acc
      .filter(function (obj) {
        return obj.entity == val.entity;
      })
      .pop() || { entity: val.entity, sentiment: 0 };

    o.sentiment += val.sentiment;
    acc.push(o);
    return acc;
  }, []);
  let filteredResult = result.filter(function (itm, i, a) {
    return i == a.indexOf(itm);
  });
  return filteredResult;
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
