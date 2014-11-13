#pragma strict

@HideInInspector
var facingRight = true;

@HideInInspector
var jump = false;
var wallJump = false;

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

// is the player crouching?
private var crouching : boolean = false;

// is the player near a ladder?
private var laddered : boolean = false;

// is the player in the state right after having taken damage?
private var damageState : boolean = false;

// used to check wether the character has just jumped off the wall
// allows infinite jumping up one wall
/*
private var wallJumping: boolean;
private var wallJumpingChecker : Transform;
*/
// holds wether the user is wall Jumping or not.
private var wallJumping: boolean;

// maximum speed at which the character can move
var maxSpeed : float = 7.5;

// climb speed
var climbSpeed : float = 4.0;

// controls how strongly/high the character jumps
var jumpForce : float = 1000.0;

private var rb : Rigidbody2D;

private var anim : Animator;

// stores sqrt(2)/2
private var root2Over2 : float;

// holds the meditative state script to figure out whether we are in the meditative state.
private var meditativeScript : MeditativeStateController;

function Awake()
{
    // get the offset and radius of the circle collider (used by angled platforms)
    circleColliderYOffset = GetComponent(CircleCollider2D).center.y;
    circleColliderRadius = GetComponent(CircleCollider2D).radius;
    
    root2Over2 = Mathf.Sqrt(2)/2.0;
}

function Start () 
{
    // get the meditative state script
    meditativeScript = GameObject.Find("MeditativeStateManager").GetComponent(MeditativeStateController);
    
    
    // get the rigid body for the character
    rb = GetComponent(Rigidbody2D);
    anim = GetComponent(Animator);
    groundChecker = transform.Find("groundChecker");
    onWallChecker = transform.Find("onWallChecker");
    wallJumping = false;
    // allows infinite jumping up one wall
    //wallJumpingChecker = transform.Find("wallJumpChecker");
}

function Update () 
{ 
    if (!meditativeScript.inMedState)
    {
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
        if(Input.GetButtonDown("Jump") && walled)
        {
            wallJump = true;
            
            wallJumping = true;
        }
        else
        {
            // groundChecker is point just below the characters feet. We draw a line from the character to this point,
            // and check if the line intersects anything on the "ground" layer. If so, the player is "grounded".
            grounded = Physics2D.Linecast(transform.position, groundChecker.position, (1 << LayerMask.NameToLayer("Ground")));
            anim.SetBool("Grounded", grounded);
            
            // if the character has returned to the ground after wall jumping, give them movement control again
            if (wallJumping && (grounded || (rb.velocity.y == 0)))
            {
                wallJumping = false;
            }
            
        
            // if the jump button is pressed and the player is grounded and not crouching, jump
            if (Input.GetButtonDown("Jump") && grounded && !crouching)
            {
                jump = true;
                damageState = false;
            }
            
            
            // if the crouching button is pressed and the player is grounded, (and the player isn't jumping), crouch
            if (Input.GetKeyDown(KeyCode.S) && grounded && !jump && !walled && !wallJumping)
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
        anim.SetFloat("HorizontalSpeed", Mathf.Abs(rb.velocity.x));
        anim.SetFloat("VerticalSpeed", rb.velocity.y);
    }
}

// handle physics updates
function FixedUpdate()
{
    // get user input in horizontal direction
    var input = Input.GetAxis("Horizontal");
    
    if (damageState && (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.D)))
    {
        cancelDamageState();
    }
    
    if (crouching || (walled && ((input > 0 && facingRight) || (input < 0 && !facingRight))))
    {
        rb.velocity = Vector2(0,0);
    }
    else if (!wallJumping && !crouching) 
    {
        var xVel : float = input * maxSpeed;
        var yVel : float = rb.velocity.y;
        if(damageState || input == 0)
        {
            xVel = rb.velocity.x;
        }
        
        
        if (laddered)
        {
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
        
        // set X velocity based on the user input
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
    if (wallJump)
    {
        /*
        var sideForce : float = root2Over2 * jumpForce /2.0;
        if (facingRight)
        {
            sideForce *= -1.0;
        }
        var upForce : float = root2Over2 * jumpForce * 2.0;
        FlipPlayer();
        rb.AddForce(Vector2(sideForce, upForce));*/
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
    else if (jump)
    { 
        rb.AddForce(Vector2.up * jumpForce);
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

// handles the character daking damage
function damaged(delay : float)
{
    StopCoroutine("damageWait");
    damageState = true;
    StartCoroutine("damageWait", Mathf.Floor(delay/Time.fixedDeltaTime));
}

// wait a certain amount of time before allowing movement
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
