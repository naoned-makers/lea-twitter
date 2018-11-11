"use strict"

import fs from 'fs';


/**
 * Classe de configuration contenant l'ensemble des
 * constantes et des variables configurables
 */
export default class Configuration {}

/*
 * Listes des commandes d'action pour Léa
 */
Configuration.CLASSIC_MOTIONS = ["KUNG_FU_PANDA", "SHAOLIN_SOCCER"];

/*
 * Contenus de l'ensemble des tweets reçu
 */
Configuration.TWEETS_DB = 'tweets.json';

/*
 * Constante représentant les textes des tweets pour arrêter ou démarrer léa
 * Cela représente aussi le texte qu'affiche Léa quand elle est en pause.
 */
Configuration.USER_TWITTER = 'lea_nmakers';


Configuration.easterEggs = [
  {
    text: "rigole",
    alternativeText: Configuration.USER_TWITTER + " rigole",
    mp3: "sos",
    motion: "SOS"
  }, {
    text: "gangster",
    alternativeText: Configuration.USER_TWITTER + " gangster",
    mp3: "affranchis"
  }, {
    text: "colle",
    alternativeText: Configuration.USER_TWITTER + " colle",
    mp3: "colle"
  }, {
    text: "exorciste",
    alternativeText: Configuration.USER_TWITTER + " exorciste",
    mp3: "exorciste",
    motion: "EXORCISTE"
  }, {
    text: "diable",
    alternativeText: Configuration.USER_TWITTER + " diable",
    mp3: "diable"
  }, {
    text: "lot1",
    alternativeText: Configuration.USER_TWITTER + " lot1",
    mp3: "lot1"
  }, {
    text: "lot2",
    alternativeText: Configuration.USER_TWITTER + " lot2",
    mp3: "lot2"
  }, {
    text: "lot3",
    alternativeText: Configuration.USER_TWITTER + " lot3",
    mp3: "gagnant_voix"
  }, {
    text: "dora",
    alternativeText: Configuration.USER_TWITTER + " dora",
    mp3: "gagnant_dora"
  }, {
    text: "formidable",
    alternativeText: Configuration.USER_TWITTER + " formidable",
    mp3: "formidable"
  }, {
    text: "foule",
    alternativeText: Configuration.USER_TWITTER + " foule",
    mp3: "foule"
  }, {
    text: "the best",
    alternativeText: Configuration.USER_TWITTER + " the best",
    mp3: "simply the best"
  }, {
    text: "champion",
    alternativeText: Configuration.USER_TWITTER + " champion",
    mp3: "gagnant_queen"
  }
];

Configuration.sounds = [
  {
    text: "aboTwitter",
    alternativeText: Configuration.USER_TWITTER + " aboTwitter",
    mp3: "aboTwitter"
  }, {
    text: "jouerLeo",
    alternativeText: Configuration.USER_TWITTER + " jouerLeo",
    mp3: "jouerLeo"
  }, {
    text: "jouerNeo",
    alternativeText: Configuration.USER_TWITTER + " jouerNeo",
    mp3: "jouerNeo"
  }, {
    text: "merciParticipation",
    alternativeText: Configuration.USER_TWITTER + " merciParticipation",
    mp3: "merciParticipation"
  }, {
    text: "merciTweet",
    alternativeText: Configuration.USER_TWITTER + " merciTweet",
    mp3: "merciTweeT"
  }
];


