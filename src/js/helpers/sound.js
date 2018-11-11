import Configuration from "../config/configuration";
import logger from "../helpers/log";

/**
 * Renvoie un nombre aléatoire compris entre le min et le max.
 *
 * @param min le nombre minimum
 * @param max le nombre maximum
 * @returns {*} un nombre alétoire
 */
export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const chooseSound = (tweet) => {
  let result = Configuration
    .easterEggs
    .find(function(sound) {
      return tweet
        .text
        .startsWith(sound.text) || tweet
        .text
        .startsWith(sound.alternativeText);
    });

  if (!result) {
    // On n'a pas trouvé de son "spécial easter egg" Il faut du coup choisir un son au hasard
    let indice = getRandomInt(0, Configuration.sounds.length - 1);
    result = Configuration.sounds[indice].mp3;
  } else {
    result = result.mp3;
  }
  return result;
}

