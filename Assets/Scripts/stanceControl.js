#pragma strict

// controls the view of the user's stance

// the sprites with the elemental form pictures
var earthSprite : Sprite;
var waterSprite : Sprite;
var fireSprite : Sprite;
var windSprite : Sprite;
var heavenSprite : Sprite;
// an array holding the sprites
private var sprites : Sprite[];

// my sprite renderer
private var mySpriteRenderer : SpriteRenderer; 

// holds the meditative state script to figure out whether we are in the meditative state.
private var meditativeScript : MeditativeStateController;

// initialize the sprites array with all of the sprites
function Start () 
{
    mySpriteRenderer = GetComponent("SpriteRenderer");
    meditativeScript = GameObject.Find("MeditativeStateManager").GetComponent(MeditativeStateController);
    sprites = new Sprite[5];
    sprites[0] = earthSprite;
    sprites[1] = waterSprite;
    sprites[2] = fireSprite;
    sprites[3] = windSprite;
    sprites[4] = heavenSprite;
}

function Update () 
{
    /* for testing 
    if(meditativeScript.inMedState)
    {
        if(Input.GetKeyUp(KeyCode.Q))
        {
            changeStance(0);
        }
        else if(Input.GetKeyUp(KeyCode.W))
        {
            changeStance(1);
        }
        else if(Input.GetKeyUp(KeyCode.E))
        {
            changeStance(2);
        }
        else if(Input.GetKeyUp(KeyCode.R))
        {
            changeStance(3);
        }
        else if(Input.GetKeyUp(KeyCode.T))
        {
            changeStance(4);
        }
    }*/
}

// changes the stance state based on the input integer
// 0 is Earth, 1 is Water, 2 is Fire, 3 is Wind, 4 is Heaven
function changeStance(N : int)
{
    if ( N < 0 || N > 4)
    {
        Debug.Log("Invalid Stance");
    }
    else
    {
        mySpriteRenderer.sprite = sprites[N];
    }
}