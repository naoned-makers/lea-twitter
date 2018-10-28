import cluster from 'cluster';

import Configuration from "./config/configuration";
import Context from "./models/context";

import TwitterListen from "./clusters/twitter-listen";
import TwitterSend from "./clusters/twitter-send";


import logger from "./helpers/log";


let clusterTwitterListen;
let clusterTwitterSend;
/*
 * Le contexte d'exécution du master
 */
var context = new Context();

/**
 * Cas quand le cluster est esclave. Il ne peut alors s'agir que
 * soit du cluster Twitter ou du cluster Arduino.
 * Dans le cas du cluster Twitter, on fixe le process pour déclencher
 * ultérieurement l'appel au cluster.
 * Le programme fait exactement la même chose pour le cluster Arduino.
 */
if (cluster.isWorker) {
  if (process.env['type'] == Configuration.processConst.TYPE.CLUSTER_TWITTER_LISTEN) {
    logger.log('info', 'Création du cluster Twitter Listen');
    TwitterListen.process = process;
    process.on('message', TwitterListen.messageHandler);
  } else if (process.env['type'] == Configuration.processConst.TYPE.CLUSTER_TWITTER_SEND) {
    logger.log('info', 'Création du cluster Twitter Send');
    TwitterSend.process = process;
    process.on('message', TwitterSend.messageHandler);
  }
}

/**
 * Cas pour le cluster master. Il s'agit du chef d'orchestre.
 * Il crée et met en relation ses deux clusters esclaves.
 */

if (cluster.isMaster) {

  // Fork workers.
  clusterTwitterListen = cluster.fork({ type: Configuration.processConst.TYPE.CLUSTER_TWITTER_LISTEN });

  // Fork workers.
  clusterTwitterSend = cluster.fork({ type: Configuration.processConst.TYPE.CLUSTER_TWITTER_SEND });

  

  // Quand le worker arduino est opérationnel, nous affichons le tweet de bienvenue ainsi que
  // l'accompagnement vocal
  /*clusterArduino.on('online', function (worker) {
    clusterArduino.send(Utils.generateStartUpTweet());
  });*/

  // Temps de latence pour permettre l'initialisation des workers avant de lancer l'API streaming
  // Twitter
  clusterTwitterListen.on('online', function (worker) {
    logger.log('info', 'Twitter est sur écoute ...');
    clusterTwitterListen.send({ action: Configuration.processConst.ACTION.LISTEN_TWEET });
  });

  clusterTwitterSend.on('online', function (worker) {
    logger.log('info', 'Twitter est prêt à écrire ...');
    clusterTwitterSend.send({ action: Configuration.processConst.ACTION.SEND_TWEET });
  });


}
