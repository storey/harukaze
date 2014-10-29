#pragma strict

public var inMedState : boolean;

private var baseColor : Color;
private var medColor : Color;
private var slowSpeed : float;

function Start () 
{
    baseColor = Color(1, 1, 1, 1);
    medColor = Color(232/255.0, 126/255.0, 238/255.0, 1);
    slowSpeed = 0.00;
}

// if the left conrol is down, enter the meditative state by stopping time and
// changing the color of background sprites.
function Update () 
{
    if(Input.GetKeyUp(KeyCode.LeftControl))
    {
        inMedState = !inMedState;
    }

    var bgSprites;
    if (inMedState && Time.timeScale != slowSpeed)
    {
        Time.timeScale = slowSpeed;
        
        bgSprites = GameObject.FindGameObjectsWithTag("MeditativeBG");
        for (var bgSprite : GameObject in bgSprites)
        {
            bgSprite.GetComponent(SpriteRenderer).color = medColor;
        }
    }
    else if (!inMedState && Time.timeScale != 1)
    {
        Time.timeScale = 1;
        
        bgSprites = GameObject.FindGameObjectsWithTag("MeditativeBG");
        for (var bgSprite : GameObject in bgSprites)
        {
            bgSprite.GetComponent(SpriteRenderer).color = baseColor;
        }
    }
}