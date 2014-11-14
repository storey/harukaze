#pragma strict

// holds the character's script
private var charScript : characterControl;

function Start () 
{
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
}

// when the user touches the ladder, act appropriately
function OnCollisionEnter2D(other : Collision2D) 
{
    if((other.collider.sharedMaterial.name).Equals("PlayerMaterial"))
    {
        charScript.ontoLadder();
    }
    
}

// when the user leaves the ladder, act appropriately
function OnCollisionExit2D(other : Collision2D) 
{
    if((other.collider.sharedMaterial.name).Equals("PlayerMaterial"))
    {
        charScript.offLadder();
    }
}
