import React, { Component } from 'react'
import './hanoi.css'
import { Grid, Button } from 'semantic-ui-react'

var motionstate = {
    up: 0, across: 1, down: 2, idle: 3,
}; //motionstate of discs

//////////////////////////////////////////////////////////
// Variables and Constants
const MAXDISCS = 10; ///< Maximum number of discs allowed.
const MINDISCS = 3; ///< Maximum number of discs allowed.
const defaultNumDiscs = 5; ///< Default number of discs when first loaded.
const canvasWidth = 800; ///< Canvas width in pixels.
const canvasHeight = 600; ///< Canvas height in pixels.
const bigdiscWidth = 180; ///< Width of the biggest disc in pixels.
const smalldiscWidth = 60; ///< Width of the smallest disc in pixels.
const pegX = [160, 400, 640]; ///< X coordinates of pegs in pixels.
const pegY = 536; ///< Y coordinates of all pegs.

var movesSinceReset = 0; ///< Number of moves since puzzle was reset.
var showMoveCount = true; ///< Whether to show movesSinceLastReset on screen.
var animationState = motionstate.idle; ///< Current animation state.
var myclock = 0; ///< Time stamp for Euler integration.
var numDiscs; ///< Number of discs.
var pegHt; ///< Height of pegs in pixels. Varies with number of discs.
var curDisc; ///< Current disc.
var dragDisc = -1; ///< Disc currently being dragged by mouse, negative if none.
var discX = new Array(MAXDISCS); ///< X coordinates of discs.
var discY = new Array(MAXDISCS); ///< Y coordinates of discs.
var animating = true; ///< True if animating disc motion.
var userPlay = false; ///< True if the user is trying to solve the puzzle themselves.
var discWidth = new Array(MAXDISCS); ///< Width of each disc, varies with number of discs.
var discHeight = 39; ///< Height of all discs in pixels, varies with number of discs.
var nearestPeg = -1; ///< Index of peg closest to dragDisc in player mode, negative if none.
var floatHeight; ///< Height in pixels that disc will float up to in auto solve. Should be above pegs.
var puzzle = new Array(3); ///< Stack of discs on each peg, with a sentinel at the bottom.
var count = new Array(3); ///< Number of discs on each peg.
var onPeg = new Array(MAXDISCS); ///< Which peg each disc is on.
var onPegTemp = new Array(MAXDISCS); ///< Which peg each disc is on, for temporary use.
var srcPeg = 0; ///< Index of source peg for current move in autosolve.
var destPeg = 0; ///< Index of destination peg for current move in autosolve.
var moveArray; ///< Array of moves for autosolve. 
var requiredMoves; ///< Number of moves used by autosolve. Recomputed when number of discs changes.
var curMove; ///< Current move for autosolve, index into moveArray.
var numMoves; ///< Number of moves in moveArray.
var speed = 2.0; ///< Speed factor for animation. Changes with radio buttons. Set to at least 8.0 for jump animation.
var colorArray = [  ///< Array of disc colors. Make sure this is large enough.
    'rgba(255, 60, 60, 255)',
    'rgba(44, 205, 44, 255)',
    'rgba(80, 160, 255, 255)',
    'rgba(255, 128, 255, 255)',
    'rgba(128, 255, 255, 255)',
    'rgba(255, 255, 64, 255)',
    'rgba(173, 64, 255, 255)',
    'rgba(198, 255, 24, 255)',
    'rgba(255, 168, 64, 255)',
    'rgba(200, 200, 255, 255)'
];
var singleMove = false; ///< True if the animation stops after one step.
var delayTime = 0; ///< Delay to wait between moves when doing jump animation.
var startDelayTime = 0; ///< Last time we did a jump animation. step

//////////////////////////////////////////////////////////
// Functions

/// \brief Towers of Hanoi solve from any initial state.
/// This is the standard recursive algorithm for the Towers of Hanoi modified to
/// work from any legal start state.
/// \param dest Index of destination peg.
/// \param d Move discs 0..d to the destination peg.

