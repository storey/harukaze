#pragma strict


// the sprites with the elemental form pictures
var earthSprite : Sprite;
var waterSprite : Sprite;
var fireSprite : Sprite;
var windSprite : Sprite;
var heavenSprite : Sprite;

// basic empty sprite
var baseSprite : Sprite;


private var enzo0 : Transform;
private var enzo1 : Transform;
private var enzo2 : Transform;
private var enzo3 : Transform;
private var enzo4 : Transform;

private var rotating: boolean;

var animationTime : float = 0.4;

private var numFrames : int;

private var fraction : float = 72;

private var stepDegree : float;

private var currentSelection : int;


private var sprites : Sprite[];

private var results : int[];

// holds the meditative state script to figure out whether we are in the meditative state.
private var meditativeScript : MeditativeStateController;

private var stanceScript : stanceControl;

// get variables for the 5 circles inside the wheel
function setup () 
{
    results = new int[5];
    for (var i : int; i < 5; i++)
    {
        results[i] = -1;
    }
    sprites = new Sprite[5];
    sprites[0] = earthSprite;
    sprites[1] = waterSprite;
    sprites[2] = fireSprite;
    sprites[3] = windSprite;
    sprites[4] = heavenSprite;
    
    enzo0 = GameObject.Find("EnzoWheelEnzo0").GetComponent(Transform);
    enzo1 = GameObject.Find("EnzoWheelEnzo1").GetComponent(Transform);
    enzo2 = GameObject.Find("EnzoWheelEnzo2").GetComponent(Transform);
    enzo3 = GameObject.Find("EnzoWheelEnzo3").GetComponent(Transform);
    enzo4 = GameObject.Find("EnzoWheelEnzo4").GetComponent(Transform);
    
    currentSelection = 0;
    
    
    numFrames = Mathf.Floor(animationTime/Time.fixedDeltaTime);
    
    stepDegree = fraction / numFrames;
    
    rotating = false;
    
    meditativeScript = GameObject.Find("MeditativeStateManager").GetComponent(MeditativeStateController);
    stanceScript = GameObject.Find("currentStance").GetComponent(stanceControl);
}

function Update () 
{
    if(meditativeScript.inMedState)
    {
        if(!rotating)
        {
            if(Input.GetKeyUp(KeyCode.Q))
            {
                startRotation(0);
            }
            else if(Input.GetKeyUp(KeyCode.W))
            {
                startRotation(1);
            }
            else if(Input.GetKeyUp(KeyCode.E))
            {
                startRotation(2);
            }
            else if(Input.GetKeyUp(KeyCode.R))
            {
                startRotation(3);
            }
            else if(Input.GetKeyUp(KeyCode.T))
            {
                startRotation(4);
            }
        }
    }
}

// resets various variables upon entering the meditative state
function resetVars()
{    
    for (var i : int; i < 5; i++)
    {
        results[i] = -1;
    }
    
    currentSelection = 0;
    
    transform.eulerAngles.z = 0;
    enzo0.eulerAngles.z = 0;
    enzo1.eulerAngles.z = 0;
    enzo2.eulerAngles.z = 0;
    enzo3.eulerAngles.z = 0;
    enzo4.eulerAngles.z = 0;
    
    var renderer : SpriteRenderer;
    renderer = enzo0.gameObject.GetComponent("SpriteRenderer");
    renderer.sprite = baseSprite;
    renderer = enzo1.gameObject.GetComponent("SpriteRenderer");
    renderer.sprite = baseSprite;
    renderer = enzo2.gameObject.GetComponent("SpriteRenderer");
    renderer.sprite = baseSprite;
    renderer = enzo3.gameObject.GetComponent("SpriteRenderer");
    renderer.sprite = baseSprite;
    renderer = enzo4.gameObject.GetComponent("SpriteRenderer");
    renderer.sprite = baseSprite;
    
}

// finish this meditative state
function finishState()
{
    if (results[0] != -1)
    {
        stanceScript.changeStance(results[0]);
    }
}

// begins the rotation by 1/5 of a circle
function startRotation(Element : int)
{
    var renderer : SpriteRenderer = GameObject.Find("EnzoWheelEnzo" + currentSelection).GetComponent("SpriteRenderer");
    renderer.sprite = sprites[Element];   
    
    results[currentSelection] = Element;

    currentSelection++;
    if (currentSelection < 5)
    {
        rotating = true;
        StartCoroutine(rotateCircle());
    }
    else
    {
        meditativeScript.leaveState();
    }
}

// rotate the circle the proper amount
function rotateCircle()
{
    for (var i : int = 0; i < numFrames; i++)
    {
        yield WaitForFixedUpdate;
        transform.Rotate(Vector3.forward * stepDegree);
        enzo0.Rotate(Vector3.back * stepDegree);
        enzo1.Rotate(Vector3.back * stepDegree);
        enzo2.Rotate(Vector3.back * stepDegree);
        enzo3.Rotate(Vector3.back * stepDegree);
        enzo4.Rotate(Vector3.back * stepDegree);
    }
    rotating = false;
}
