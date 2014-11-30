#pragma strict
// Controls Angled Platforms. Currently Depricated, and don't allow the user to hang off the platform. May be updated later if necessary.

// the collider for this platform
private var myCollider : EdgeCollider2D;

// the transform for the character
private var charTransform : Transform;
// the script for the character
private var charScript : characterControl;

// fudge used to make sure user is completely above/below the platform
private var fudgeFactor : float = 0.1f;

// slope of the platform
private var mySlope : float;
// b, where m*x + b = y
private var myConstant: float;

// offest of the user's circle
private var circleOffsetY: float;

// allows the user to fall through the platform
private var fallingThrough : boolean;

// calculate a variety of necessary constants to allow quick determination of
// whether the player is above the diagonal platform
function Start() 
{
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
    
    var scale : float = GameObject.Find("Masaru").GetComponent(Transform).localScale.y;
    circleOffsetY = charScript.circleColliderYOffset*scale;
    var cCR : float = charScript.circleColliderRadius*scale;
    
    var angle: float = (transform.eulerAngles.z)*(Mathf.Deg2Rad);
    mySlope = Mathf.Tan(angle);
    
    
    var xDif : float = Mathf.Cos(angle+(Mathf.PI/2)) * (cCR);
    var yDif : float = Mathf.Sin(angle+(Mathf.PI/2)) * (cCR);
    
    
    var baseX : float = transform.position.x;
    var baseY : float = transform.position.y;
    

    myConstant = mySlope * (baseX + xDif) - (baseY + yDif);
    
    
    myCollider = GetComponent(EdgeCollider2D);
    myCollider.enabled = false;


    charTransform = GameObject.Find("Masaru").GetComponent(Transform);
}

// handle physics updates
function FixedUpdate()
{
    var charY : float = charTransform.position.y + circleOffsetY;
    var charX : float = charTransform.position.x;
    var temp : float = ((mySlope * charX) - charY);
    // if the player is below the platform and it is enabled, disable it
    if (myCollider.enabled && (temp - fudgeFactor) > myConstant)
    {
        myCollider.enabled = false;
    }
    else if (!myCollider.enabled && fallingThrough && (temp - fudgeFactor) > myConstant)
    {
        fallingThrough = false;
    }
    // if the player is above the platform and it is disabled, enable it
    else if (!myCollider.enabled && !fallingThrough && (temp + fudgeFactor) < myConstant)
    {
        myCollider.enabled = true;
    }
}

// allow the user to fall through the platform
function fallThrough()
{
    myCollider.enabled = false;
    fallingThrough = true;
}