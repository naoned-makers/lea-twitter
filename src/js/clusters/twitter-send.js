import TwitterAPI from "twitter";

import Tweet from "../models/tweet";
import Configuration from "../config/configuration";
import Context from "../models/context";
import logger from "../helpers/log";
import mqtt from "mqtt";
import os from "os";


let client;
let clientMqtt;
let optionsMqtt = {QoS: 2, retain: true};

const UI_TO_TWITTER_CHANNEL = 'lea/ui/tweet';

/**
 * Constructeur.
 * @constructor
 */
function TwitterSend() {}

/**
 * Ecoute des tweets grâce à l'API streaming de twitter.
 * Les credentials sont fixés par des variables d'environnement
 */
TwitterSend.listenMessage = function() {
  logger.log('debug', "TWS Création du client Twitter Send...");
  client = new TwitterAPI({
    "consumer_key": process.env.TWITTER_CONSUMER_KEY,
    "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
    "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
    "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  
  
  //on se connecte au broker (localhost) et on suscribe aux command message
  clientMqtt = mqtt.connect('ws://localhost:3001', {
      clientId: 'lea_twitter_send_' + os.hostname()
  });
  
  clientMqtt.on('connect', function () {
    logger.log('debug', "TWS client connecté");
    clientMqtt.subscribe(UI_TO_TWITTER_CHANNEL, optionsMqtt);
  });
  
  
  //A new command as arrived
  clientMqtt.on('message', function (topic, strPayload) {
    let payload = strPayload.toString();
    logger.log('debug', "TWS Réception message " + payload);

    client.post('statuses/update', {status: '@lea_nmakers ' + payload},  function(error, tweet, response) {
      if(error) throw error;
      logger.log('debug', "TWS envoie tweet " + payload);
    });
  });
}



/**
 * Message handler pour la partie twitter
 * Il permet l'aiguillage au sein du code pour la partie twitter à effectuer
 * @param msg message contenant le type d'action à effectuer
 */
TwitterSend.messageHandler = function(msg) {
  TwitterSend.listenMessage();
};

module.exports = TwitterSend;