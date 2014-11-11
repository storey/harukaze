#pragma strict

public var timeLimit : float = 3.0;

private var steps : int;

private var running;

// holds the meditative state script to figure out whether we are in the meditative state.
private var meditativeScript : MeditativeStateController;

function setup () 
{
    resetTimer();
    running = false;    
    
    steps = Mathf.Floor(timeLimit/Time.fixedDeltaTime);
    
    meditativeScript = GameObject.Find("MeditativeStateManager").GetComponent(MeditativeStateController);
}


// reset to default time
function resetTimer()
{
    renderer.material.SetFloat("_Cutoff", 0.0001);
}

// start the timer
function startTimer()
{
    running = true;
    StartCoroutine(runDown());
}

// stop the timer
function stopTimer()
{
    running = false;
}

// runs the timer down
function runDown()
{
    for (var i : int = 0; i < steps; i++)
    {
        if (running)
        {
            yield WaitForFixedUpdate;
            renderer.material.SetFloat("_Cutoff", Mathf.Clamp(((i*1.0)/steps), 0.0001, 0.9999));
        }
    }
    
    running = false;
    meditativeScript.leaveState();
}


