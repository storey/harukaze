#pragma strict

// Adapted From unity code
// Controls the camera

// Distance in the x axis the player can move before the camera follows.
public var xMargin : float = 1f;		
// Distance in the y axis the player can move before the camera follows.
public var yMargin : float = 1f;		
// How smoothly the camera catches up with its target movement in the x axis.
public var xSmooth : float = 8f;		
// How smoothly the camera catches up with its target movement in the y axis.
public var ySmooth : float = 8f;		
// The maximum x and y coordinates the camera can have.
public var maxXAndY : Vector2;		
// The minimum x and y coordinates the camera can have.
public var minXAndY : Vector2;		

// Reference to the player's transform.
private var player : Transform;		

// when the script wakes up
function Awake()
{
    // Setting up the reference.
    player = GameObject.Find("Masaru").transform; //GameObject.FindWithTag("Player").transform;
}

// Returns true if the distance between the camera and the player in the x axis is greater than the x margin.
function CheckXMargin()
{
    return Mathf.Abs(transform.position.x - player.position.x) > xMargin;
}

// Returns true if the distance between the camera and the player in the y axis is greater than the y margin.
function CheckYMargin()
{
    
    return Mathf.Abs(transform.position.y - player.position.y) > yMargin;
}

// ever fixedupdate, track the player
function FixedUpdate()
{
    TrackPlayer();
}
	
// set the camera's position so it properly follows the player
function TrackPlayer ()
{
    // By default the target x and y coordinates of the camera are it's current x and y coordinates.
    var targetX : float = transform.position.x;
    var targetY : float = transform.position.y;
    

    // If the player has moved beyond the x margin...
    if(CheckXMargin())
    {
        // ... the target x coordinate should be a Lerp between the camera's current x position and the player's current x position.
        targetX = player.position.x;//Mathf.Lerp(transform.position.x, player.position.x, xSmooth * Time.deltaTime);
    }
    
    // If the player has moved beyond the y margin...
    if(CheckYMargin())
    {
        // ... the target y coordinate should be a Lerp between the camera's current y position and the player's current y position.
        targetY =  player.position.y;//Mathf.Lerp(transform.position.y, player.position.y, ySmooth * Time.deltaTime);
    }
    // The target x and y coordinates should not be larger than the maximum or smaller than the minimum.
    targetX = Mathf.Clamp(targetX, minXAndY.x, maxXAndY.x);
    targetY = Mathf.Clamp(targetY, minXAndY.y, maxXAndY.y);

    // Set the camera's position to the target position with the same z component.
    transform.position = new Vector3(targetX, targetY, transform.position.z);
}

// sets the camera position to newX, newY
function setPos(newX : float, newY : float)
{
    // By default the target x and y coordinates of the camera are it's current x and y coordinates.
    var targetX : float = newX;
    var targetY : float = newY;
    // The target x and y coordinates should not be larger than the maximum or smaller than the minimum.
    targetX = Mathf.Clamp(targetX, minXAndY.x, maxXAndY.x);
    targetY = Mathf.Clamp(targetY, minXAndY.y, maxXAndY.y);
    // Set the camera's position to the target position with the same z component.
    transform.position = new Vector3(targetX, targetY, transform.position.z);
}

// sets the x position of the camera to newX
function setX(newX : float)
{
    // By default the target x and y coordinates of the camera are it's current x and y coordinates.
    var targetX : float = newX;
    var targetY : float = transform.position.y;
    // The target x coordinate should not be larger than the maximum or smaller than the minimum.
    targetX = Mathf.Clamp(targetX, minXAndY.x, maxXAndY.x);
    // Set the camera's position to the target position with the same z component.
    transform.position = new Vector3(targetX, targetY, transform.position.z);
}

// sets the y position of the camera to newY
function setY(newY : float)
{
    // By default the target x and y coordinates of the camera are it's current x and y coordinates.
    var targetX : float = transform.position.x;
    var targetY : float = newY;
    // The target y coordinate should not be larger than the maximum or smaller than the minimum.
    targetY = Mathf.Clamp(targetY, minXAndY.y, maxXAndY.y);
    // Set the camera's position to the target position with the same z component.
    transform.position = new Vector3(targetX, targetY, transform.position.z);
}

// shifts the camera deltaX in the x direction, deltaY in the y direction.
function addPos(deltaX : float, deltaY : float)
{
    // By default the target x and y coordinates of the camera are it's current x and y coordinates.
    var targetX : float = transform.position.x + deltaX;
    var targetY : float = transform.position.y + deltaY;
    // The target x and y coordinates should not be larger than the maximum or smaller than the minimum.
    targetX = Mathf.Clamp(targetX, minXAndY.x, maxXAndY.x);
    targetY = Mathf.Clamp(targetY, minXAndY.y, maxXAndY.y);
    // Set the camera's position to the target position with the same z component.
    transform.position = new Vector3(targetX, targetY, transform.position.z);
}