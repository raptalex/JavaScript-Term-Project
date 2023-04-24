$(function() {
    // Assume all of these use ASCII or Latin UTF-8 characters
    let words = [
        "twice",
        "idea",
        "times",
        "refined",
        "conjunction",
        "elder",
        "decade",
        "ross",
        "transexual",
        "math",
        "complicated",
        "jeep",
        "bidding",
        "peeing",
        "generates",
        "italia",
        "attachment",
        "victory",
        "management",
        "timber",
        "vitamins",
        "john",
        "ribbon",
        "theoretical",
        "experiences",
        "makers",
        "realtors",
        "gazette",
        "shaped",
        "accessing",
        "ontario",
        "remaining",
        "airports",
        "monitors",
        "incorporate",
        "dust",
        "struggle",
        "graphics",
        "cartoons",
        "town",
        "flux",
        "fred",
        "remix",
        "donation",
        "enzyme",
        "book",
        "flooring",
        "puerto",
        "verified",
        "poster",
        "cheap",
    ];

    // Get parts of hangman SVG
    let hangManParts = $("svg#hangman > g").children().toArray();
    let tries = hangManParts.length;
    let penalties = 0;
    let winner = false;
    let loser = false;

    let lettersContainer = $("div#lettersContainer");
    let wordDifficulty = $("p#wordDifficulty");
    let gameStatus = $("p#gameStatus");

    let randomWord = words[Math.floor(Math.random() * words.length)];
    let wordLength = randomWord.length;

    // Show how difficult the word is
    if(wordLength <= 6) {
        console.info("Easy word.");
        wordDifficulty.text("Easy word: " + wordLength + " Characters");
    } else if(wordLength <= 8) {
        console.info("Medium word.");
        wordDifficulty.text("Medium word: " + wordLength + " Characters");
    } else {
        console.info("Hard word.");
        wordDifficulty.text("Hard word: " + wordLength + " Characters");
    }

    // Add letter box elements
    for(let i = 0;i < randomWord.length;i++) {
        let letterElem = $("<div>");

        letterElem.addClass("letter");
        //letterElem.text(randomWord[i]);

        lettersContainer.append(letterElem);
    }

    // Get the children of the container that we just added
    let letterElems = lettersContainer.children();

    //console.log(letterElems);
    //console.log(randomWord);

    $("button#enterguess").on("click", function() {
        // Event listener for submit button
        if(loser) return;
        if(winner) return;

        let _val = $("input#guess").val().toLowerCase();

        // See if player managed to just guess the word
        if(_val === randomWord) {
            // Play out win sequence
            winner = true;

            gameStatus.text("You won! Reload to try again with a different word!");
            gameStatus.addClass("win");

            // Reveal word
            for(let i=0;i<randomWord.length;i++) {
                letterElems[i].textContent = randomWord[i];
            }
        } else if(randomWord.includes(_val)) {
            // Then see if they found any letters in the word
            console.info("It does have some letters");

            let indices = [];

            // See if letter is in the word
            if(_val.length >= 1) {
                for(let i=0;i < randomWord.length;i++) {
                    // If letter is equal, record at what index it is found at
                    if(randomWord[i] === _val[0])
                        indices.push(i);
                }

                if(indices.length != 0) {
                    //console.log(indices);

                    // Reveal letters
                    indices.forEach(function(item) {
                        letterElems[item].textContent = randomWord[item];
                    });
                } else {
                    // Add body part to hangman or trigger game over
                    handlePenalty();
                }
            } else {
                // Letter is not in word
                // Add body part to hangman or trigger game over
                handlePenalty();
            }
        } else if(_val) {
            // There is something in the input but other checks have failed
            // Add body part to hangman or trigger game over
            handlePenalty();
        }
    });

    function handlePenalty() {
        // Handles a penalty in the game or triggers a game over
        if(tries != penalties) {
            hangManParts[penalties].style.opacity = "1";
            penalties++;
        } else {
            gameStatus.text("You have lost! Reload to try again!");
            gameStatus.addClass("loss");
            loser = true;
        }
    }
});