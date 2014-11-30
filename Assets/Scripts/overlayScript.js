#pragma strict


// how long should it take for the screen to fadeOut?
var fadeTime : float = 0.5;

// how much to fade the screen each step
private var stepFade : float;

// how many fixedUpdate steps it takes to fully remove the starting slide
private var numSteps : int;

// is the overlay fully showing? or is it not showing/fading out
private var showing : boolean = true;

// this overlay's sprite renderer
private var sr : SpriteRenderer;

// the script for the character
private var charScript : characterControl;

// get the script to check whether the game is paused
private var pauseScript : pauseMenuScript;

function Start () 
{
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
    
    // freeze the character in place to start
    charScript.setFrozen(true);

    sr = GetComponent(SpriteRenderer);
    sr.color = new Color(1, 1, 1, 1);
    
    
    // get the number of steps
    numSteps = Mathf.Floor(fadeTime/Time.fixedDeltaTime);
    
    stepFade = 1.0/numSteps;
    
    // get the pause script
    pauseScript = GameObject.Find("PauseMenu").GetComponent(pauseMenuScript);
    
}

function Update () 
{
    // check if the user presses a key, and if so start fading the screen out
    if(showing && Input.anyKeyDown)
    {
        showing = false;
        StartCoroutine(fadeScreen());
    }
}

// fade a screen the proper amount each fixed update
function fadeScreen()
{
    for (var i : int = 0; i < numSteps; i++)
    {
        yield WaitForFixedUpdate;
        sr.color = new Color(1, 1, 1, 1-(i*stepFade));
    }
    charScript.setFrozen(false);
    pauseScript.setCanPause(true);
}