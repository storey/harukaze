#pragma strict

private var myCollider : EdgeCollider2D;

private var myY : float;

private var charTransform : Transform;


private var charScript : characterControl;

private var fudgeFactor : float = 0.1f;

private var mySlope : float;
private var myConstant: float;

private var circleOffsetY: float;

// calculate a variety of necessary constants to allow quick determination of
// whether the player is above the diagonal platform
function Start() 
{
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
    
    circleOffsetY = charScript.circleColliderYOffset;
    
    var angle: float = (transform.eulerAngles.z)*(Mathf.Deg2Rad);
    mySlope = Mathf.Tan(angle);
    
    
    var xDif : float = Mathf.Cos(angle+(Mathf.PI/2)) * (charScript.circleColliderRadius);
    var yDif : float = Mathf.Sin(angle+(Mathf.PI/2)) * (charScript.circleColliderRadius);
    
    
    var baseX : float = transform.position.x;
    var baseY : float = transform.position.y;
    

    myConstant = mySlope * (baseX + xDif) - (baseY + yDif);
    
    
    myCollider = GetComponent(EdgeCollider2D);
    myCollider.enabled = false;


    charTransform = GameObject.Find("Masaru").GetComponent(Transform);
}

function Update() 
{
    

}

// handle physics updates
function FixedUpdate()
{
    var charY : float = charTransform.position.y;
    var charX : float = charTransform.position.x;
    // if the player is below the platform and it is enabled, disable it
    if (myCollider.enabled && ((mySlope * charX) - charY - fudgeFactor) > myConstant)
    {
        myCollider.enabled = false;
    }
    // if the player is above the platform and it is disabled, enable it
    else if (!myCollider.enabled && ((mySlope * charX) - charY + fudgeFactor) < myConstant)
    {
        Debug.Log(charY +"," + circleOffsetY);
        myCollider.enabled = true;
    }
}