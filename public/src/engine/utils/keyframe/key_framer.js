/**
 * File: key_framer.js
 * Description: Encapsulates key frame animation functionality
 */

"use strict";

import AnimationDatabase from "./animation_database.js";
import Animation from "./animation.js";

/**
 * Class representing a KeyFramer for managing key frame animations.
 */
class KeyFramer {
  /**
   * Create a KeyFramer.
   */
  constructor() {
    // Map to store renderables and their associated animations
    this.renderableMap = new Map();
  }

  /**
   * Add a renderable to the renderable map.
   * @param {object} mRenderable - The renderable object to be added.
   * @returns {boolean} - Returns true if the renderable is successfully added, otherwise false.
   */
  setRenderable(mRenderable) {
    // Check if renderable is null
    if (mRenderable === null) return false;

    let database = new AnimationDatabase(mRenderable);
    // Use reference to renderable as key and store an empty list of animations
    this.renderableMap.set(mRenderable, database);

    return true;
  }

  /**
   * Get animations associated with the renderable.
   * @param {object} mRenderable - The renderable object.
   * @returns {array|null} - An array of animations associated with the renderable, or null if renderable is null.
   */
  getAnimations(mRenderable) {
    if (!this.renderableMap.has(mRenderable)) return null;

    let database = this.renderableMap.get(mRenderable);

    return database.getAnimations();
  }

  /**
   * Get the active animation associated with the renderable.
   * @param {object} mRenderable - The renderable object.
   * @returns {Animation|null} - The active animation associated with the renderable, or null if renderable is null or no active animation exists.
   */
  getActiveAnimation(mRenderable) {
    if (!this.renderableMap.has(mRenderable)) return null;

    let database = this.renderableMap.get(mRenderable);
    if (!database.hasAnimation()) return null;

    return database.getActiveAnimation();
  }

  /**
   * Get number of animations the associated with the renderable.
   * @param {object} mRenderable - The renderable object.
   * @returns {number} - Number of animations associated with the renderable, return -1 if renderable is null.
   */
  getNumberOfAnimations(mRenderable) {
    if (!this.renderableMap.has(mRenderable)) return -1;

    let database = this.renderableMap.get(mRenderable);

    return database.getNumberOfAnimations();
  }

  /**
   * Get the index of the active animation associated with the renderable.
   * @param {object} mRenderable - The renderable object.
   * @returns {number|null} - The index of the active animation associated with the renderable, or null if renderable is null or no active animation exists.
   */
  getActiveAnimationIndex(mRenderable) {
    if (!this.renderableMap.has(mRenderable)) return null;

    let database = this.renderableMap.get(mRenderable);
    return database.getActiveAnimationIndex();
  }

  /**
   * Set the active animation for the renderable.
   * @param {object} mRenderable - The renderable object.
   * @param {number} index - The index of the animation to set as active.
   * @returns {void}
   */
  setActiveAnimation(mRenderable, index) {
    // Check if renderable is null
    if (mRenderable === null) return;

    // Check if map already has renderable
    if (!this.renderableMap.has(mRenderable)) return;

    this.renderableMap.get(mRenderable).setActiveAnimation(index);
  }

  /**
     * set the interpolation related data when play animation
     * 
     * @param {object} mRenderable - The renderable object
     * @param {Array} param - array of param needed for provided function 
     * @param {Function} func - provided fnction for interpolation between frames
     */
  setInterpolation(mRenderable, param, func) {
    // Check if renderable is null
    if (mRenderable === null) return;

    // Check if map already has renderable
    if (!this.renderableMap.has(mRenderable)) return;

    this.renderableMap.get(mRenderable).setInterpolation(param, func)
  }

  /**
   * Create a new animation and add it to the renderable map.
   * @param {object} mRenderable - The renderable object for which the animation is created.
   * @returns {Animation|null} - The newly created animation, or null if renderable is null.
   */
  newAnimation(mRenderable) {
    // Check if renderable is null
    if (mRenderable === null) return null;

    // Check if map already has renderable
    if (!this.renderableMap.has(mRenderable)) this.setRenderable(mRenderable);
    // Other safety check here? Ensure renderable is renderable

    // Create a new animation
    let toAdd = new Animation();

    // Add the new animation to the list
    this.renderableMap.get(mRenderable).addAnimation(toAdd);

    return toAdd;
  }

  /** Animation Player related functions */
  /**
   * Update all animations for every renderable stored.
   * @returns {void}
   */
  update() {
    for (let database of this.renderableMap.values()) {
      database.playerUpdate();
    }
  }

  /**
   * Play the current animation for every renderable stored.
   * @returns {void}
   */
  play() {
    for (let database of this.renderableMap.values()) {
      database.playAnimation(false);
    }
  }

  /**
   * Play the current animation for every renderable stored.
   * Loop for as long a isLooping is true
   * @returns {void}
   */
  playLooping() {
    for (let database of this.renderableMap.values()) {
      database.playAnimation(true);
    }
  }

  /**
   * Pause animation for every renderable stored.
   * @returns {void}
   */
  pause() {
    for (let database of this.renderableMap.values()) {
      database.pauseAnimation();
    }
  }
}

export default KeyFramer;
