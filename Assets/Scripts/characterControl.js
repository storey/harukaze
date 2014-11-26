#pragma strict
// this controls the characters movement

// is the player facing right?
@HideInInspector
var facingRight = true;

// does the player want to start a jump or wall jump?
@HideInInspector
var jump = false;
var wallJump = false;

// what is the offset and radius of the circle collider
@HideInInspector
var circleColliderYOffset : float;
@HideInInspector
var circleColliderRadius : float;

// used to check whether the character is on the ground
private var grounded: boolean;
private var groundChecker : Transform;

// used to check whether the character is against a wall
private var walled: boolean;
private var onWallChecker : Transform;

// is the player on a platform? (they will also be grounded)
private var platformed : boolean = false;

// is the player hanging off a ledge?
private var hanging : boolean = false;

// holds the platform which the player is currently standing on or hanging from.
private var currentPlatform : GameObject = null;

// holds the y position of the platform if the player is hanging from it
private var currentPlatformY : float;

// is the player crouching?
private var crouching : boolean = false;

// is the player on a ladder
private var laddered : boolean = false;

// is the player in the state right after having taken damage?
private var damageState : boolean = false;

// holds wether the user is wall Jumping or not.
private var wallJumping: boolean;

// maximum speed at which the character can move horizontally
var maxSpeed : float = 7.5;

// the speed at which the character starts jumps
var jumpSpeed : float = 16.0;

// climb speed
var climbSpeed : float = 4.0;

// store the layer number of the Ground/Platform Layers
var groundLayer : int = 12;
var platformLayer : int = 13;

// store the player's height
private var playerHeight : float;

// holds the player's rigid body and animator
private var rb : Rigidbody2D;
private var anim : Animator;

// holds the meditative state script to figure out whether we are in the meditative state.
private var meditativeScript : MeditativeStateController;

// holds the control script of the camera that follows the player
private var cameraScript : cameraControl;

function Awake()
{
    // get the offset and radius of the circle collider (used by angled platforms)
    circleColliderYOffset = GetComponent(CircleCollider2D).center.y;
    circleColliderRadius = GetComponent(CircleCollider2D).radius;
    
    // get the character sprite and player height
    var characterSprite : Sprite = GetComponent(SpriteRenderer).sprite;
    playerHeight = characterSprite.bounds.max.y - characterSprite.bounds.min.y;
    
    // get the camera script
    cameraScript = GameObject.Find("Main Camera").GetComponent(cameraControl);
    // get the meditative state script
    meditativeScript = GameObject.Find("MeditativeStateManager").GetComponent(MeditativeStateController);
}

function Start () 
{
    // get the rigid body for the character
    rb = GetComponent(Rigidbody2D);
    anim = GetComponent(Animator);
    groundChecker = transform.Find("groundChecker");
    onWallChecker = transform.Find("onWallChecker");
    wallJumping = false;
}

