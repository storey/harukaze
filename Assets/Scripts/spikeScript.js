#pragma strict
// this script controls damagin spikes

// if the user holds down the A or D key and hits the spikes, and keeps holding
// it down, they could keep running into the spikes, so this allows taht
// hold-down of the keys to be canceled for damageDelay seconds
var damageDelay : float = 1.0;


// necessary scripts
private var healthScript : healthControl;
private var charScript : characterControl;
private var cameraScript : cameraControl;

// how the user is thrown by the spikes
private var distance : int = -2;

// get the various scripts
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