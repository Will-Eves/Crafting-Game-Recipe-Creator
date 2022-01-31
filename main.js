//Start of item loading stuff
var items = [];
var itemnames = [];
var recipies = [];

var gamedata;

function addItem(name, color="white"){
    items[name] = [name, color, "none"];
}

function decorateItem(name, decoration){
    items[name][2] = decoration;
    itemnames.push(name);
}

function addRecipe(name, items){
    recipies.push([name, items]);
}

function createElement(val){
    var out = document.createElement("option");
    out.value = val;
    out.innerText = val;
    return out;
}

function LoadGame(name) {

    var recipeitems = document.getElementsByName("recipeselect");

    fetch(name)
    .then(response => response.text())
    .then(data => {
        //Parse the File
        var dat = data.split(' ');
        var gamedata = [];
        for(var i = 0; i < dat.length; i++){
            var ind = dat[i].split('\n');
            for(var j = 0; j < ind.length; j++){
                gamedata.push(ind[j]);
            }
        }

        //Create the Objects
        var i = 0;
        while(i < gamedata.length){
            var addToI = 1;

            if(gamedata[i] == "ITEM"){
                addItem(gamedata[i + 1], gamedata[i + 2]);
                addToI += 2;
            }else if(gamedata[i] == "RECIPE"){
                addRecipe(gamedata[i + 1], [gamedata[i + 2], gamedata[i + 3]]);
                addToI += 3;
            }else if(gamedata[i] == "DECORATE"){
                decorateItem(gamedata[i + 1], gamedata[i + 2]);
                addToI += 2;
            }else if(gamedata[i] == "ITEMFULL"){
                //!item wood earth energy brown none
                addItem(gamedata[i + 1], gamedata[i + 4]);
                addRecipe(gamedata[i + 1], [gamedata[i + 2], gamedata[i + 3]]);
                decorateItem(gamedata[i + 1], gamedata[i + 5]);
                addToI += 5;

                var element = createElement(gamedata[i + 1]);
                recipeitems[0].appendChild(element);
                var element1 = createElement(gamedata[i + 1]);
                recipeitems[1].appendChild(element1);
            }

            i += addToI;
        }
    });
}
//End of item loading stuff

function updateInputs(){
    var inputs = [
        document.getElementById("nameinput"),
        document.getElementById("recipe1"),
        document.getElementById("recipe2"),
        document.getElementById("color"),
        document.getElementById("decoration")
    ];

    //Some inputs checks
    inputs[0].value = inputs[0].value.toLowerCase();
    var inputsplit = inputs[0].value.split('')
    var outinput = "";
    for(var i = 0; i < inputsplit.length; i++){
        if(inputsplit[i] != ' ') outinput += inputsplit[i];
        else{
            document.getElementById("nameinputwarning").innerText = "No spaces in names";
            setTimeout(function(){
                document.getElementById("nameinputwarning").innerText = "";
            }, 2000);
        }
    }
    inputs[0].value = outinput;
    var bad = false;
    for(var i = 0; i < itemnames.length; i++){
        if(inputs[0].value == itemnames[i]){
            document.getElementById("nameinputwarning").innerText = "Item name already exists";
            bad = true;
        }
    }
    if(!bad){
        document.getElementById("nameinputwarning").innerText = "";
    }

    var recipe = [inputs[1].value, inputs[2].value];
    bad = false;
    for(var i = 0; i < recipies.length; i++){
        if(recipe[0] == recipies[i][1][0] && recipe[1] == recipies[i][1][1]) bad = true;
        if(recipe[1] == recipies[i][1][0] && recipe[0] == recipies[i][1][1]) bad = true;
    }
    if(bad){
        document.getElementById("recipeinputwaring").style.color = "red";
        document.getElementById("recipeinputwaring").innerText = "Recipe Already Exists";
    }else{
        document.getElementById("recipeinputwaring").style.color = "green";
        document.getElementById("recipeinputwaring").innerText = "Recipe Is Good";
    }

    if(inputs[4].value.match(/\.(jpeg|jpg|gif|png)$/) == null && inputs[4].value != "none"){
        document.getElementById("decorationinputwarning").innerText = "Decoration must be an image";
    }else{
        document.getElementById("decorationinputwarning").innerText = "";
    }

    var output = document.getElementById("example");
    output.innerText = inputs[0].value;
    if(inputs[4].value != "none") output.style = "background-color:" + inputs[3].value + ";background-image:url('" + inputs[4].value + "');";
    else output.style = "background-color:" + inputs[3].value + ";background-image: none;";
}

function createCommand(){
    //Get Inputs
    var inputs = [
        document.getElementById("nameinput"),
        document.getElementById("recipe1"),
        document.getElementById("recipe2"),
        document.getElementById("color"),
        document.getElementById("decoration")
    ];

    //Input Checks
    var bad = false;

    inputs[0].value = inputs[0].value.toLowerCase();
    var inputsplit = inputs[0].value.split('')
    for(var i = 0; i < inputsplit.length; i++){
        if(inputsplit[i] == ' '){
            bad = true;
        }
    }
    for(var i = 0; i < itemnames.length; i++){
        if(inputs[0].value == itemnames[i]){
            bad = true;
        }
    }

    var recipe = [inputs[1].value, inputs[2].value];
    for(var i = 0; i < recipies.length; i++){
        if(recipe[0] == recipies[i][1][0] && recipe[1] == recipies[i][1][1]) bad = true;
        if(recipe[1] == recipies[i][1][0] && recipe[0] == recipies[i][1][1]) bad = true;
    }

    if(inputs[4].value.match(/\.(jpeg|jpg|gif|png)$/) == null && inputs[4].value != "none"){
        bad = true;
    }

    if(bad){
        alert("Recipe Request Could Not Be Completed. Please Refer To The Red Text.");
        return;
    }

    var command = "";

    command += "!item ";
    command += inputs[0].value + " ";
    command += inputs[1].value + " ";
    command += inputs[2].value + " ";
    command += inputs[3].value + " ";
    command += (inputs[4].value == "none" ? "none" : "url('" + inputs[4].value + "')");

    alert(command);

    var data = {
        username : "Recipe Website Bot",
        avatar_url : "https://yt3.ggpht.com/fL3LmVFRjwO8_TnBPG4XAdEzWaN3bmM2uvvkaUXvwvJls2u0FmsszYHyusMm3v2GBk3PxIXI=s600-c-k-c0x00ffffff-no-rj-rp-mo",
        content : command
    }

    const request = new XMLHttpRequest();
    request.open("POST", "https://discord.com/api/webhooks/937494199815794718/VzQCtdR5QHBpIGZurWbXUwnqAIYoefFolUlMZGqaWrzBQnnZvj2hPC9Inyn5d72R5__K");
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(data));
}

function onload(){
    LoadGame("https://raw.githubusercontent.com/Will-Eves/Crafting-Game/main/data.gamdat");
    setInterval(updateInputs, 0);
}