# ScratchCard
js plugin 

刮刮卡特效

# Basic Usage

    var sc_dom = document.getElementsByClassName("card__main")[0];
        new ScratchCard(sc_dom, {
            width: 535,
            height: 363,
            colorForward: 'gray',
            imageBackgroundSrc: 'gift_pic.jpeg',
            clearRadius: 30,
            percentToFinish: 30,
            open: function () {
                console.log("open the card");
            },
            callback: function () {
                console.log("finish");
            }
        });

# Options
* **width**: "300"

* **height**: "300

* **imageForwardSrc**: null

* **colorForward**: "gray"

* **imageBackgroundSrc**: null

* **colorBackground**: "red"

* **clearRadius**: 50

* **percentToFinish**: null

* **callback**: function

* **open**: function