function Update () 
{ 
    // make sure we aren't in the meditative state, which would mean everything shoudl be frozen
    if (!meditativeScript.inMedState)
    {
        // if the user is hanging and are above the platform, end the hanging
        if (hanging)
        {
            if (transform.position.y > currentPlatformY)
            {
                endClimbFromHang();
            }
        }
        else
        {
            //currentPlatform = null;
        }
        
        // allow the user to interact with objects in front of them
        if (Input.GetKeyUp(KeyCode.E))
        {
            var rc2D : RaycastHit2D = Physics2D.Linecast(transform.position, onWallChecker.position, (1 << LayerMask.NameToLayer("Interact")));
            if (rc2D.collider != null)
            {
                var script : interactionScript = rc2D.transform.gameObject.GetComponent("interactionScript");
                script.Interact();
            }
        }
        
        // onWallChecker is point just in front of the character. We draw a line from the character to this point,
        // and check if the line intersects anything on the "wall" layer. If so, the player is "walled".
        walled = Physics2D.Linecast(transform.position, onWallChecker.position, (1 << LayerMask.NameToLayer("Wall")));
        
        // if the jump button is pressed and the player is walled, wall jump
        if(Input.GetKeyDown(KeyCode.Space) && walled)
        {
            wallJump = true;
            
            wallJumping = true;
        }
        else
        {
            // groundChecker is point just below the characters feet. We draw a line from the character to this point,
            // and check if the line intersects anything on the "ground" layer. If so, the player is "grounded".
            // currently replaced because the one point is too easy, but I'll leave it here for now
            
            /*
            grounded = false;
            platformed = false;
            var RH2Ds : RaycastHit2D[] = Physics2D.LinecastAll(transform.position, groundChecker.position);
            for (var i : int; i < RH2Ds.length; i++)
            {
                var RH2D : RaycastHit2D = RH2Ds[i];
                if (RH2D.collider != null)
                {
                    var layer : int = RH2D.collider.gameObject.layer;
                    if (layer == groundLayer)
                    {
                        grounded = true;
                        break;
                    }
                    else if (layer == platformLayer)
                    {
                        currentPlatform = RH2D.collider.gameObject;
                        platformed = true;
                        grounded = true;
                        break;
                    }
                }
            }
            anim.SetBool("Grounded", grounded);
            */
            
            
            // if the character has returned to the ground after wall jumping, give them movement control again
            if (wallJumping && (grounded || (rb.velocity.y == 0)))
            {
                wallJumping = false;
            }
            
        
            // if the jump button is pressed and the player is grounded and not crouching, jump
            if (Input.GetKeyDown(KeyCode.Space) && grounded && !crouching)
            {
                jump = true;
                damageState = false;
            }
            
            
            // if the crouching button is pressed and the player is grounded, (and the player isn't jumping), crouch
            if (Input.GetKeyDown(KeyCode.S) && grounded && !platformed && !jump && !walled && !wallJumping && !laddered)
            {
                crouching = true;
                anim.SetBool("Crouching", true);
            }
            if (Input.GetKeyUp(KeyCode.S) && crouching)
            {
                crouching = false;
                anim.SetBool("Crouching", false);
            }
        }
        
        // set the user's horizontal and vertical speed appropriately in the animator
        anim.SetFloat("HorizontalSpeed", Mathf.Abs(rb.velocity.x));
        anim.SetFloat("VerticalSpeed", rb.velocity.y);
    }
}

// handle physics updates
function FixedUpdate()
{
            
    // get user input in horizontal direction
    var input = Input.GetAxis("Horizontal");
    
    // if the user is in the damage state and they press a movement key,
    // cancel the damage state
    if (damageState && (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.D)))
    {
        cancelDamageState();
    }
    
    // if the user is crouching or clinging to a wall, set their velocity to zero
    if (crouching || (walled && ((input > 0 && facingRight) || (input < 0 && !facingRight))))
    {
        rb.velocity = Vector2(0,0);
    }
    // if the user is hanging, allow them to climb onto or drop from the platform
    else if (hanging)
    {
        if (Input.GetKeyUp(KeyCode.W))
        {
            rb.velocity = Vector2(0, climbSpeed);
        }
        else if (Input.GetKeyUp(KeyCode.S))
        {
            //Debug.Log("down:"+Time.realtimeSinceStartup);
            hanging = false;
            rb.gravityScale = 1;
        }
        
    }
    // if the user is on a platform, allow them to drop to the hanging position.
    else if (platformed && Input.GetKeyDown(KeyCode.S))
    {
        var platformScript : platformBehavior = currentPlatform.GetComponent(platformBehavior);
        if (platformScript != null)
        {
            platformScript.fallThrough();
        }
        // if this is a no hang platform
        else
        {
            var noHangScript : noHangPlatformBehavior = currentPlatform.GetComponent(noHangPlatformBehavior);
            noHangScript.fallThrough();
        }
    }
    // otherwise if they aren't wall jumping or crouching or hanging
    else if (!wallJumping && !crouching && !hanging) 
    {
        // set their x velocity to the input and leave the y velocity the same
        var xVel : float = input * maxSpeed;
        var yVel : float = rb.velocity.y;
        
        // if the user is in the damage state or there is no input,
        // leave the x velocity alone
        if(damageState || input == 0)
        {
            xVel = rb.velocity.x;
        }
        
        // if the user is on a ladder, set their y velocity to 0 unless
        // they are trying to move up or down, in which case set it ot the
        // climb speed in the proper direction
        if (laddered)
        {
            if (input == 0)
            {
                xVel = 0;
            }
            yVel = 0;
            if(Input.GetKey(KeyCode.W))
            {
                yVel = climbSpeed;
            }
            else if(Input.GetKey(KeyCode.S))
            {
                yVel = -1*climbSpeed;
            }
        }
        
        // set teh velocity
        rb.velocity = Vector2(xVel, yVel);

        // if the character is facing left and moving right, set them to moving left
        if (input > 0 && !facingRight)
        {
            FlipPlayer();
        }
        // or if the character is facing right and moving left, set appropriately
        else if (input < 0 && facingRight)
        {
            FlipPlayer();
        }
    }
    // if the user wants to wall jump, wall jump
    if (wallJump)
    {
        var sideSpeed : float = maxSpeed;
        if (facingRight)
        {
            sideSpeed *= -1.0;
        }
        var upSpeed : float = maxSpeed*1.5;
        FlipPlayer();
        rb.velocity = Vector2(sideSpeed, upSpeed);
        
        wallJump = false;
        jump = false;
    }
    // if the user wants to jump, jump
    else if (jump)
    { 
        rb.velocity = Vector2(rb.velocity.x, jumpSpeed);
        wallJump = false;
        jump = false;
    }
    
}

