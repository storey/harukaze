#pragma strict

// controls the main starting screen and shifts it to the side when the user hits a key

// how long should it take for the screen to slide off?
var slideTime : float = 0.5;

// direction to slide;
var slideLeft : boolean = true;

// how far to move the screen each step
private var stepDistance : float;

// how many fixedUpdate steps it takes to fully remove the starting slide
private var numSteps : int;

// is the main menu showing? or is it not showing/sliding off
private var showing : boolean = true;

// this screen's transform
private var myTransform : Transform;

// holds the script for the main menu
private var menuScript : menuSelectionScript;

function Start () 
{
    // get the number of steps
    numSteps = Mathf.Floor(slideTime/Time.fixedDeltaTime);
    
    // calculate the distance the slide must travel and how far to travel each step
    var startSprite : Sprite = GetComponent(SpriteRenderer).sprite;
    // get it fully off the screen, with a little extra fudge
    var distance = startSprite.bounds.max.x - startSprite.bounds.min.x + 10.0;
    if (slideLeft)
    {
        distance *= -1.0;
    }
    stepDistance = distance / numSteps;
    
    
    myTransform = GetComponent(Transform);
    
    menuScript = GameObject.Find("MainMenu").GetComponent(menuSelectionScript);

}

function Update () 
{
    // check if the user presses a key, and if so start sliding the main menu off 
    if(showing && Input.anyKeyDown)
    {
        showing = false;
        menuScript.setActive(true);
        StartCoroutine(slideScreen());
    }
}

// rotate the circle the proper amount each fixed update
function slideScreen()
{
    for (var i : int = 0; i < numSteps; i++)
    {
        yield WaitForFixedUpdate;
        myTransform.position.x += stepDistance;
    }
}