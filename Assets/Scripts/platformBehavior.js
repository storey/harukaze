#pragma strict

private var myCollider : EdgeCollider2D;

private var myY : float;

private var charTransform : Transform;

/*
private var charScript : characterControl;
        charScript.FlipPlayer();
    charScript = GameObject.Find("Masaru").GetComponent(characterControl);*/

private var fudgeFactor : float = 0.2f;
    
function Start () 
{
    myCollider = GetComponent(EdgeCollider2D);
    myCollider.enabled = false;
    var arr = myCollider.points;
    var i : int;
    var max : float;
    max = 0f;
    for (i = 0; i < arr.length; i++)
    {
        max = Mathf.Max(max, arr[i].y);
    }
    myY = GetComponent(Transform).position.y + max;
    charTransform = GameObject.Find("Masaru").GetComponent(Transform);
}

function Update () 
{
    

}

// handle physics updates
function FixedUpdate()
{
    //var masBC2D = GameObject.Find("Masaru").GetComponent(BoxCollider2D);
    var charY = charTransform.position.y; //+ masBC2D.center.y;// + (masBC2D.size.y/2.0);
    if (myCollider.enabled && charY < (myY - fudgeFactor))
    {
        myCollider.enabled = false;
    }
    else if (!myCollider.enabled && charY > (myY - fudgeFactor))
    {
        myCollider.enabled = true;
    }
}