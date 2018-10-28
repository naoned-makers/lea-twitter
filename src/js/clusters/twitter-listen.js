import TwitterAPI from "twitter";

import Tweet from "../models/tweet";
import Configuration from "../config/configuration";
import Context from "../models/context";
import {isAdmin, isDemoOn, isDemoOff} from "../helpers/utils";
import logger from "../helpers/log";
import mqtt from "mqtt";
import os from "os";


let client;
let clientMqtt;

/**
 * Constructeur.
 * @constructor
 */
function TwitterListen() {}

/**
 * Ecoute des tweets grâce à l'API streaming de twitter.
 * Les credentials sont fixés par des variables d'environnement
 */
TwitterListen.streamTwitter = function() {
  
  //on se connecte au broker (localhost) et on suscribe aux command message
  clientMqtt = mqtt.connect('ws://localhost:3001', {
      clientId: 'lea_twitter_listen_' + os.hostname()
  });
  
  clientMqtt.on('connect', function () {
    logger.log('debug', "client connecté pour écouter les messages twitter");
  });
  
  client = new TwitterAPI({
    "consumer_key": process.env.TWITTER_CONSUMER_KEY,
    "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
    "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
    "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
  });
  logger.log('debug', "Création du client Twitter...");
  let stream = client.stream('statuses/filter', {track: 'lea_nmakers'});

  stream.on('data', function(tweetReceived) {
    logger.log('debug', "On a reçu un tweet");
    if (!tweetReceived.retweeted_status) {

      let tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
      
      
      logger.log('debug', "envoie du tweet sur l'arduino");
      logger.log('debug', tweet);
      
      clientMqtt.publish('lea/message/arduino', JSON.stringify(tweet));

    }
  });

  stream.on('error', function(error) {
    throw error;
  });
}

/**
 * Message handler pour la partie twitter
 * Il permet l'aiguillage au sein du code pour la partie twitter à effectuer
 * @param msg message contenant le type d'action à effectuer
 */
TwitterListen.messageHandler = function(msg) {
  logger.log('info', 'AAAAAAAAAAAA');
  TwitterListen.streamTwitter();
};

module.exports = TwitterListen;