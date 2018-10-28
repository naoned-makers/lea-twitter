import TwitterAPI from "twitter";

import Tweet from "../models/tweet";
import Configuration from "../config/configuration";
import Context from "../models/context";
import logger from "../helpers/log";
import mqtt from "mqtt";
import os from "os";


let client;
let clientMqtt;

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
  logger.log('debug', "Création du client Twitter...");
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
    logger.log('debug', "client connecté pour envoyer des messages twitter");
    clientMqtt.subscribe('lea/message/tweet');
  });
  
  
  //A new command as arrived
  clientMqtt.on('message', function (topic, strPayload) {
    logger.log('debug', "MESSAGE TWITTER");
    logger.log('info', "MESSAGE TWITTER INFO");
    logger.log('debug', topic);
    let payload = strPayload.toString();
    logger.log('debug', payload);

    client.post('statuses/update', {status: '@lea_nmakers ' + payload},  function(error, tweet, response) {
      if(error) throw error;
      console.log(tweet);  // Tweet body.
      console.log(response);  // Raw response object.
    });


 /*   try {
      logger.log('debug', "AVANT SEND TWEET");
      client.post('statuses/update', {track: '@lea_nmakers ' + payload});
    } catch (error) {
      logger.log('debug', "ERREUR GRAVE");
      logger.log('debug', error);
    }*/
    logger.log('debug', "APRES SEND TWEET");
  });
}



/**
 * Message handler pour la partie twitter
 * Il permet l'aiguillage au sein du code pour la partie twitter à effectuer
 * @param msg message contenant le type d'action à effectuer
 */
TwitterSend.messageHandler = function(msg) {
  logger.log('info', 'BBBBBBBBBBB');
  TwitterSend.listenMessage();
};

module.exports = TwitterSend;