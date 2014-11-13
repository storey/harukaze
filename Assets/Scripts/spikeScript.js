#pragma strict

var damageDelay : float = 1.0;

private var myCamera : Transform;

private var healthScript : healthControl;
private var charScript : characterControl;

private var distance : int = -2;

function Start () 
{
    myCamera = GameObject.Find("Main Camera").GetComponent(Transform);
    healthScript = GameObject.Find("HealthController").GetComponent(healthControl);
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
    
}

// when the user collides with the spikes, move them backwards and cause damage
function OnCollisionEnter2D(other : Collision2D) 
{
    other.rigidbody.velocity.x = 0;
    other.transform.position.x += distance;
    myCamera.position.x += distance;

    healthScript.takeHealth(1);
    charScript.damaged(damageDelay);
}