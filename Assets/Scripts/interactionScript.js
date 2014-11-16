#pragma strict

// this script controls interaction with objects

// the type of object that this is. This will be set in the inspector.
public var type : int = 0;



// run the interaction with the object
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