let current_card_id_txt = document.getElementById("current_card_id");
let card_id_txt = document.getElementById("card_id");
let card_txt = document.getElementById("card");
let update_btn = document.getElementById("update_btn");
let table_div = document.getElementById("cells_table");

function split_card_text(card_text) {
  let lines = card_text.split("\n");
  let card = [];
  lines.forEach(function(line){
    card.push(line.split(","));
  });
  return card;
}

function set_card_id(p_card_id){
  chrome.storage.sync.get("card_id", (obj) => {
    console.log(obj);
    card_id = parseInt((p_card_id)? p_card_id : obj.card_id);
    if (card_id){
      current_card_id_txt.innerHTML = card_id;
      chrome.storage.sync.set({ "card_id": card_id }); 
    }
    else{
      alert("Enter card id!");
    }
  });
}

function set_card(card_text){
  card = split_card_text(card_text);
  if(card && card_text.length > 50){
    chrome.storage.sync.set({ "card": card });
    //generate_table();
    console.log(card);
  }
}

update_btn.addEventListener("click", async () => {
  if (card_id_txt.value && card_txt.value){
    set_card_id(card_id_txt.value);
    set_card(card_txt.value);    
  }
});

function plot_table(cells){
  if (!cells) return;
  let table = document.createElement("table");

  let trh = document.createElement("tr");
  for (var i = 0; i < cells[0].length; i++) {
    let th = document.createElement("th");
    th.innerHTML = String.fromCharCode("A".charCodeAt() + i);
    trh.append(th);
  }
  table.append(trh);

  for (var i = 0; i < cells.length; i++) {
    let tr = document.createElement("tr");
    for (var j = 0; j < cells[i].length; j++) {
      let td = document.createElement("td");
      td.innerHTML = cells[i][j];
      tr.append(td);
    }
    table.append(tr);
  }
  table_div.innerHTML = "";
  table_div.append(table);
}

function generate_table() {
  chrome.storage.sync.get("card", (obj) => {
    console.log(obj);
    if(card){
      card_txt.value = "";
      obj.card.forEach(function(row){
        card_txt.value += row.join(",") + "\n";
      });
    }
  });
  setTimeout(function(){if (card_txt.value) plot_table(split_card_text(card_txt.value));}, 100);
}

set_card_id();
//generate_table();
