Hangman v0.1

A simple game of hangman, using a small list of words taken from https://www.mit.edu/~ecprice/wordlist.10000 with the largest words being 12 characters.
Enter a letter to see if it is part of the word you are trying to guess, one you are sure you have found the word then enter the word into the box.
Make sure to hit the guess button to make your guess. You will only have 7 tries (6 parts of the hangman plus one extra) to guess the word.

This game is supposed to be a simple reproduction of the classic hangman word guessing game but done through a webpage.
Despite being mostly complete this game does have some issues, one of which being that you have to enter in a single letter exactly if you want to guess it.
If you enter in say 2 letters and it's not the word the game will count that as a "penalty".
I will most likely not fix this issue however since if I did the player could just enter in the whole alphabet to be able to win the game every single time.
Another issue is that you need to reload the page if you lost/won to be able to restart the game. I will be keeping it like that.

For a possible future release I could use fetch() or XMLHttpRequest to get the list of words from that one MIT list (or maybe even another list).
I will probably just keep the page the way it is since it works just as well with a smaller word list.

Copyright 2023 Alexander Raptis