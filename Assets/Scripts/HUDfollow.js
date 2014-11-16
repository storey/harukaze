#pragma strict
// This script has the HUD follow the player at all times

// store the transform of this HUD and the camera
private var mainCamera : Transform;
private var me : Transform;

// call on startup
function Start () 
{
    setup();
}

// get this and the camera's transform
function setup()
{
    mainCamera = GameObject.FindWithTag("MainCamera").transform;
    me = GetComponent(Transform);
}

// every frame, update the position
function Update () 
{
    updatePosition();
}

// position this in the same place relative to the camera
function updatePosition()
{
    me.position.x = mainCamera.position.x;
    me.position.y = mainCamera.position.y;
}