function moveDiscs(dest, d) {
    while (d >= 0 && onPegTemp[d] == dest) --d; //skip large discs already on destination peg

    if (d >= 0) {
        var src = onPegTemp[d]; //source peg
        var work = 3 - src - dest; //work peg

        moveDiscs(work, d - 1); //move discs 0..d-1 to work peg

        //move disc d to destination peg
        moveArray[numMoves++] = [src, dest]; //record in move array to be played later
        onPegTemp[d] = dest; //record in temporary peg array

        moveDiscs(dest, d - 1); //move discs 0..d-1 to destination peg
    } //if
} //moveDiscs

///brief Compute the move array from the current puzzle state.

function computeMoveArray() {
    //create a temporary copy of the onPeg array
    for (var i = 0; i < numDiscs; i++)
        onPegTemp[i] = onPeg[i];
    numMoves = 0;

    moveDiscs(2, numDiscs - 1);

    //get ready to execute the solution in moveArray
    curMove = 0;
    srcPeg = moveArray[curMove][0];
    destPeg = moveArray[curMove][1];
    curDisc = puzzle[srcPeg][count[srcPeg]];
} //computeMoveArray

/// \brief Reset the current time.
/// Reset the global variable myclock to the fractional part of the current time in seconds,
/// with millisecond resolution. 

function resetTime() {
    var time = new Date();
    myclock = time.getMilliseconds() / 1000.0;
} //resetTime

/// \brief Reset the puzzle to its initial state.
/// Resets various global variables to encode the initial state
/// of the puzzle, with all discs correctly stacked on peg 0. 
/// Assumes that moveArray has already been computed.

function resetPuzzle() {
    animating = false;
    userPlay = false;
    animationState = motionstate.idle;
    movesSinceReset = 0;

    for (var i = 0; i < numDiscs; i++)
        onPeg[i] = 0;

    //initialize internal representation of puzzle
    count[0] = numDiscs;
    count[1] = count[2] = 0;
    puzzle[0][0] = puzzle[1][0] = puzzle[2][0] = numDiscs;
    for (var i = 1; i <= numDiscs; i++)
        puzzle[0][i] = numDiscs - i;

    //initialize x and y coordinate of discs on canvas
    for (var i = 0; i < numDiscs; i++) {
        discX[i] = pegX[0];
        discY[i] = pegY - (numDiscs - i - 1) * discHeight;
    } //for

    computeMoveArray();
} //resetPuzzle

/// \brief Change the number of discs.
/// Change various global variables to accommodate
/// a new number of discs.
/// \param n Number of discs.

function changeNumDiscs(n) {
    numDiscs = n;
    discHeight = 65 - 3 * numDiscs;
    movesSinceReset = 0;

    pegHt = (numDiscs + 1) * discHeight;
    floatHeight = pegY - pegHt - discHeight;
    var discWidthDelta = (bigdiscWidth - smalldiscWidth) / numDiscs;

    discWidth[numDiscs - 1] = bigdiscWidth;
    for (var i = numDiscs - 2; i >= 0; i--)
        discWidth[i] = discWidth[i + 1] - discWidthDelta;

    //set the play and step buttons
    document.getElementById('play').disabled = false;
    document.getElementById('step').disabled = false;
    document.getElementById('play').innerHTML = "Solve";
} //changeNumDiscs

/// \brief Main initialization function.
/// Initialize global variables for the first time. This is only
/// called when the page is reloaded.

function init() {
    for (var i = 0; i < 3; i++)
        puzzle[i] = new Array(MAXDISCS + 1);

    //compute number of moves solved, one less than a power of 2
    moveArray = new Array(8 * (Math.pow(2, MAXDISCS) - 1)); //extra eightfold space to be sure user hasn't screwed it up

    changeNumDiscs(defaultNumDiscs);
    resetPuzzle();

    var canvas = document.getElementById("canvas");
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;


    // document.getElementById('slow').checked = true;

    canvas.addEventListener('touchstart', touchStart, false);
    canvas.addEventListener('touchmove', touchMove, false);
    canvas.addEventListener('touchend', touchEnd, false);

    window.requestAnimationFrame(composeFrame);
} //init

/// \brief Move the current disc up.
/// \param delta Distance to move in pixels.