// flips the player's orientation to the opposite of what it is
function FlipPlayer()
{
    
    // switch orientation
    facingRight = !facingRight;
    
    
    // Flip the character's sprite by setting x scale to -1.
    var myScale = transform.localScale;
    myScale.x *= -1;
    transform.localScale = myScale;
}

// handles the character taking damage
function damaged(delay : float)
{
    StopCoroutine("damageWait");
    damageState = true;
    StartCoroutine("damageWait", Mathf.Floor(delay/Time.fixedDeltaTime));
}

// wait a certain amount of time before allowing movement after they take
// damage
function damageWait(numFrames : int)
{
    for (var i : int = 0; i < numFrames; i++)
    {
        yield WaitForFixedUpdate;
    }
    damageState = false;
}

// cancel the damage state
function cancelDamageState()
{
    damageState = false;
    StopCoroutine("damageWait");
}

// call when the player moves onto a ladder
function ontoLadder()
{
    rb.gravityScale = 0;
    laddered = true;
}

// call when the player leaves a ladder
function offLadder()
{
    rb.gravityScale = 1;
    laddered = false;
}

// call when the player is hanging off a platform
function beginHang(platform : GameObject, platformY : float)
{
    var extraDistance : float = 0.05;
    hanging = true;
    
    grounded = false;
    anim.SetBool("Grounded", grounded);
    platformed = false;
    anim.SetBool("Platformed", platformed);
    
    rb.gravityScale = 0;
    rb.velocity = Vector2(0,0);
    
    currentPlatform = platform;
    currentPlatformY = platformY;
    
    transform.position.y = currentPlatformY - (playerHeight + extraDistance);
    cameraScript.setY(currentPlatformY - (playerHeight + extraDistance));
}

// call when the player finishes climbing from the hanging state
function endClimbFromHang()
{
    if (hanging)
    {
        rb.gravityScale = 1;
        rb.velocity = Vector2(0,0);
        hanging = false;
    }
}

// when any collider collides, check whether the user is grounded
function OnCollisionEnter2D(coll : Collision2D)
{
    checkGrounded(coll);
}

// if the user doesn't appear to be grounded but is colliding
// with something, check whether they are grounded
function OnCollisionStay2D(coll : Collision2D)
{
    if (!grounded)
    {
        checkGrounded(coll);
    }
}

// check if the player is grounded given a Collision2D
function checkGrounded(coll : Collision2D)
{
    var contacts : ContactPoint2D[] = coll.contacts;
    var below : float = transform.position.y + 0.23;
    for (var i : int; i < contacts.length; i++)
    {
        if(contacts[i].point.y < below)
        {
            var layer : int = contacts[i].collider.gameObject.layer;
            if (layer == groundLayer)
            {
                grounded = true;
                anim.SetBool("Grounded", grounded);
                break;
            }
            else if (layer == platformLayer)
            {
                currentPlatform = contacts[i].collider.gameObject;
                platformed = true;
                grounded = true;
                anim.SetBool("Grounded", grounded);
                anim.SetBool("Platformed", platformed);
                break;
            }
        }
    }
}

// when the user leaves a collision, set them to not grounded
function OnCollisionExit2D()
{
    grounded = false;
    platformed = false;
    anim.SetBool("Grounded", grounded);
    anim.SetBool("Platformed", platformed);
}
