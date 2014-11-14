#pragma strict

var damageDelay : float = 1.0;


private var healthScript : healthControl;
private var charScript : characterControl;
private var cameraScript : cameraControl;

private var distance : int = -2;

function Start () 
{
    healthScript = GameObject.Find("HealthController").GetComponent(healthControl);
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);
    cameraScript = GameObject.Find("Main Camera").GetComponent(cameraControl);
    
}

// when the user collides with the spikes, move them backwards and cause damage
function OnCollisionEnter2D(other : Collision2D) 
{
    other.rigidbody.velocity.x = 0;
    other.transform.position.x += distance;
    cameraScript.addPos(distance, 0);

    healthScript.takeHealth(1);
    charScript.damaged(damageDelay);
}