#pragma strict

// holds the full peach, half peach, and pit prefabs
var fullPeach : Transform;
var halfPeach : Transform;
var pit : Transform;

// offset of start of health bar from center of HUD
var healthXOffset : float = -6.0;
var healthYOffset : float = 4.5;

// width/height of each peach
private var peachWidth: float;
private var peachHeight: float;

// amount of space between peaches
var peachSpace: float = 0.1;

// maximum health
// one peach is two health
var maxHealth : int = 21;

// holds current health
private var currentHealth : int;

// holds each peach/halfPeach/pit gameObject
private var peaches : Transform[];

private var health : Transform;

// health on a row
var peachesPerRow : int = 8;

// extra distance needed to make half peach at proper height
var halfPeachHeightBoost : float = -0.6;

// extra distance needed to make pit at proper width/height
var pitWidthBoost : float = 3.85;
var pitHeightBoost : float = -6;

// holds how much time between increments/decrements when adding/subtracting a large amount of health
var multipleSpeed : float = 0.1;

function Start () 
{
    var pixelsToUnits : float = 100;
    var peachSpriteW : float = 716.0/pixelsToUnits;
    var peachSpriteH : float = 755.0/pixelsToUnits;
    peachWidth = peachSpriteW * fullPeach.localScale.x;
    peachHeight = peachSpriteH * fullPeach.localScale.y;
    health  = GameObject.Find("HealthController").transform;
    var peach : Transform;
    
    halfPeachHeightBoost *= halfPeach.localScale.y;
    pitWidthBoost *= pit.localScale.x;
    pitHeightBoost *= pit.localScale.y;
    
    // have a spot for each possible peach
    peaches = new Transform[(maxHealth+1)/2];
    var odd : boolean = maxHealth % 2 == 0;
    var peachesLeft : int = maxHealth/2;
    var peachesInRow : int;
    var i : int = 0;
    while (peachesLeft > 0)
    {
        peachesInRow = Mathf.Min(peachesLeft, peachesPerRow);
        for (var j : int = 0; j < peachesInRow; j++)
        {    
            peach = Instantiate(fullPeach, Vector3 (0, 0, 0), Quaternion.identity);
            peach.parent = health;
            peach.position = Vector3 ((healthXOffset + (peachWidth + peachSpace) * j), 
                                      (healthYOffset - (peachHeight + peachSpace) * i) , 0);
            peaches[i*peachesPerRow + j] = peach;

        }
        peachesLeft -= peachesPerRow;
        i++;
    }
    
    // add an extra half peach if necessary
    peach = Instantiate(halfPeach, Vector3 (0, 0, 0), Quaternion.identity);
    peach.parent = health;
    peach.position = Vector3 ((healthXOffset + (peachWidth + peachSpace) * j), 
                              (healthYOffset + halfPeachHeightBoost - (peachHeight + peachSpace) * (i-1)) , 0);
    peaches[(i-1)*peachesPerRow + j] = peach;
    
                              
                              
    currentHealth = maxHealth;

}

// lower the health points by 1 (1/2 of a peach)
function decrementHealth()
{
    if (currentHealth > 0)
    {
        currentHealth--;
        var index = currentHealth >> 1;
        var oldPeach : Transform = peaches[index];  
        var peach : Transform;
        // if health is now even, we had a half peach previously
        // and just delete it
        if ( (currentHealth & 1) == 0)
        {
            peach = Instantiate(pit, Vector3 (0, 0, 0), Quaternion.identity);
            peach.parent = health;
            peach.position = Vector3 (oldPeach.position.x + pitWidthBoost, 
                                   oldPeach.position.y - halfPeachHeightBoost + pitHeightBoost, 0);
            peaches[index] = peach;
            Destroy(oldPeach.gameObject); 
        }
        // if health is now odd, we had a full peach previously and
        // have to replace it with a half peach
        else
        {
            peach = Instantiate(halfPeach, Vector3 (0, 0, 0), Quaternion.identity);
            peach.parent = health;
            peach.position = Vector3 (oldPeach.position.x, 
                                   oldPeach.position.y + halfPeachHeightBoost, 0);
            peaches[index] = peach;
            
            Destroy(oldPeach.gameObject);  
            
        }
    }
}

// increase the health points by 1 (1/2 of a peach)
function incrementHealth()
{
    if (currentHealth < maxHealth)
    {
        var index = currentHealth >> 1;
        var oldPeach : Transform;
        var peach : Transform;
        // if health is now even, we had a half peach previously
        // and just delete it
        if ( (currentHealth & 1) == 0)
        {
            oldPeach = peaches[index];  
            peach = Instantiate(halfPeach, Vector3 (0, 0, 0), Quaternion.identity);
            peach.parent = health;
            peach.position = Vector3 (oldPeach.position.x - pitWidthBoost, 
                                   oldPeach.position.y + halfPeachHeightBoost - pitHeightBoost, 0);
            peaches[index] = peach;
            
            Destroy(oldPeach.gameObject);  
        }
        // if health is now odd, we had a full peach previously and
        // have to replace it with a half peach
        else
        {
            oldPeach = peaches[index];  
            peach = Instantiate(fullPeach, Vector3 (0, 0, 0), Quaternion.identity);
            peach.parent = health;
            peach.position = Vector3 (oldPeach.position.x, 
                                   oldPeach.position.y - halfPeachHeightBoost, 0);
            peaches[index] = peach;
            
            Destroy(oldPeach.gameObject);  
            
        }
        currentHealth++;
    }
}

// increase the health points by N (N/2 peaches)
function addHealth(N : int)
{
    if (currentHealth + N > maxHealth)
    {
        N = maxHealth - currentHealth;
    }
    for (var i : int = 0; i < N; i++)
    {
        Invoke("incrementHealth", multipleSpeed*i);
    }
}

// decrease the health points by N (N/2 peaches)
function takeHealth(N : int)
{
    if (currentHealth - N < 0)
    {
        N = currentHealth;
    }
    for (var i : int = 0; i < N; i++)
    {
        Invoke("decrementHealth", multipleSpeed*i);
    }
}

function Update () 
{
    /* For testing 
    if(Input.GetKeyUp(KeyCode.E))
    {
        addHealth(5);
    }
    if(Input.GetKeyUp(KeyCode.Q))
    {
        takeHealth(5);
    }//*/
}