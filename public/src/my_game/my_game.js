"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        // The camera to view the scene
        this.mCamera = null;

        // a simple box to test with
        this.mBox1;

        // declaration of keyframer reference
        this.mKeyFramer;
        this.mMsg = null;
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(30, 27.5), // position of the camera
            120,                       // width of camera
            [0, 0, 768, 576]           // viewport (orgX, orgY, width, height)
        );

        // sets the background to gray
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        // initialization of simple box
        this.mBox1 = new engine.Renderable();
        this.mBox1.setColor([1,0,1,1]);
        this.mBox1.getXform().setSize(5,5);
        this.mBox1.getXform().setPosition(0, 0);

        this.mBox2 = new engine.Renderable();
        this.mBox2.setColor([1,1,0,1]);
        this.mBox2.getXform().setSize(5,5);
        this.mBox2.getXform().setPosition(0, 7);

        this.activeBox = this.mBox1;
        this.activeBoxName = "Box 1";

        this.moveSpeed = 1;

        // initialization of keyframer object
        this.mKeyFramer = new engine.KeyFramer();

        // add renderable to KeyFramer map
        this.mKeyFramer.setRenderable(this.mBox1);
        this.mKeyFramer.setRenderable(this.mBox2);

        // create new animation
        this.mKeyFramer.newAnimation(this.mBox1);
        this.mKeyFramer.newAnimation(this.mBox2);
        this.frameIndex = 0;
        this.animationIndex = 0;

        this.mMsg1 = new engine.FontRenderable("Next Frame Index(" + this.frameIndex + ")  Animation index(" + this.animationIndex + ")" );
        this.mMsg1.setColor([1, 1, 1, 1]);
        this.mMsg1.getXform().setPosition(-25,-12);
        this.mMsg1.setTextHeight(3);

        this.mMsg2 = new engine.FontRenderable("Current Box: "  + this.activeBoxName + "  Animation (" + (this.mKeyFramer.getActiveAnimationIndex(this.activeBox) + 1) + "/" + this.mKeyFramer.getNumberOfAnimations(this.activeBox) + "Array[" + this.getAnimationFramesArray(this.activeBox) + "]");
        this.mMsg2.setColor([1, 1, 1, 1]);
        this.mMsg2.getXform().setPosition(-25,-15);
        this.mMsg2.setTextHeight(3);
    }
    
    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
        this.mCamera.setViewAndCameraMatrix();

        this.mMsg1.draw(this.mCamera);
        this.mMsg2.draw(this.mCamera);

        this.mBox1.draw(this.mCamera);
        this.mBox2.draw(this.mCamera);
    }
    
    // The Update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update () {
        this.mKeyFramer.update();
        //add frame
        this.addNewFrame();
        this.deleteFrame(this.frameIndex - 1);

        // movement
        this.objectChange();

        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.mKeyFramer.pause();
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.mKeyFramer.play();
        }

        //change frame index
        this.changeFrameIndex(1);
        this.changeAnimationIndex(1);
        this.newAnimation();
        this.changeActiveAnimation();

        //go to frame number
        this.statusMessage();

        this.resetAnimation();
    }

   objectChange() {
        this.objectMovement(); 
        this.changeActiveBox();

        let delta = 1;
        if (engine.input.isKeyPressed(engine.input.keys.Z)) {
            delta = -1;
        }
        this.changeObjectSize(.1 * delta);
        this.changeObjectRotation(1 * delta);
        this.changeObjectColor(.05 * delta);
    }

    objectMovement() {
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            this.activeBox.getXform().incYPosBy(this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            this.activeBox.getXform().incYPosBy(-this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            this.activeBox.getXform().incXPosBy(this.moveSpeed);
        }
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            this.activeBox.getXform().incXPosBy(-this.moveSpeed);
        }
    }

    changeFrameIndex(delta) {
        if (engine.input.isKeyClicked(engine.input.keys.M)) {
            this.frameIndex += delta;
        }
        if (engine.input.isKeyClicked(engine.input.keys.N)) {
            //check if frame index is 0
            if(this.frameIndex == 0) return;
            this.frameIndex -= delta;
        }
    }

    changeAnimationIndex(delta) {
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            this.animationIndex += delta;
        }
        if (engine.input.isKeyClicked(engine.input.keys.V)) {
            //check if frame index is 0
            if(this.animationIndex == 0) return;
            this.animationIndex -= delta;
        }
    }

    newAnimation() {
        if (engine.input.isKeyClicked(engine.input.keys.F)) {
            this.mKeyFramer.newAnimation(this.activeBox);
        }
    }
    //Function to change object size
    changeObjectSize(deltaSize) {
        if (engine.input.isKeyPressed(engine.input.keys.O)) {
            this.activeBox.getXform().incSizeBy(deltaSize);
        }
       
    }

    //Function to change object rotation
    changeObjectRotation(deltaDegree) {
        if (engine.input.isKeyPressed(engine.input.keys.P)) {
            this.activeBox.getXform().incRotationByDegree(deltaDegree);
        }
    }

    changeObjectColor(delta) { 
        let color = this.activeBox.getColor();
        let keyPressed = false;

        if (engine.input.isKeyPressed(engine.input.keys.J)) {
            color[0] += delta;
            if(color[0] > 1) color[0] = 1;
            else if(color[0] < 0) color[0] = 0;
            keyPressed = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.K)) {
            color[1] += delta;
            if(color[1] > 1) color[1] = 1;
            else if(color[1] < 0) color[1] = 0;
            keyPressed = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.L)) {
            color[2] += delta;
            if(color[2] > 1) color[2] = 1;
            else if(color[2] < 0) color[2] = 0;
            keyPressed = true;
        }

        if (keyPressed) {
            this.activeBox.setColor([
                color[0],
                color[1],
                color[2],
                1.0
            ]);
        }
    }

    changeActiveBox() {
        if(engine.input.isKeyClicked(engine.input.keys.Ctrl)) {
            if (this.activeBox === this.mBox1) {
                this.activeBox = this.mBox2;
                this.activeBoxName = "Box 2"
            }
            else {
                this.activeBox = this.mBox1;
                this.activeBoxName = "Box 1`"
            }
        }
    }
