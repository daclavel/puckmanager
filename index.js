function createPuck(puck){

  var puckDiv=document.createElement("div");
  var puckStorage= {};
  puckDiv.id=puck.puckNumber.value;
  puckDiv.classList.add("puck");
  puckDiv.setAttribute("draggable","true");
  puckDiv.setAttribute("ondragstart","drag(event)");
  
  var puckNumberDiv=document.createElement("div");
  puckNumberDiv.classList.add("puckElement");
  puckDiv.appendChild(puckNumberDiv);
  var puckNumberText=document.createTextNode(puck.puckNumber.value);
  puckNumberDiv.appendChild(puckNumberText);
  puckDiv.appendChild(puckNumberDiv);
  puckStorage.number=puck.puckNumber.value;

  var projectNameDiv=document.createElement("div");
  projectNameDiv.classList.add("puckElement");
  var projectNameText=document.createTextNode(puck.projectName.value);
  projectNameDiv.appendChild(projectNameText)
  puckDiv.appendChild(projectNameDiv);
  puckStorage.projectName=puck.projectName.value;

  var puckManagerDiv=document.createElement("div");
  puckManagerDiv.classList.add("puckElement");
  var puckManagerText=document.createTextNode(puck.manager.value);
  puckManagerDiv.appendChild(puckManagerText)
  puckDiv.appendChild(puckManagerDiv);
  puckStorage.managerName=puck.manager.value;

  var puckCreationDateDiv=document.createElement("div");
  puckCreationDateDiv.classList.add("puckElement");
  puckDiv.appendChild(puckCreationDateDiv);
  var creationDate=new Date().toISOString().slice(0, 10)
  var puckCreationDateText=document.createTextNode(creationDate);
  puckCreationDateDiv.appendChild(puckCreationDateText)
  puckDiv.appendChild(puckCreationDateDiv);
  puckStorage.location="harvester";
  puckStorage.creationDate=creationDate;
  puckStorage.endTestDate="";

  document.getElementById("harvester").appendChild(puckDiv);

  var storage=getPuckLocalStorage();
  storage.puck[puck.puckNumber.value]=puckStorage;
  auditStorage=shallowCopy(puckStorage);
  auditStorage.action="creation";
  storage.audit.push(auditStorage);
  savePuckLocalStorage(storage);
}

function getPuckLocalStorage(){
  var puckStorage = JSON.parse(localStorage.getItem("puckManager"));
  if ( puckStorage == null ) {
    //create local storage if it doesn"t exist
    return initLocalStorage();
  }
  else {
    return puckStorage;
  }
}

function savePuckLocalStorage(puckManager){
  localStorage.setItem("puckManager",JSON.stringify(puckManager));
}

function initLocalStorage(){
  var puckStorage = {};
  puckStorage.puck={};  
  puckStorage.audit=[];  
  localStorage.setItem("puckManager",JSON.stringify(puckStorage));
  return puckStorage;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.effectAllowed="move";
    ev.dataTransfer.setData("text", ev.target.id);
    if (document.getElementById(ev.target.id).parentNode.id.includes("harvester")){
      ev.dataTransfer.setData("from", "harvester");
    }else if (document.getElementById(ev.target.id).parentNode.id.includes("canister")) {
      ev.dataTransfer.setData("from", "dewar");
    }else if (document.getElementById(ev.target.id).parentNode.id.includes("test")) {
      ev.dataTransfer.setData("from", "test");
    }else if (document.getElementById(ev.target.id).parentNode.id.includes("recycler")) {
      ev.dataTransfer.setData("from", "test");
    }

}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function dropToDewar(ev) {
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  var puckStorage=storage.puck[data];
  puckStorage.location=ev.target.id;
  auditStorage= shallowCopy(puckStorage);
  if ( ev.dataTransfer.getData("from") == "harvester"){
    auditStorage.action="moveFromHarvesterToDewar";
  }
  else if ( ev.dataTransfer.getData("from") == "test"){
    auditStorage.action="moveFromTestToDewar";
    puckStorage.endTestDate=new Date().toISOString().slice(0, 10);
    document.getElementById(data).appendChild(document.createTextNode(puckStorage.endTestDate));
  }
  if ( ev.dataTransfer.getData("from") == "recycler"){
    auditStorage.action="moveFromRecyclerToDewar";
  }
  storage.audit.push(auditStorage);
  savePuckLocalStorage(storage);
  drop(ev); 
}

function dropToTest(ev) {
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  var puckStorage=storage.puck[data];
  puckStorage.location=ev.target.id;
  auditStorage= shallowCopy(puckStorage);
  if ( ev.dataTransfer.getData("from") == "harvester"){
    auditStorage.action="moveFromHarvesterToTest";
  }
  else if ( ev.dataTransfer.getData("from") == "dewar"){
    if ( puckStorage.endTestDate.length === 0 ){
      auditStorage.action="moveFromDewarToTest";
    }
    else {
      //case where puck has already been in Test
      ev.preventDefault();
      return;
    }
  }
  if ( ev.dataTransfer.getData("from") == "recycler"){
    auditStorage.action="moveFromRecyclerToTest";
  }
  storage.audit.push(auditStorage);
  savePuckLocalStorage(storage);
  drop(ev);
}


function dropToRecycler(ev) {
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  var puckStorage=storage.puck[data];
  puckStorage.location=ev.target.id;
  auditStorage= shallowCopy(puckStorage);
  auditStorage.action="moveFrom"+ev.dataTransfer.getData("from").charAt(0).toUpperCase()+ev.dataTransfer.getData("from").slice(1)+"ToRecycler";
  storage.audit.push(auditStorage);
  savePuckLocalStorage(storage);
  drop(ev);
}

function shallowCopy(obj) {
    var result = {};
    for (var i in obj) {
        result[i] = obj[i];
    }
    return result;
}
