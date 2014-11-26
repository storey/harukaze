#pragma strict

// controls the user entering the meditative state (a paused state where they can activate abilities)

// is the user currently in the meditative state?
@HideInInspector
public var inMedState : boolean;

// how far the world should slowdown in the meditative state
private var slowSpeed : float; 

// get the HUD and the various pieces that appear as part of the mediative state
private var HUD : GameObject;
private var medView : GameObject;

// get various scripts that this script must interact with
// the script controlling the selections wheel and script that makes
// the pieces of the meditative state follow the user.
private var wheelScript : meditativeWheel;
private var followScript : HUDfollow;

// when the function wakes up
function Awake () 
{
    // set time to be stopped in the meditative state
    slowSpeed = 0.00;
    
    // get proper gameobjects and scripts
    HUD = GameObject.Find("HUD");
    medView = GameObject.Find("MeditativeState");
    
    wheelScript = GameObject.Find("EnzoWheel").GetComponent(meditativeWheel);
    followScript = GameObject.Find("MeditativeState").GetComponent(HUDfollow);
    
    // setup the necessary scripts, ass they will be immediately disabled
    wheelScript.setup();
    followScript.setup();
    
    // disable the various pieces of the meditative state
    medView.SetActive(false);
    
}

// if the left control is down, enter the meditative state
function Update () 
{
    if(Input.GetKeyUp(KeyCode.LeftControl))
    {
        inMedState = !inMedState;
    }

    if (inMedState && Time.timeScale != slowSpeed)
    {
        enterState();
    }
    else if (!inMedState && Time.timeScale != 1)
    {
        leaveState();
    }
}

// enter the meditative state
function enterState()
{
    // stop time
    Time.timeScale = slowSpeed;
        
    // deactive the HUD and activate the meditative state pieces
    HUD.SetActive(false);
    medView.SetActive(true);
    followScript.updatePosition();
        
    // reset the element wheel
    wheelScript.resetVars();
}

// leave the meditative state
function leaveState()
{
    
    // exit the meditative state
    inMedState = false;
    
    // return time to normal
    Time.timeScale = 1;
        
    // unhide the HUD and hide the meditative state pieces
    HUD.SetActive(true);
    medView.SetActive(false);
        
    // take appropriate action given the state of the wheel.
    wheelScript.finishState();
}