S
    changeActiveAnimation() {
        if (engine.input.isKeyClicked(engine.input.keys.X)) {
            this.mKeyFramer.setActiveAnimation(this.activeBox, this.animationIndex);
        }
    }

    addNewFrame() {
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            this.mKeyFramer.getActiveAnimation(this.activeBox).addFrame(this.activeBox, this.frameIndex++);
        }
    }
    
    deleteFrame(index = null) {
        if (engine.input.isKeyClicked(engine.input.keys.E)) {
            this.mKeyFramer.getActiveAnimation(this.activeBox).deleteFrame(index);
        }
    }

    resetAnimation() {
        if (engine.input.isKeyClicked(engine.input.keys.Q)) {
            this.mKeyFramer.getActiveAnimation(this.activeBox).reset();
            this.frameIndex = 0;
        }
    }

    // message status
    statusMessage() {
        this.mMsg1.setText("Next Frame Index(" + this.frameIndex + ")  Animation index(" + this.animationIndex + ")");
        this.mMsg2.setText("Current Box: "  + this.activeBoxName + "  Animation (" + (this.mKeyFramer.getActiveAnimationIndex(this.activeBox) + 1) + "/" + this.mKeyFramer.getNumberOfAnimations(this.activeBox) + ") Array[" + this.getAnimationFramesArray(this.activeBox) + "]");
    }

    getAnimationFramesArray(renderable) {
        let animation = this.mKeyFramer.getActiveAnimation(renderable);
        let retVal = [];

        let current = animation.firstFrame;
        while (current) {
            retVal.push(current.frameIndex);
            current = current.next;
        }

        return retVal;
    }
}

window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}