function moveUp(delta) {
    if (speed >= 8.0) { //jump to position
        var time = new Date();
        var now = time.getMinutes() * 60 + time.getSeconds() + time.getMilliseconds() / 1000.0;

        if (now - startDelayTime > delayTime) {
            startDelayTime = now;
            discX[curDisc] = pegX[destPeg];
            discY[curDisc] = pegY;
            animationState = motionstate.down;
        } //if
    } //if
    else { //smooth animation
        discY[curDisc] -= 0.8 * delta;
        if (discY[curDisc] <= floatHeight) {
            discY[curDisc] = floatHeight;
            animationState = motionstate.across;
        } //if
    } //else
} //moveUp


/// \brief Move the current disc across.
/// \param delta Distance to move in pixels.

function moveAcross(delta) {
    if (pegX[destPeg] > discX[curDisc]) { //moving right
        discX[curDisc] += delta;
        if (discX[curDisc] >= pegX[destPeg]) {
            discX[curDisc] = pegX[destPeg];
            animationState = motionstate.down;
        } //if
    } //if
    else if (pegX[destPeg] < discX[curDisc]) { //moving left
        discX[curDisc] -= delta;
        if (discX[curDisc] <= pegX[destPeg]) {
            discX[curDisc] = pegX[destPeg];
            animationState = motionstate.down;
        } //if
    } //else if
    else animationState = motionstate.down;
} //moveAcross

/// \brief Move the current disc down.
/// \param delta Distance to move in pixels.

function moveDown(delta) {
    discY[curDisc] += 1.5 * delta;

    var desiredHt = pegY - discHeight * (count[destPeg] - ((destPeg == srcPeg) ? 1 : 0));

    if (discY[curDisc] >= desiredHt) {
        discY[curDisc] = desiredHt;
        movesSinceReset++;

        if (userPlay || count[2] < numDiscs) { //not yet finished
            count[srcPeg]--;
            puzzle[destPeg][++count[destPeg]] = curDisc;
            onPeg[curDisc] = destPeg;

            if (userPlay || singleMove) {
                animating = false;
                singleMove = false;
                animationState = motionstate.idle;
                if (!userPlay) {
                    document.getElementById('play').innerHTML = "Solve";
                    document.getElementById('play').disabled = false;
                    document.getElementById('step').disabled = false;
                } //if
            } //if
            else animationState = count[2] < numDiscs ? motionstate.up : motionstate.idle;

            if (animationState == motionstate.idle && count[0] == numDiscs) {
                resetPuzzle();
                document.getElementById('play').disabled = false;
                document.getElementById('step').disabled = false;
            } //if 
            else if (!userPlay) {
                curMove++;
                if (count[2] < numDiscs) {
                    srcPeg = moveArray[curMove][0];
                    destPeg = moveArray[curMove][1];
                    curDisc = puzzle[srcPeg][count[srcPeg]];
                } //if
                else { //solved
                    document.getElementById('play').innerHTML = "Solve";
                    document.getElementById('play').disabled = true;
                    document.getElementById('step').disabled = true;
                } //else
            } //if
        } //if
        userPlay = false;
    } //if
} //moveDown

/// \brief Move the current disc.
/// Use Euler integration to move the current disc.

function move() {
    //compute frame time and motion delta
    var time = new Date();
    var now = time.getMilliseconds() / 1000.0;
    var dt = now - myclock;
    if (dt < 0.0) dt += 1.0;
    var delta = speed * dt * 400;
    myclock = now;

    if (delta > 0 && delta < 1000) { //time change must be reasonable
        switch (animationState) {
            case motionstate.up: moveUp(delta); break;
            case motionstate.across: moveAcross(delta); break;
            case motionstate.down: moveDown(delta); break;
        } //switch
    } //if
} //move

/// \brief Draw the discs.
/// \param ctx 2D context for canvas.

