#pragma strict
// Controls the player climbing/descending ladders.

// holds the character's script
private var charScript : characterControl;

// get the character script
function Start () 
{
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
}

// when the user touches the ladder, act appropriately
function OnTriggerEnter2D(other : Collider2D) 
{
    var name : String = other.sharedMaterial.name;
    if(name.Equals("PlayerMaterial") || name.Equals("PlayerFeetMaterial"))
    {
        charScript.ontoLadder();
    }
    
}

// when the user leaves the ladder, act appropriately
function OnTriggerExit2D(other : Collider2D) 
{
    var name : String = other.sharedMaterial.name;
    var yVel : float = other.attachedRigidbody.velocity.y;
    if((name.Equals("PlayerMaterial") && (yVel <= 0)) || (name.Equals("PlayerFeetMaterial") && (yVel >= 0)))
    {
        charScript.offLadder();
    }
}
