#pragma strict

public var maxChakra : float = 100.0;

private var currentChakra : float = 50.0;

function Start () 
{
    renderer.material.SetFloat("_Cutoff", getCutoff());
}

function Update () 
{    
    /* For testing
    if(Input.GetKeyUp(KeyCode.E))
    {
        changeChakra(5.0);
    }
    if(Input.GetKeyUp(KeyCode.Q))
    {
        changeChakra(-5.0);
    }*/

}

// add N chakra (or subtract if N is negative
function changeChakra(N : float)
{
    currentChakra = Mathf.Clamp(currentChakra + N, 0, maxChakra);
    renderer.material.SetFloat("_Cutoff", getCutoff());
}

// returns the alpha cutoff given the current Chakra and max Chakra
function getCutoff()
{
    var percentage : float = currentChakra/maxChakra;
    var inversed : float = 1 - percentage;
    return Mathf.Clamp(inversed, 0.0001, 0.9999);
}