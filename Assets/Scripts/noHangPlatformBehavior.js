#pragma strict

// this script controls platforms, allowing the user to jump through them on the way up but land on the way down,
// but does not allow hanging

// the edgecollider connected to this platform
private var myCollider : EdgeCollider2D;

// the y position of this platform's collider
private var myY : float;

// is the user choosing to fall through this platform?
private var fallingThrough : boolean = false;

// the transform of the player character
private var charTransform : Transform;

// the script controlling the character, used to call various hanging functions
private var charScript : characterControl;

// used to make sure that the player isn't just missing the platform
private var fudgeFactor : float = 0.00f;

// on startup, initialize various necessary things
function Start () 
{ 
    // get the character's script
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
    
    // halfsize used when player's anchor is not the bottom of the sprite
    //halfYSize = 0;
    // (-1*charScript.circleColliderYOffset + charScript.circleColliderRadius) * GameObject.Find("Masaru").GetComponent(Transform).localScale.y;
    
    // get my collider
    myCollider = GetComponent(EdgeCollider2D);
    
    // initialize the collider to a trigger, meaning the player can pass through it. this will be 
    // immediately changed in update if it is incorrect.
    myCollider.isTrigger = true;
    
    // the platform might not be exactly flat, so find the highest point and use that as the y position
    var arr = myCollider.points;
    var i : int;
    var max : float;
    max = 0f;
    for (i = 0; i < arr.length; i++)
    {
        max = Mathf.Max(max, arr[i].y);
    }
    
    // get the y position of this platform
    myY = GetComponent(Transform).position.y + max*GetComponent(Transform).localScale.y;
    
    // get the character's transform
    charTransform = GameObject.Find("Masaru").GetComponent(Transform);

}


// handle physics updates
function FixedUpdate()
{
    // get the player's position
    var charY = charTransform.position.y; 
    
    // if the platform is currently solid and the player is below it, change it to not solid
    if (!myCollider.isTrigger && (charY < (myY - fudgeFactor)))
    {
        myCollider.isTrigger = true;
    }
    // if the player is falling through and they go below the platform, stop the fallthrough
    if (fallingThrough && (charY < (myY - fudgeFactor)))
    {
        fallingThrough = false;
    }
    // if the platform currently isn't solid and they player is above it, make it solid
    else if (!fallingThrough && myCollider.isTrigger && (charY > (myY + fudgeFactor)))
    {
        myCollider.isTrigger = false;
    }
}

// called when the player falls through the platform or rises above it. Used to allow the player
// to properly fall through platforms
function OnTriggerExit2D(other : Collider2D)
{
    /*
    if((other.sharedMaterial.name).Equals("PlayerHangMaterial") && other.attachedRigidbody.velocity.y <= 0)
    {
        fallingThrough = false;
    }*/
}

// call when the player wants to fall through this platform
function fallThrough()
{
    fallingThrough = true;
    myCollider.isTrigger = true;
}