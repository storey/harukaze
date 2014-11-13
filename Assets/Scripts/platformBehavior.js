#pragma strict

private var myCollider : EdgeCollider2D;

private var myY : float;

private var charTransform : Transform;

private var halfYSize : float;


private var charScript : characterControl;
     //   charScript.FlipPlayer();

private var fudgeFactor : float = 0.03f;

// is the user choosing to fall through this platform?
private var fallingThrough : boolean = false;
    
function Start () 
{ 
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
    halfYSize = (-1*charScript.circleColliderYOffset + charScript.circleColliderRadius) * GameObject.Find("Masaru").GetComponent(Transform).localScale.y;
    
    myCollider = GetComponent(EdgeCollider2D);
    myCollider.isTrigger = true;
    //myCollider.enabled = false;
    var arr = myCollider.points;
    var i : int;
    var max : float;
    max = 0f;
    for (i = 0; i < arr.length; i++)
    {
        max = Mathf.Max(max, arr[i].y);
    }
    
    
    myY = GetComponent(Transform).position.y + max*GetComponent(Transform).localScale.y;
    charTransform = GameObject.Find("Masaru").GetComponent(Transform);

}


// handle physics updates
function FixedUpdate()
{
    //var masBC2D = GameObject.Find("Masaru").GetComponent(BoxCollider2D);
    var charY = charTransform.position.y - halfYSize; //+ masBC2D.center.y;// + (masBC2D.size.y/2.0);
    if (!myCollider.isTrigger && (charY < (myY - fudgeFactor)))
    {
        myCollider.isTrigger = true;
        //myCollider.enabled = false;
    }
    else if (!fallingThrough && myCollider.isTrigger && (charY > (myY + fudgeFactor)))
    {
        myCollider.isTrigger = false;
        //myCollider.enabled = true;
    }
}

function OnTriggerExit2D(other : Collider2D)
{
    if((other.sharedMaterial.name).Equals("PlayerMaterial") && other.attachedRigidbody.velocity.y <= 0)
    {
        fallingThrough = false;
        charScript.beginHang();
    }
    else if((other.sharedMaterial.name).Equals("PlayerFeetMaterial")  && other.attachedRigidbody.velocity.y > 0)
    {
        charScript.endClimbFromHang();
    }
}

// call when the player wants to fall through this platform
function fallThrough()
{
    fallingThrough = true;
    myCollider.isTrigger = true;
}