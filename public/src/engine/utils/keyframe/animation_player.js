/*
 * File: animation_player.js
 *       Encapsulates play back of animation class
 */
"use strict";

import SpriteAnimateRenderable from "../../renderables/sprite_animate_renderable.js";

class AnimationPlayer {
  /**
   * Create an AnimationPlayer.
   * @param {object} mRenderable - The renderable object associated with this AnimationPlayer.
   */
  constructor(mRenderable) {
    // should the animation be playing
    this.isPlaying = false;

    // exact frame, based off fps
    this.currentTick; 
    // prev key frame time
    this.currentFrame; 
    // next key frame time
    this.nextFrame;

    // list of all frames in the animation
    this.animation = null;

    // tells us to replay the animation
    this.isLooping = false;

    this.renderable = mRenderable;
  }

  /**
   * Update function to progress the animation playback.
   *  @param {Function} interpolation_func - The interpolation function given by the user
   *  @param {Array} [other_params=null] - Arrays of parameter use for given interpolation function 
   */
  update(other_params = null, interpolation_func = null) {
    //check if user want to use default linear interpolation or their own 
    if (interpolation_func !== null) return interpolation_func(this.animation, other_params);
    
    // if the animation is meant to be played
    if (!this.isPlaying ) return;
    // if the player does not have any frames
    if (this.animation.isEmpty()) return;
    // stop at final frame
    if (this.currentFrame.next === null) {
      // if the animation is looping go back to first frame
      if (this.isLooping) {
        this.start(this.animation, this.isLooping)

        // else stop playing
      } else {
        return this.pause();
      }
    }

    this.currentTick++;
    // dt is a float from 0 to 1, representing how far between key frames we are
    let dt = (this.currentTick - this.currentFrame.frameIndex) / 
    (this.nextFrame.frameIndex - this.currentFrame.frameIndex) ;

    // update each parameter based on how much between key frames we are 
    this.updatePlacementLinear(dt);
    this.updateSizeLinear(dt);
    this.updateRotationLinear(dt);
    this.updateColorLinear(dt);

    // if the renderable is sprite animated update additional param
    if (SpriteAnimateRenderable.prototype.isPrototypeOf(this.renderable)) {
      this.renderable.updateAnimation(); // Update animation
    }

    // increase key frame when current exact frame >= next key frame
    if (this.currentTick >= this.nextFrame.frameIndex){
      this.currentFrame = this.nextFrame;
      this.nextFrame = this.currentFrame.next;
    }
  }
  /**
   * Update the displacement of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updateSpriteLinear(dt){
    const currentFrameX = this.currentFrame.getXPos();
    const currentFrameY = this.currentFrame.getYPos();

    const nextFrameX = this.nextFrame.getXPos();
    const nextFrameY = this.nextFrame.getYPos();

    const dx = nextFrameX  - currentFrameX;
    const dy = nextFrameY - currentFrameY;

    // no change between frames
    if (dx == 0 && dy == 0) return;

    const newXPos = currentFrameX + dx * dt;
    const newYPos = currentFrameY + dy * dt;

    this.renderable.getXform().setXPos(newXPos);
    this.renderable.getXform().setYPos(newYPos);
  }


  /**
   * Update the displacement of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updatePlacementLinear(dt){
    const currentFrameX = this.currentFrame.getXPos();
    const currentFrameY = this.currentFrame.getYPos();

    const nextFrameX = this.nextFrame.getXPos();
    const nextFrameY = this.nextFrame.getYPos();

    const dx = nextFrameX  - currentFrameX;
    const dy = nextFrameY - currentFrameY;
    
    // no change between frames
    if (dx == 0 && dy == 0) return;

    const newXPos = currentFrameX + dx * dt;
    const newYPos = currentFrameY + dy * dt;

    this.renderable.getXform().setXPos(newXPos);
    this.renderable.getXform().setYPos(newYPos);
  }

  /**
   * Update the size of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updateSizeLinear(dt) {
    const currentFrameWidth = this.currentFrame.getWidth();
    const currentFrameHeight = this.currentFrame.getHeight();

    const nextFrameWidth = this.nextFrame.getWidth();
    const nextFrameHeight = this.nextFrame.getHeight();

    const dw = nextFrameWidth - currentFrameWidth;
    const dh = nextFrameHeight - currentFrameHeight;

    // no change between frames
    if (dw == 0 && dh == 0) return; 

    const newWidth = currentFrameWidth + dw * dt;
    const newHeight = currentFrameHeight + dh * dt;

    this.renderable.getXform().setWidth(newWidth);
    this.renderable.getXform().setHeight(newHeight);
  }

  /**
   * Update the rotation of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updateRotationLinear(dt) {
      const currentRotation = this.currentFrame.getRotationInDegree();
      const nextRotation = this.nextFrame.getRotationInDegree();

      const dr = nextRotation - currentRotation;
      
      // no change between frames
      if (dr == 0) return;

      const newRotation = currentRotation + dr * dt;

      this.renderable.getXform().setRotationInDegree(newRotation);
  }

  /**
   * Update the color of the renderable object based on linear interpolation.
   * @param {number} dt - The interpolation factor.
   */
  updateColorLinear(dt) {
    const currentR = this.currentFrame.getColor()[0];
    const currentG = this.currentFrame.getColor()[1];
    const currentB = this.currentFrame.getColor()[2];
    const currentA = this.currentFrame.getColor()[3];

    const nextR = this.nextFrame.getColor()[0];
    const nextG = this.nextFrame.getColor()[1];
    const nextB = this.nextFrame.getColor()[2];
    const nextA = this.nextFrame.getColor()[3];
    
    const dR = nextR - currentR;
    const dG = nextG - currentG;
    const dB = nextB - currentB;
    const dA = nextA - currentA;
    
    // no change between frames
    if (dR == 0 && dG == 0 && dB == 0 && dA == 0) return; 

    const newR = currentR + dR * dt;
    const newG = currentG + dG * dt;
    const newB = currentB + dB * dt;
    const newA = currentA + dA * dt;

    this.renderable.setColor([newR, newG, newB, newA]);
  }

  /**
   * Pause the animation playback.
   */
  pause(){
    this.isPlaying = false;
    this.isLooping = false;
  }

  /**
   * Start the animation playback with the given animation.
   * @param {object} animation - The animation to be played.
   */
  start(animation, isLooping){
    this.animation = animation;
    this.isLooping = isLooping;
    if(this.animation.isEmpty()) return;

    this.isPlaying = true;
    this.currentTick = 0;

    this.currentFrame = this.animation.getFirstFrame();
    this.nextFrame = this.currentFrame.next;
  }
}

export default AnimationPlayer;
