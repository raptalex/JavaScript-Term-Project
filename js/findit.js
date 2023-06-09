let boxes = document.querySelectorAll("div.box");
let nums = [];
let tries = 2;
let won = false;
let lost = true;

// Main game code
for(let i=0;i<boxes.length;i++) {
    // Create random numbers depending on the amount
    // of mystery boxes
    if(i < boxes.length - 1)
        nums.push(randNumber(1, 10));
    else {
        if(!nums.includes(9))
            nums.push(9);
        else
            nums.push(randNumber(1, 10));
    }

    boxes[i].addEventListener("click", function(e) {
        let i = parseInt(e.target.getAttribute("data-id"));
        console.info(nums[i]);
        decideFate(nums[i]);
    });
}

updateTries(tries);

// Game functions
function randNumber(from, to) {
    // Get a random number from a range
    return Math.floor(Math.random() * (to - from + 1) ) + from;
}

function shufflearray(a) {
    // Shuffle a JavaScript array
    let idx = a.length, randidx;

    while(idx != 0) {
        randidx = Math.floor(Math.random * idx);
        idx--;

        [a[idx], a[randidx]] = [
            a[randidx], a[idx]
        ];
    }

    return a;
}

function updateTries(_tries) {
    document.getElementById("tries").textContent = "Tries: " + _tries;
}

function decideFate(i) {
    // Shows a result depending on what box you click

    //let triesCont = document.getElementById("tries");
    let message = document.getElementById("message");

    if(!won && tries > 0) {
        switch(i) {
            case 9:
                message.textContent = "That is the correct box! You won!";
                won = true;
                break;
            default:
                message.textContent = "That is not the correct box.";
        }
        tries--;
        updateTries(tries);

        if(tries <= 0)
            message.textContent = "You Lose! Reload the Page to try again!"; 
    }
}