import AnimationPlayer from "./animation_player.js";

// Class for managing animations
class AnimationDatabase {
    // Constructor method
    constructor(mRenderable) {
        // Initialize the AnimationPlayer with a renderable object
        this.player = new AnimationPlayer(mRenderable);
        // Array to store animations
        this.animationStorage = [];
        // Index of the current animation being played
        this.activeAnimationIndex = 0;

        //interpolation data
        this.interpolationFunc = null;
        this.interpolationParam = null;
    }

    /**
     * Set the current animation by index.
     * @param {number} index - Index of the animation to set as current.
     */
    setActiveAnimation(index) {
        // Check if the provided index is invalid
        if (index + 1 > this.animationStorage.length || index < 0) {
            this.activeAnimationIndex = this.animationStorage.length - 1;
            return;
        }
        this.activeAnimationIndex = index;
    }

    /**
     * set the interpolation related data when play animation
     * @param {Array} param - array of param needed for provided function 
     * @param {Function} func - provided fnction for interpolation between frames
     */
    setInterpolation(param, func) {
        this.interpolationFunc = func;
        this.interpolationParam = param;
    }

    /**
     * Get all animations stored in the database.
     * @returns {Array} - Array of animations.
     */
    getAnimations() {
        return this.animationStorage;
    }

    /**
     * Get the currently active animation.
     * @returns {object} - The currently active animation.
     */
    getActiveAnimation() {
        return this.animationStorage[this.activeAnimationIndex];
    }

    /**
     * Get the index of the currently active animation.
     * @returns {number} - Index of the currently active animation.
     */
    getActiveAnimationIndex() {
        return this.activeAnimationIndex;
    }

    /**
     * Get the numbers of stored animations.
     * @returns {number} - numbers of stored animations.
     */
    getNumberOfAnimations() {
        return this.animationStorage.length;
    }

    /**
     * Add a new animation to the database.
     * @param {object} animation - The animation to add.
     */
    addAnimation(animation) {
        this.animationStorage.push(animation);
    }

    /**
     * Pause the currently playing animation.
     */
    pauseAnimation() {
        this.player.pause();
    }
    
    /**
     * Play the animation at the current index.
     */
    playAnimation(isLooping) {
        // Start playing the active animation using the AnimationPlayer
        this.player.start(this.animationStorage[this.activeAnimationIndex], isLooping);
    }

    /**
     * Check if there are any animations stored in the database.
     * @returns {boolean} - True if there are animations, otherwise false.
     */
    hasAnimation() {
        return this.animationStorage.length !== 0;
    }

    /**
     * Update player.
     */
    playerUpdate() {
        this.player.update(this.interpolationParam, this.interpolationFunc);
    }
}

// Export the AnimationDatabase class as the default export
export default AnimationDatabase;
