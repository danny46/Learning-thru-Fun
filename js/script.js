window.onload = function() {

    var $ = function(selector) {
        return document.querySelector(selector);
    };

    var len, vlen, hlen, no;
    var startButton = $('#startBtn');
    var endButton = $('#endBtn');
    var content = $("#content");
    var explosives = [],
        randomNum = [],
        checkBoxes = [],
        lists, explosiveKeys = [];
    var regExp = /\D+/;
    var instructions = $('#instruction');
    instructions.onclick = instructionShow;
    endButton.onclick = endGame;
    startButton.onclick = startGame;
    endButton.setAttribute('disabled', 'disabled');

    function startGame() {
        cleanSlateProtocol();
        len = window.prompt('Enter the no of rows');
        if (len !== null) {

            if (regExp.test(len)) {
                alert("please enter a number between 2 to 10");
                startGame();
            } else if (len < 2 || len > 10) {
                alert("please enter a number between 2 to 10");
                startGame();
            } else {
                vlen = len;
                hlen = len;
                no = 0;
                loadBoxes();
            }
            endButton.removeAttribute('disabled');
        }


    };

    function endGame() {
        alert("You Quit");
        endButton.setAttribute('disabled', 'disabled');
        cleanSlateProtocol();
    };

    function loadBoxes() {
        for (var i = 0; i < len; i++) {

            var ul = document.createElement('ul');
            ul.setAttribute('data-key', i);
            for (var j = 0; j < hlen; j++) {

                var li = document.createElement('li');
                li.className = "box";

                var k = i.toString() + "," + j.toString();
                li.setAttribute('data-key', k);
                li.setAttribute('data-no', no);
                ul.appendChild(li);
                no++;
            };

            content.appendChild(ul);
            hlen = vlen;
        };

        attachEvents();
    };


    function clicked(event) {

        var clickedKey, clickedElement, count = 0;

        if (event.target.tagName === "LI") {
            clickedElement = event.target;
            clickedKey = event.target.getAttribute('data-key');
            count = event.target.getAttribute('data-count');
        } else {
            clickedElement = event.target.parentNode;
            clickedKey = event.target.parentNode.getAttribute('data-key');
            count = event.target.parentNode.getAttribute('data-count');
        }

        if (explosiveKeys.lastIndexOf(clickedKey) != -1) {

            for (var i = 0; i < lists.length; i++) {

                var blastedKey = lists[i].getAttribute('data-key');
                if (lists[i].childNodes[0] != undefined) {

                    lists[i].childNodes[0].style.visibility = "visible";
                } else {
                    lists[i].style.backgroundColor = "#CCCCCC";
                }

                if (explosiveKeys.lastIndexOf(blastedKey) != -1) {

                    lists[i].innerHTML = "<img class=\"blast\" src=\"images/blasted.png\" alt=\"blastedBomb\" title=\"blastedBomb\" >";
                    lists[i].childNodes[0].style.visibility = "visible";



                }
            }

            loseGame();

        } else if (count === null) {

            clickedElement.style.backgroundColor = "#CCCCCC";
            openClues(clickedKey);

        } else {

            clickedElement.childNodes[0].style.visibility = "visible";
            checkGameOver();

        }
    };


    function checkGameOver() {
        var flag = 0;
        for (var i = 0; i < lists.length; i++) {
            var selectedKey = lists[i].getAttribute('data-key');
            if (explosiveKeys.lastIndexOf(selectedKey) === -1) {
                if (lists[i].childNodes[0] != undefined) {
                    if (lists[i].childNodes[0].style.visibility) {
                        continue;

                    } else {

                        flag = -1;
                    }
                }
            }
        }

        if (flag === 0) {
            for (var i = 0; i < lists.length; i++) {

                var blastedKey = lists[i].getAttribute('data-key');
                if (lists[i].childNodes[0] != undefined) {

                    lists[i].childNodes[0].style.visibility = "visible";
                } else {
                    lists[i].style.backgroundColor = "#CCCCCC";
                }

                if (explosiveKeys.lastIndexOf(blastedKey) != -1) {
                    lists[i].childNodes[0].style.visibility = "visible";
                }
            }


            winGame();
        }
    };

    function attachEvents() {

        lists = $('#content').getElementsByTagName('li');
        for (var i = lists.length - 1; i >= 0; i--) {
            lists[i].addEventListener('click', clicked, false);

        };
        generateRandomNo();
    };

    function generateRandomNo() {

        var limit = len * len;
        for (var i = 0; i < len - 1; i++) {
            var randomNo = Math.floor(Math.random() * (limit - 0));
            randomNum.push(randomNo);
        };

        dropExplosives();
    };

    function dropExplosives() {

        for (var i = 0; i < lists.length; i++) {
            var attrNo = lists[i].getAttribute('data-no');


            for (var j = randomNum.length - 1; j >= 0; j--) {

                if (attrNo == randomNum[j]) {

                    explosiveKey = lists[i].getAttribute('data-key');
                    explosiveKeys.push(explosiveKey);
                    lists[i].innerHTML = "<img src=\"images/bomb.jpg\" alt=\"bomb\" title=\"bomb\" >";
                }
            };
        };
        loadNumbers();
    };

    function loadNumbers() {
        for (var i = 0; i < lists.length; i++) {
            var key = lists[i].getAttribute('data-key');

            if (explosiveKeys.lastIndexOf(key) === -1) {
                var splitArr = key.split(',');

                var a = splitArr[0];
                var b = splitArr[1];

                var count = 0;
                var initOne = a - 1;
                var initTwo = b - 1;
                var limOne = parseInt(a) + 1;
                var limTwo = parseInt(b) + 1;



                for (var m = initOne; m <= limOne; m++) {
                    for (var n = initTwo; n <= limTwo; n++) {
                        var expKey = m.toString() + "," + n.toString();
                        if (expKey === key) {
                            continue;
                        } else if (explosiveKeys.lastIndexOf(expKey) != -1) {
                            count++;
                        }
                    }
                }
                if (count != 0) {
                    lists[i].setAttribute('data-count', count);
                    lists[i].innerHTML = lists[i].innerHTML + "<p>" + count + "</p>";
                }

            }

        };
    };

    function cleanSlateProtocol(arg) {

        $('#content').innerHTML = "";
        len = 0;
        vlen = 0;
        hlen = 0;
        no = 0;
        explosives = [],
        randomNum = [],
        lists = [];
        explosiveKeys = [];
    }

    function loseGame() {
        for (var i = 0; i < lists.length; i++) {
            lists[i].removeEventListener('click', clicked);
        }
        endButton.setAttribute('disabled', 'disabled');
        content.innerHTML = content.innerHTML + "<h3>YOU LOST</h3>";
    };

    function winGame() {
        for (var i = 0; i < lists.length; i++) {
            lists[i].removeEventListener('click', clicked);
        }
        endButton.setAttribute('disabled', 'disabled');
        content.innerHTML = content.innerHTML + "<h4>YOU WON!!</h4>";
    };


    function openClues(clickedKey) {
        clues(clickedKey);

        function clues(clickedKey) {

            var splitArr = clickedKey.split(',');
            var a = splitArr[0];
            var b = splitArr[1];
            var selElement = null;
            var initOne = a - 1;
            var initTwo = b - 1;
            var limOne = parseInt(a) + 1;
            var limTwo = parseInt(b) + 1;

            for (var m = initOne; m <= limOne; m++) {
                for (var n = initTwo; n <= limTwo; n++) {
                    var expKey = m.toString() + "," + n.toString();

                    if (expKey === clickedKey) {
                        continue;
                    } else if (explosiveKeys.lastIndexOf(expKey) === -1) {

                        var search = "[data-key=\"" + expKey + "\"]";
                        selElement = $(search);
                        if (selElement != null) {

                            if (selElement.childNodes[0] !== undefined) {
                                selElement.childNodes[0].style.visibility = "visible";
                            } else {


                                selElement.style.backgroundColor = "#CCCCCC";

                                if (selElement.getAttribute('data-flag') != 'true') {
                                    checkBoxes.push(selElement.getAttribute('data-key'));
                                    selElement.setAttribute('data-flag', 'true');

                                }

                            }


                        }

                    }
                }
            }

        }

        for (var i = 0; i < checkBoxes.length; i++) {
            clues(checkBoxes[i]);
        };
        checkGameOver();
        checkBoxes = [];

    };

    function instructionShow() {

        content.innerHTML = "<h2>Instructions</h2><p id=\"text\">The purpose of the game is to open all the cells of the board which do not contain a bomb.</br> You lose if you set off a bomb cell.</br>Every non-bomb cell you open will tell you the total number of bombs in the eight neighboring cells.</br>To start a new game (abandoning the current one), just click on the Start new game button.</br>To end the current game, just click on the End game button.</br>Happy mine hunting!</p>";
    };


};
