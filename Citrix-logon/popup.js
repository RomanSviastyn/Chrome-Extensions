// login button
let login_btn = document.getElementById("login_btn");

// When the button is clicked, inject login_with_matrix into current page
login_btn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: login_with_matrix,
  });
});


// The body of this function will be execuetd as a content script inside the
// current page
function login_with_matrix() {
    function parse_text(text){
        var result = {"card_serial_number": null, "cells": []};
        var card_serial_number_pattern = "using a card with serial number ";
        var card_serial_number_index = text.indexOf(card_serial_number_pattern) + card_serial_number_pattern.length;
        var i = 0, n = 0, a = "";
        while(i++ < 3)
        {
            n = text.indexOf("[", n) + 1;
            a = text.substr(n, 2);
            result["cells"].push(a);
        }
        result["card_serial_number"] = parseInt(text.substr(card_serial_number_index, text.indexOf(".", card_serial_number_index) - card_serial_number_index))
        return result;
    }
    
    let div_text = document.getElementById("dialogueStr").innerText;
    let params = parse_text(div_text);
    let code = "";
    let input_box = document.getElementById("response");
    let login_btn = document.getElementById("SubmitButton");
    
    //console.log(params);
    chrome.storage.sync.get(["card_id", "card"], (obj) => {
        //console.log(obj);
        if (obj && obj.card !== undefined) {
            if (obj.card_id == params["card_serial_number"]) {
                params["cells"].forEach(function(e){
                    code += obj.card[parseInt(e[1])-1][e[0].charCodeAt()-"A".charCodeAt()];
                });
                console.log(code);
                input_box.value = code;
                //login_btn.click();
            }
            else{
                alert("Card serial number doesn't match!\n"+
                    "Update your card!\n"+
                    "Go to extension options page.");
            }
        }
        else{
            alert("Enter your card!\nGo to extension options page.");
        }
    });
}