function drawDiscs(ctx) {
    for (var i = 0; i < numDiscs; i++) {
        ctx.save();
        ctx.lineWidth = 2;

        var grd = ctx.createLinearGradient(0, 0.75 * discHeight, 0, -discHeight);
        grd.addColorStop(1, colorArray[i]);
        // grd.addColorStop(0.1, 'black'); //shadow for illusion of curvature

        ctx.fillStyle = grd;
        ctx.translate(discX[i], discY[i]);

        //rounded ends
        ctx.beginPath();
        ctx.arc(-discWidth[i] / 2, -discHeight / 2, discHeight / 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(discWidth[i] / 2, -discHeight / 2, discHeight / 2, 0, 2 * Math.PI);
        ctx.fill();

        //rectangular body
        ctx.fillRect(-discWidth[i] / 2, -discHeight, discWidth[i], discHeight);

        ctx.restore();
    } //for
} //drawDiscs

/// \brief Draw the puzzle base and pegs.
/// Draw the rectangular base, and the pegs. The closest legal peg is
/// highlighted if appropriate.
/// \param ctx 2D context for canvas.

function drawBaseAndPegs(ctx) {
    const pegWidth = 28;
    const baseHt = 32;

    ctx.fillStyle = 'rgba(64, 58, 57, 1)';
    ctx.lineWidth = 3;

    //draw base
    ctx.fillRect(32, pegY, canvasWidth - 64, baseHt);

    //draw pegs
    for (var i = 0; i < 3; i++) {
        var grd = ctx.createLinearGradient(pegX[i] - pegWidth / 2, 0, pegX[i] + 2 * pegWidth, 0);
        grd.addColorStop(0, 'rgba(64, 58, 57, 1)');
        ctx.fillStyle = grd;
        ctx.fillRect(pegX[i] - pegWidth / 2, pegY - pegHt, pegWidth, pegHt);
    } //for

    //draw green box around nearest legal peg 
    if (nearestPeg >= 0 && nearestPeg <= 2) {
        ctx.strokeStyle = 'rgba(0, 255, 0, 255)'; //green
        ctx.strokeRect(pegX[nearestPeg] - pegWidth / 2, pegY - pegHt, pegWidth, pegHt);
        ctx.strokeStyle = 'black'; //back to default
    } //if
} //drawBaseAndPegs

// Display Moves and text on puzzle completion
function drawText(ctx) {
    ctx.fillStyle = 'gray';
    ctx.font = "20px Arial";
    ctx.textAlign = 'left';
    ctx.fillText("Moves: " + movesSinceReset, 15, 30);
    ctx.textAlign = 'center';

    // If Puzzle Solved (peg 3 contains 'numDiscs' discs)
    if (count[2] == numDiscs) {
        ctx.fillStyle = 'black';
        const x = canvasWidth / 2, y = (pegY - pegHt) / 2;
        ctx.font = "45px Arial";
        ctx.fillText("Puzzle Solved!", x, y - 30);
    }
}

function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.globalCompositeOperation = 'source-over';

    //clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // ctx.strokeStyle = 'black';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(0, 0, 800, 600);

    //draw
    drawText(ctx);
    drawBaseAndPegs(ctx);
    drawDiscs(ctx);

    window.requestAnimationFrame(composeFrame);
}

/// \brief Compose a frame of animation.

function composeFrame() {
    if (animating) move();
    draw();
} //composeFrame

/// \brief Begin animation the solution.
/// If we are animating already, pause. If we are starting animation
/// or are paused, then go for it.

function Solve() {
    //compute the moveArray and prepare to make the first move
    computeMoveArray();

    document.getElementById('step').disabled = true;
    document.getElementById('play').innerHTML = "Pause";
    singleMove = false;

    if (count[2] >= numDiscs) //solved
        resetPuzzle();
    else if (animating) { //pausing
        animating = false;
        resetTime();
        document.getElementById('step').disabled = false;
        document.getElementById('play').innerHTML = "Solve";
    } // else if
    else { //starting animation from scratch
        resetTime();
        animating = true;
        if (animationState == motionstate.idle) { //in case we are paused
            animationState = motionstate.up;
        } //if
    } //else
} //Solve

/// \brief Begin animation of a single step of the solution.

function Step() {
    //compute the moveArray and prepare to make the first move
    computeMoveArray();

    resetTime();
    singleMove = true;
    animating = true;

    if (animationState == motionstate.idle) {
        animationState = motionstate.up;
    } //if

    document.getElementById('step').disabled = true;
    document.getElementById('play').innerHTML = "Pause";
} //Step

