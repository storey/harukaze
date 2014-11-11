#pragma strict

public var inMedState : boolean;

private var baseColor : Color;
private var medColor : Color;
private var slowSpeed : float; 

private var HUD : GameObject;
private var medView : GameObject;

private var wheelScript : meditativeWheel;
private var timerScript : enzoTimerScript;
private var followScript : HUDfollow;

function Awake () 
{
    baseColor = Color(1, 1, 1, 1);
    medColor = Color(232/255.0, 126/255.0, 238/255.0, 1);
    slowSpeed = 0.00;
    
    HUD = GameObject.Find("HUD");
    medView = GameObject.Find("MeditativeState");
    
    wheelScript = GameObject.Find("EnzoWheel").GetComponent(meditativeWheel);
    timerScript = GameObject.Find("EnzoTimer").GetComponent(enzoTimerScript);
    followScript = GameObject.Find("MeditativeState").GetComponent(HUDfollow);
    
    wheelScript.setup();
    timerScript.setup();
    followScript.setup();
    
    medView.SetActive(false);
    
}

// if the left conrol is down, enter the meditative state by stopping time and
// changing the color of background sprites.
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
    var bgSprites;
    
    Time.timeScale = slowSpeed;
        
    HUD.SetActive(false);
    medView.SetActive(true);
    followScript.updatePosition();
        
    wheelScript.resetVars();
        
    bgSprites = GameObject.FindGameObjectsWithTag("MeditativeBG");
    for (var bgSprite : GameObject in bgSprites)
    {
        bgSprite.GetComponent(SpriteRenderer).color = medColor;
    }
    
    timerScript.resetTimer();
    timerScript.startTimer();
}

// leave the meditative state
function leaveState()
{
    timerScript.stopTimer();
    
    inMedState = false;
    
    var bgSprites;
    
    Time.timeScale = 1;
        
    HUD.SetActive(true);
    medView.SetActive(false);
        
    bgSprites = GameObject.FindGameObjectsWithTag("MeditativeBG");
    for (var bgSprite : GameObject in bgSprites)
    {
        bgSprite.GetComponent(SpriteRenderer).color = baseColor;
    }
    
    wheelScript.finishState();
}