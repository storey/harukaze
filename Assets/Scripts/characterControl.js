#pragma strict

@HideInInspector
var facingRight = true;

@HideInInspector
var jump = false;


@HideInInspector
var circleColliderYOffset : float;
@HideInInspector
var circleColliderRadius : float;

private var grounded: boolean;
private var groundChecker : Transform;

// no longer necessary
//var moveForce = 300.0;

// maximum speed at which the character can move
var maxSpeed = 7.5;

// controls how strongly/high the character jumps
var jumpForce = 1000.0;

private var rb : Rigidbody2D;

private var anim : Animator;

function Awake()
{
    // get the offset and radius of the circle collider (used by angled platforms)
    circleColliderYOffset = GetComponent(CircleCollider2D).center.y;
    circleColliderRadius = GetComponent(CircleCollider2D).radius;
}

function Start () 
{
    
    // get the rigid body for the character
    rb = GetComponent(Rigidbody2D);
    anim = GetComponent(Animator);
    groundChecker = transform.Find("groundChecker");
}

function Update () 
{ 
    // groundChecker is point just below the characters feet. We draw a line from the character to this point,
    // and check if the line intersects anything on the "ground" layer. If so, the player is "grounded".
    grounded = Physics2D.Linecast(transform.position, groundChecker.position, (1 << LayerMask.NameToLayer("Ground")));
    
    // if the jump button is pressed and the player is grounded, jump
    if(Input.GetButtonDown("Jump") && grounded)
    {
        jump = true;
    }
}

// handle physics updates
function FixedUpdate()
{
    // get user input in horizontal direction
    var input = Input.GetAxis("Horizontal");
    
    anim.SetFloat("Speed", Mathf.Abs(input));
    
    // set X velocity based on the user input
    rb.velocity = Vector2(input * maxSpeed, rb.velocity.y);

    
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
    
    if (jump)
    { 
        rb.AddForce(Vector2.up * jumpForce);
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