//////////////////////////////////////////////////////////
// Button handlers.
function resetbuttonHandler() {
    resetPuzzle();
    document.getElementById('step').disabled = false;
    document.getElementById('play').disabled = false;
    document.getElementById('play').innerHTML = "Solve";
} //resetbuttonHandler

function morediscsButtonHandler() {
    if (numDiscs < MAXDISCS) {
        changeNumDiscs(numDiscs + 1);
        resetPuzzle();
    }
} //morediscsButtonHandler

function lessdiscsButtonHandler() {
    if (numDiscs > MINDISCS) {
        changeNumDiscs(numDiscs - 1);
        resetPuzzle();
    }
} //lessdiscsButtonHandler

//////////////////////////////////////////////////////////
// Animation Speed
function incSpeed() {
    if (speed <= 16.0) {
        speed += 2.0;
    }
}

function decSpeed() {
    speed -= 4.0;
    if (speed <= 1.0) {
        speed = 1.0;
    }
}

//////////////////////////////////////////////////////////
// Mouse handler functions.

/// \brief Process a dropped disc.
/// Assumes that dragDisc >= 0. This is to be used in the mouseup and
/// touchend event handlers.

function processDroppedDisc() {
    curDisc = dragDisc;
    animating = true;
    singleMove = true;
    resetTime();

    if (nearestPeg < 0) { //dropped without lifting from source peg
        destPeg = srcPeg;
        animationState = motionstate.down;
    } //else
    else animationState = motionstate.across;

    dragDisc = -1; //ain't dragging
    nearestPeg = -1; //so there's no nearest peg
} //processDroppedDisc

/// \brief Mouse button up handler.
/// Called whenever the mouse left button is released.
/// \param e Information from the mouse.

function mouseUp() {
    var canvas = document.getElementById("canvas");
    if (userPlay && dragDisc >= 0) {
        canvas.onmousemove = null;
        processDroppedDisc();
    } //if
} //mouseUp

/// \brief Process a dragged disc.
/// Assumes that dragDisc >= 0. This is to be used in the mousemove and
/// touchmove event handlers.

function processDraggedDisc(x, y) {
    var canvas = document.getElementById("canvas");

    switch (animationState) {
        case motionstate.up:
            discY[dragDisc] = y - canvas.offsetTop + discHeight / 2; //drag up or down only

            if (discY[dragDisc] <= pegY - pegHt)  //have we dragged it above the top of the peg yet?
                animationState = motionstate.across; //if so, start dragging across

            discY[dragDisc] = Math.min(discY[dragDisc], pegY - discHeight * (count[srcPeg] - 1)); //can't drag below original position 
            break;

        case motionstate.across:
            //horizontal drag
            discX[dragDisc] = x - canvas.offsetLeft;
            discX[dragDisc] = Math.max(discX[dragDisc], pegX[0]);
            discX[dragDisc] = Math.min(discX[dragDisc], pegX[2]);

            //vertical drag
            discY[dragDisc] = y - canvas.offsetTop + discHeight / 2;
            discY[dragDisc] = Math.max(discY[dragDisc], 1.5 * discHeight);
            discY[dragDisc] = Math.min(discY[dragDisc], pegY - pegHt);

            //make list of pegs with distances from dragged disc
            var distances = [[0, Math.abs(discX[dragDisc] - pegX[0])], //peg 0
            [1, Math.abs(discX[dragDisc] - pegX[1])], //peg 1
            [2, Math.abs(discX[dragDisc] - pegX[2])]];	//peg2

            distances.sort(function (a, b) { return a[1] - b[1] }); //sort peg list on distances

            //find the nearest legal peg using the sorted peg list
            nearestPeg = distances[0][0]; //try nearest first
            if ((puzzle[nearestPeg][count[nearestPeg]] < dragDisc) || !obeysRestrictions(onPeg[dragDisc], nearestPeg)) { //nearest one not legal	
                nearestPeg = distances[1][0]; //try second nearest next
                if ((puzzle[nearestPeg][count[nearestPeg]] < dragDisc) || !obeysRestrictions(onPeg[dragDisc], nearestPeg)) //second nearest one not legal	
                    if (obeysRestrictions(onPeg[dragDisc], distances[2][0]))
                        nearestPeg = distances[2][0];	 //the furthest away one must be ok  
                    else nearestPeg = onPeg[dragDisc];
            } //if	

            break;
    } //switch

    destPeg = nearestPeg; //destination peg is the nearest legal peg
} //processDraggedDisc

