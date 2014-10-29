#pragma strict

// store the transform of this and the camera
private var mainCamera : Transform;
private var me : Transform;

// get this and the camera's transform
function Start () 
{
    mainCamera = GameObject.FindWithTag("MainCamera").transform;
    me = GetComponent(Transform);
}

// position this in the same place relative to the camera
function Update () 
{
    me.position.x = mainCamera.position.x;
    me.position.y = mainCamera.position.y;
}