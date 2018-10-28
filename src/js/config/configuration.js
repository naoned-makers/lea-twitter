"use strict"

import fs from 'fs';


/**
 * Classe de configuration contenant l'ensemble des
 * constantes et des variables configurables
 */
export default class Configuration {}

/*
 * Compte twitter des admin de Léa
 */
Configuration.ADMINS = [
  "scxpro",
  "thedireizh",
  "lynchmaniacpl",
  "fwlodarezack",
  "batiot",
  "rguillome",
  "lea_nmakers"
];

/*
 * Listes des commandes d'action pour Léa
 */
Configuration.CLASSIC_MOTIONS = ["KUNG_FU_PANDA", "SHAOLIN_SOCCER"];

/*
 * Fichier contenant le nombre de tweets reçu
 */
Configuration.RANK_FILE = 'rank.txt';

/*
 * Contenus de l'ensemble des tweets reçu
 */
Configuration.TWEETS_DB = 'tweets.json';

Configuration.WELCOME_MESSAGE = 'welcomeMessage.txt';

/*
 * Constante représentant les textes des tweets pour arrêter ou démarrer léa
 * Cela représente aussi le texte qu'affiche Léa quand elle est en pause.
 */
Configuration.USER_TWITTER = '@lea_nmakers';




Configuration.processConst = {
  TYPE: {
    CLUSTER_TWITTER_LISTEN: 'CLUSTER_TWITTER_LISTEN',
    CLUSTER_TWITTER_SEND: 'CLUSTER_TWITTER_SEND'
  },
  ACTION: {
    SHOW_TWEET: 'SHOW_TWEET',
    SEND_TWEET: 'SEND_TWEET',
    LISTEN_TWEET: 'LISTEN_TWEET',
    END_SHOW_TWEET_ON_ARDUINO: 'END_SHOW_TWEET_ON_ARDUINO'
  }
};