/// \brief Mouse move handler.
/// Called whenever the mouse moves.
/// \param e Information from the mouse.

function mouseMove(e) {
    if (dragDisc >= 0) //ignore if not dragging a disc currently
        processDraggedDisc(e.pageX, e.pageY);
} //mouseMove

/// \brief Check whether point is inside a disc along one dimension only.
/// \param x Coordinate of point.
/// \param c Center coordinate of disc.
/// \param r Radius of disc along one dimension.
/// \return True if x is within distance r from center.

/// \brief Check that a move obeys any restrictions that are in force.
/// \param src Source peg.
/// \param dest Destination peg.
/// \return true if a move from the source to the destination is legal under current motion restrictions.

function obeysRestrictions(src, dest) {
    return true;
} //obeysRestrictions


function inBounds(x, c, r) {
    return (x >= c - r) && (x <= c + r)
} //inBounds

/// \brief Check whether point is inside a disc.
/// \param x X coordinate of point.
/// \param y Y coordinate of point.
/// \return Index of disc that point is in, -1 if it isn't.

function pointInDisc(x, y) {
    for (var i = 0; i < numDiscs; i++)
        if (inBounds(x, discX[i], discWidth[i] / 2 + discHeight / 2) &&
            inBounds(y, discY[i], discHeight / 2)
        ) return i;
    return -1; //exited the for loop without finding one
} //pointInDisc

/// \brief Process a selected disc.
/// This is to be used in the mousedown and touchstart event handlers.
/// \param x X coordinate of mouse click or touch.
/// \param y Y coordinate of mouse click or touch.

function processSelectedDisc(x, y) {
    //prevent users from doing dumb things
    if (animating) return false; //don't click on a moving disc
    if (dragDisc >= 0) return false; //don't respond to click if focus has been lost and returned before releasing the mouse button

    //find the disc clicked on, if any 
    var canvas = document.getElementById("canvas");
    dragDisc = pointInDisc(x - canvas.offsetLeft, y - canvas.offsetTop + discHeight / 2);

    if (dragDisc >= 0 && animationState == motionstate.idle) { //click on disc and animation is idle  
        //find source peg
        if (discX[dragDisc] < (pegX[0] + pegX[1]) / 2)
            srcPeg = 0;
        else if (discX[dragDisc] < (pegX[1] + pegX[2]) / 2)
            srcPeg = 1;
        else srcPeg = 2;

        //only drag topmost disc on srcPeg
        if (puzzle[srcPeg][count[srcPeg]] == dragDisc) {
            userPlay = true;
            animating = false;
            animationState = motionstate.up;
        } //if
        else dragDisc = -1;
    } //if
} //processSelectedDisc

/// \brief Mouse button down handler.
/// Called whenever the mouse left button is pressed down.
/// \param e Information from the mouse.

function mouseDown(e) {
    processSelectedDisc(e.pageX, e.pageY);
    if (dragDisc >= 0) //click was inside a disc
        document.getElementById("canvas").onmousemove = mouseMove;
} //mouseDown

//////////////////////////////////////////////////////////////////////////////////
// Touch handler functions.

/// \brief Touch start handler.
/// Called whenever the user touches the canvas.
/// \param e Information from the touch.

function touchStart(e) {
    var touchobj = e.targetTouches[0]; //first touch point
    processSelectedDisc(parseInt(touchobj.pageX), parseInt(touchobj.pageY));
    e.preventDefault();
} //touchStart

/// \brief Touch move handler.
/// Called whenever the user slides their finger across the canvas.
/// \param e Information from the touch.

function touchMove(e) {
    if (dragDisc >= 0) { //ignore if not dragging a disc currently.  
        var touchobj = e.targetTouches[0]; //first touch point 
        processDraggedDisc(parseInt(touchobj.pageX), parseInt(touchobj.pageY));
    } //if
    e.preventDefault();
} //touchMove

/// \brief Touch end handler.
/// Called whenever the user lifts their finger from the canvas.
/// \param e Information from the touch.

