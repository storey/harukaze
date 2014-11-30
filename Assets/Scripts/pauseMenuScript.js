#pragma strict

// controls the pause screen and shifts it onto or off the screen as appropriate

// how long should it take for the screen to slide off?
var slideTime : float = 0.5;

// slide left initially?
var initiallySlideLeft : boolean = false;

// how far to move the screen each step
private var stepDistance : float;

// how many fixedUpdate steps it takes to fully remove the starting slide
private var numSteps : int;

// is the pause menu showing? or is it fully off the screenp
private var paused : boolean = false;

// can the game be paused?
private var canPause : boolean = false;

// this screen's transform
private var myTransform : Transform;

// holds the script for the main menu
private var menuScript : menuSelectionScript;

// the script for the character
private var charScript : characterControl;

function Start () 
{
    // get the number of steps
    numSteps = Mathf.Floor(slideTime/Time.fixedDeltaTime);
    
    // calculate the distance the slide must travel and how far to travel each step
    var startSprite : Sprite = GetComponent(SpriteRenderer).sprite;
    var distance = (startSprite.bounds.max.x - startSprite.bounds.min.x) * GetComponent(Transform).localScale.x;

    stepDistance = distance / numSteps;
    
    
    myTransform = GetComponent(Transform);
    
    menuScript = GameObject.Find("PauseSelectors").GetComponent(menuSelectionScript);
    
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);

}

function Update () 
{
    // check if the user presses a key, and if so start sliding the main menu off 
    if(canPause && !paused && Input.GetKeyDown(KeyCode.Escape))
    {
        charScript.setFrozen(true);
        paused = true;
        StartCoroutine(slideScreen(1));
    }
}

// slide a screen the proper amount each fixed update
function slideScreen(dir : int)
{
    for (var i : int = 0; i < numSteps; i++)
    {
        yield WaitForFixedUpdate;
        myTransform.position.x += dir*stepDistance;
    }
    if (dir == 1)
    {
        menuScript.setActive(true);
    }
    else if (dir == -1)
    {
        paused = false;
        charScript.setFrozen(false);
    }
}

// return whether the game is paused
function isPaused()
{
    return paused;
}

// set whether the game can be paused
function setCanPause(p : boolean)
{
    canPause = p;
}