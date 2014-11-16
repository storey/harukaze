#pragma strict

// controls the timer for the meditative state

// the time limit on the state
public var timeLimit : float = 3.0;

// holds the number of fixedUpdate states the timer will runn
private var steps : int;

// is the timmer running?
private var running : boolean;

// holds the meditative state script to figure out whether we are in the meditative state.
private var meditativeScript : MeditativeStateController;

// called to set up the timer
function setup () 
{
    // reset the timer, recognize we are not running
    resetTimer();
    
    running = false;    
    
    // calculate the number of fixedUpdate steps the given time will take
    steps = Mathf.Floor(timeLimit/Time.fixedDeltaTime);
    
    // get the meditativeScript
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
    // if time runs out, leave the meditative state
    running = false;
    meditativeScript.leaveState();
}