function touchEnd(e) {
    if (userPlay && dragDisc >= 0)
        processDroppedDisc();
    e.preventDefault();
} //touchEnd


export class TowerOfHanoi extends Component {
    componentDidMount() {
        window.addEventListener('load', init());
    }

    render() {
        return (
            <>
                <div>
                    <div className='heading'>
                        {/* <Header id='heading' size='huge'>Towers Of Hanoi</Header> */}
                        <svg id='logo' width="548" height="52" viewBox="0 0 548 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M33.396 2.998V7.882H20.856V49H14.85V7.882H2.24399V2.998H33.396Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M61.645 49.462C57.377 49.462 53.483 48.472 49.963 46.492C46.443 44.468 43.649 41.674 41.581 38.11C39.557 34.502 38.545 30.454 38.545 25.966C38.545 21.478 39.557 17.452 41.581 13.888C43.649 10.28 46.443 7.486 49.963 5.506C53.483 3.482 57.377 2.47 61.645 2.47C65.957 2.47 69.873 3.482 73.393 5.506C76.913 7.486 79.685 10.258 81.709 13.822C83.733 17.386 84.745 21.434 84.745 25.966C84.745 30.498 83.733 34.546 81.709 38.11C79.685 41.674 76.913 44.468 73.393 46.492C69.873 48.472 65.957 49.462 61.645 49.462ZM61.645 44.248C64.857 44.248 67.739 43.5 70.291 42.004C72.887 40.508 74.911 38.374 76.363 35.602C77.859 32.83 78.607 29.618 78.607 25.966C78.607 22.27 77.859 19.058 76.363 16.33C74.911 13.558 72.909 11.424 70.357 9.92801C67.805 8.432 64.901 7.684 61.645 7.684C58.389 7.684 55.485 8.432 52.933 9.92801C50.381 11.424 48.357 13.558 46.861 16.33C45.409 19.058 44.683 22.27 44.683 25.966C44.683 29.618 45.409 32.83 46.861 35.602C48.357 38.374 50.381 40.508 52.933 42.004C55.529 43.5 58.433 44.248 61.645 44.248Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M150.49 2.998L137.158 49H130.426L119.734 11.974L108.646 49L101.98 49.066L89.1098 2.998H95.5118L105.544 42.004L116.632 2.998H123.364L133.924 41.872L144.022 2.998H150.49Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M163.068 7.882V23.26H179.832V28.21H163.068V44.05H181.812V49H157.062V2.932H181.812V7.882H163.068Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M215.122 49L204.166 30.19H196.906V49H190.9V2.998H205.75C209.226 2.998 212.152 3.592 214.528 4.78C216.948 5.968 218.752 7.574 219.94 9.598C221.128 11.622 221.722 13.932 221.722 16.528C221.722 19.696 220.798 22.49 218.95 24.91C217.146 27.33 214.418 28.936 210.766 29.728L222.316 49H215.122ZM196.906 25.372H205.75C209.006 25.372 211.448 24.58 213.076 22.996C214.704 21.368 215.518 19.212 215.518 16.528C215.518 13.8 214.704 11.688 213.076 10.192C211.492 8.696 209.05 7.948 205.75 7.948H196.906V25.372Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M269.506 49.462C265.238 49.462 261.344 48.472 257.824 46.492C254.304 44.468 251.51 41.674 249.442 38.11C247.418 34.502 246.406 30.454 246.406 25.966C246.406 21.478 247.418 17.452 249.442 13.888C251.51 10.28 254.304 7.486 257.824 5.506C261.344 3.482 265.238 2.47 269.506 2.47C273.818 2.47 277.734 3.482 281.254 5.506C284.774 7.486 287.546 10.258 289.57 13.822C291.594 17.386 292.606 21.434 292.606 25.966C292.606 30.498 291.594 34.546 289.57 38.11C287.546 41.674 284.774 44.468 281.254 46.492C277.734 48.472 273.818 49.462 269.506 49.462ZM269.506 44.248C272.718 44.248 275.6 43.5 278.152 42.004C280.748 40.508 282.772 38.374 284.224 35.602C285.72 32.83 286.468 29.618 286.468 25.966C286.468 22.27 285.72 19.058 284.224 16.33C282.772 13.558 280.77 11.424 278.218 9.92801C275.666 8.432 272.762 7.684 269.506 7.684C266.25 7.684 263.346 8.432 260.794 9.92801C258.242 11.424 256.218 13.558 254.722 16.33C253.27 19.058 252.544 22.27 252.544 25.966C252.544 29.618 253.27 32.83 254.722 35.602C256.218 38.374 258.242 40.508 260.794 42.004C263.39 43.5 266.294 44.248 269.506 44.248Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M326.539 2.998V7.882H306.541V23.392H322.777V28.276H306.541V49H300.535V2.998H326.539Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M386.831 2.998V49H380.825V28.144H357.395V49H351.389V2.998H357.395V23.194H380.825V2.998H386.831Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M424.278 38.77H404.214L400.518 49H394.182L410.814 3.262H417.744L434.31 49H427.974L424.278 38.77ZM422.562 33.886L414.246 10.654L405.93 33.886H422.562Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M477.727 49H471.721L447.565 12.37V49H441.559V2.932H447.565L471.721 39.496V2.932H477.727V49Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M508.821 49.462C504.553 49.462 500.659 48.472 497.139 46.492C493.619 44.468 490.825 41.674 488.757 38.11C486.733 34.502 485.721 30.454 485.721 25.966C485.721 21.478 486.733 17.452 488.757 13.888C490.825 10.28 493.619 7.486 497.139 5.506C500.659 3.482 504.553 2.47 508.821 2.47C513.133 2.47 517.049 3.482 520.569 5.506C524.089 7.486 526.861 10.258 528.885 13.822C530.909 17.386 531.921 21.434 531.921 25.966C531.921 30.498 530.909 34.546 528.885 38.11C526.861 41.674 524.089 44.468 520.569 46.492C517.049 48.472 513.133 49.462 508.821 49.462ZM508.821 44.248C512.033 44.248 514.915 43.5 517.467 42.004C520.063 40.508 522.087 38.374 523.539 35.602C525.035 32.83 525.783 29.618 525.783 25.966C525.783 22.27 525.035 19.058 523.539 16.33C522.087 13.558 520.085 11.424 517.533 9.92801C514.981 8.432 512.077 7.684 508.821 7.684C505.565 7.684 502.661 8.432 500.109 9.92801C497.557 11.424 495.533 13.558 494.037 16.33C492.585 19.058 491.859 22.27 491.859 25.966C491.859 29.618 492.585 32.83 494.037 35.602C495.533 38.374 497.557 40.508 500.109 42.004C502.705 43.5 505.609 44.248 508.821 44.248Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                            <path d="M545.856 2.998V49H539.85V2.998H545.856Z" stroke="white" stroke-width="2" mask="url(#path-1-outside-1)" />
                        </svg>

                    </div>

                    <div>
                        <Grid columns={3}>
                            <Grid.Row>
                                <Grid.Column>
                                    Play Control <br></br>
                                    <Button.Group>
                                        <Button icon='redo' onClick={() => Solve()} content='Run' id='play' />
                                        <Button icon='angle double right' onClick={() => Step()} content=' Step' id='step' />
                                        <Button icon='redo' onClick={() => resetbuttonHandler()} content='Reset' id='reset' />
                                    </Button.Group>
                                </Grid.Column>
                                <Grid.Column>
                                    Number Of Disc <br></br>
                                    <Button.Group>
                                        <Button icon='plus' onClick={() => morediscsButtonHandler()}>Add Disc</Button>
                                        <Button icon='minus' onClick={() => lessdiscsButtonHandler()}>Remove Disc</Button>
                                    </Button.Group>
                                </Grid.Column>
                                <Grid.Column>
                                    Animation Speed <br />
                                    <Button.Group>
                                        <Button icon='plus' onClick={() => incSpeed()}>+ Speed</Button>
                                        <Button icon='minus' onClick={() => decSpeed()}>- Speed</Button>
                                    </Button.Group>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <div>
                            <canvas onMouseOut="mouseUp();" style={{ cursor: 'pointer' }} id="canvas" width="800" height="600"></canvas>
                        </div>
                    </div>
                    <div>

                    </div>

                </div>
            </>
        )
    }
}

export default TowerOfHanoi
