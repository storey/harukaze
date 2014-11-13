#pragma strict

public var type : int = 0;


function Start () 
{

}

// run the interaction
function Interact() 
{
    switch (type)
    {
        case 1:
            Debug.Log("You have interacted with a strange object.");
            break;
        default:
            Debug.Log("You observe the object");
            break;
    }
}