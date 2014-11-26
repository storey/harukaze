#pragma strict

// controls selecting items from a menu by moving selectors.

// name of selectors
var selectorName : String = "MainMenuSelectors";

// starting y position
var startY : float = 0.883477;

// distance between menu items
var yDistance : float = 0.5937717;

// number of menu items
var numItems : int = 6;

// the currently selected menu item
private var currentSelection : int = 0;

// transform of the selectors
private var selectorTransform : Transform;

// can the user use this menu?
private var isActive : boolean = false;

function Start() 
{
    selectorTransform = GameObject.Find(selectorName).GetComponent(Transform);
    selectorTransform.position.y = startY;
}

// check whether the user is moving through the menu
function Update() 
{
    if (isActive)
    {
        if (Input.GetKeyDown(KeyCode.W) && currentSelection != 0)
        {
            Debug.Log("up");
            selectorTransform.position.y += yDistance;
            currentSelection--;
        }
        if (Input.GetKeyDown(KeyCode.S) && currentSelection != (numItems-1))
        {
            Debug.Log("down");
            selectorTransform.position.y -= yDistance;
            currentSelection++;
        }
    }
}

// set whether this menu is active to a
function setActive(a : boolean)
{
    isActive = a;
}