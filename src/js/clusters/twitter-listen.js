import TwitterAPI from "twitter";

import Tweet from "../models/tweet";
import logger from "../helpers/log";
import mqtt from "mqtt";
import os from "os";


let client;
let clientMqtt;
let optionsMqtt = {QoS: 2, retain: true};

const TWITTER_TO_BRAIN_CHANNEL = 'lea/twitter/brain';

/**
 * Ecoute des tweets grâce à l'API streaming de twitter.
 * Les credentials sont fixés par des variables d'environnement
 */
function streamTwitter() {
  
  logger.log('debug', "TWL Création du client Twitter Listen...");
  client = new TwitterAPI({
    "consumer_key": process.env.TWITTER_CONSUMER_KEY,
    "consumer_secret": process.env.TWITTER_CONSUMER_SECRET,
    "access_token_key": process.env.TWITTER_ACCESS_TOKEN_KEY,
    "access_token_secret": process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  //on se connecte au broker (localhost) et on suscribe aux command message
  clientMqtt = mqtt.connect('ws://localhost:3001', {
      clientId: 'lea_twitter_listen_' + os.hostname()
  });
  
  clientMqtt.on('connect', function () {
    logger.log('debug', "TWL client connecté");
  });
  
  // Ecoute des messages
  let stream = client.stream('statuses/filter', {track: 'lea_nmakers'});

  stream.on('data', function(tweetReceived) {
    logger.log('debug', "TWL Reception du tweet " + tweetReceived.text);
    if (!tweetReceived.retweeted_status) {

      let tweet = new Tweet(tweetReceived.user.name, tweetReceived.user.screen_name, tweetReceived.text);
      logger.log('debug', "TWL envoie du tweet sur l'arduino");
      clientMqtt.publish(TWITTER_TO_BRAIN_CHANNEL, JSON.stringify(tweet), optionsMqtt);
    }
  });

  stream.on('error', function(error) {
    throw error;
  });
}
streamTwitter();
