"use strict";

// lodash
import _ from 'lodash/array';
import fs from 'fs';
import logger from "../helpers/log";

// Le modèle Tweet
import Tweet from "../models/tweet";

import Configuration from "../config/configuration";

/**
 * Renvoie un nombre aléatoire compris entre le min et le max.
 *
 * @param min le nombre minimum
 * @param max le nombre maximum
 * @returns {*} un nombre alétoire
 */
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


/*
  UTILITAIRES EN RAPPORT AVEC LES FICHIERS
   */
/**
 * Renvoie le nombre de tweet réçu par Léa.
 * Le nombre est stocké sur un fichier présent sur
 * le raspberry.
 */
export const getCurrentRank = (context) => {
  context.rank = fs.readFileSync(Configuration.RANK_FILE, "utf8");
};

/**
 * Remplis le rang du tweet avec le rang courant, sauf
 * si on est un admin auquel cas on mets "ADMIN" comme rang
 * @param tweet
 * @param rank
 */
export const fillTweetRank = (tweet, rank) => {
  tweet.rank = rank;
  if (isAdmin(tweet.screenName)) {
    tweet.rank = "ADMIN";
  }
};


/**
 * Sauvegarde le tweet courant.
 * Un contrôle est effectué pour ne pas enregistrer
 * 2 tweets identique.
 */
export const saveTweet = (tweet) => {
  if (tweet.fresh) {
    let configFile = fs.readFileSync(Configuration.TWEETS_DB);
    let config = JSON.parse(configFile);
    if (_.findIndex(config, function (o) {
      return o == tweet;
    }) == -1) {
      config.push(tweet);
    }
    let configJSON = JSON.stringify(config);
    logger.log('info', 'Sauvegarde du tweet courant');
    fs.writeFileSync(Configuration.TWEETS_DB, configJSON);
  }
};

/**
 * Sauvegarde le nombre de tweets reçu par Léa.
 * Le nombre est stocké sur un fichier présent sur
 * le raspberry.
 * @param rank le nombre de tweet reçu
 */
export const updateAndSaveRankTweet = (tweet, context) => {
  if (!isAdmin(tweet.screenName) && tweet.fresh) {
    let result = parseInt(context.rank) + 1;
    context.rank = result;
    try {
      fs.writeFileSync(Configuration.RANK_FILE, context.rank, { "encoding": 'utf8' });
    } catch (err) {
      logger.log('error', err);
    }
  }
}

export const isAdmin = (name) => Configuration
  .ADMINS
  .indexOf(name.toLowerCase()) != -1;

export const isDemoOff = (tweet) => tweet
  .text
  .toLowerCase()
  .indexOf(Configuration.TEXT_LEA_DEMO_OFF.toString().toLowerCase()) != -1;

export const isDemoOn = (tweet) => tweet
  .text
  .toLowerCase()
  .indexOf(Configuration.TEXT_LEA_DEMO_ON.toString().toLowerCase()) != -1;


/**
 * Génère et renvoie un squelette de tweet
 * @returns {Tweet}
 */
export const generateTweet = (text) => {
  let tweet = new Tweet("", "", text);
  tweet.isSpecial = true;
  tweet.motion = "NO_MOTION";
  return tweet;
};

/**
 * Génère et renvoie un tweet indiquant que Léa fait une pause
 * @returns {Tweet}
 */
export const generatePauseTweet = () => {
  logger.log('debug', 'Je génére un tweet de pause');
  return generateTweet(Configuration.TEXT_LEA_PAUSE);
};

/**
 * Génère et renvoie un tweet indiquant que Léa est prête à jouer
 * @returns {Tweet}
 */
export const generateStartUpTweet = () => {
  logger.log('debug', 'Je génére un tweet d\'initialisation');
  return generateTweet(Configuration.TEXT_LEA_START_UP);
};

/**
 * Génère et renvoie un tweet indiquant que Léa est prête à jouer
 * @returns {Tweet}
 */
export const generateStartTweet = () => {
  logger.log('debug', 'Je génére un tweet de démarrage');
  return generateTweet(Configuration.TEXT_LEA_START);
};
