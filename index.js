function createPuckDiv(puckStorage){
  var puckDiv=document.createElement("div");
  puckDiv.id=puckStorage.number;
  puckDiv.classList.add("puck");
  puckDiv.classList.add(puckStorage.state);
  puckDiv.setAttribute("draggable","true");
  puckDiv.setAttribute("ondragstart","drag(event)");

  var puckNumberDiv=document.createElement("div");
  puckNumberDiv.classList.add("puckElement");
  puckDiv.appendChild(puckNumberDiv);
  var puckNumberText=document.createTextNode(puckStorage.number);
  puckNumberDiv.appendChild(puckNumberText);
  puckDiv.appendChild(puckNumberDiv);

  var projectNameDiv=document.createElement("div");
  projectNameDiv.classList.add("puckElement");
  var projectNameText=document.createTextNode(puckStorage.projectName);
  projectNameDiv.appendChild(projectNameText)
  puckDiv.appendChild(projectNameDiv);

  var puckManagerDiv=document.createElement("div");
  puckManagerDiv.classList.add("puckElement");
  var puckManagerText=document.createTextNode(puckStorage.managerName);
  puckManagerDiv.appendChild(puckManagerText)
  puckDiv.appendChild(puckManagerDiv);

  var puckCreationDateDiv=document.createElement("div");
  puckCreationDateDiv.classList.add("puckElement");
  puckDiv.appendChild(puckCreationDateDiv);
  var puckCreationDateText=document.createTextNode(puckStorage.creationDate);
  puckCreationDateDiv.appendChild(puckCreationDateText)
  puckDiv.appendChild(puckCreationDateDiv);

  if (puckStorage.endTestDate != "" ){
    addEndTestDiv(puckDiv,puckStorage.endTestDate);
  }
  var targetDiv=document.getElementById(puckStorage.parentId).appendChild(puckDiv);
  return puckDiv;
}

function addEndTestDiv(puckDiv,endTestDate){
    var puckEndTestDateDiv=document.createElement("div");
    puckEndTestDateDiv.classList.add("puckElement");
    puckDiv.appendChild(puckEndTestDateDiv);
    var puckEndTestDateText=document.createTextNode(endTestDate);
    puckEndTestDateDiv.appendChild(puckEndTestDateText);
    puckDiv.appendChild(puckEndTestDateDiv);
}


function createPuck(puck){
  if (document.getElementById("harvester").childElementCount >= 3){
    alert("failed to create puck, harvester is full")
    return;
  }
  var storage=getPuckLocalStorage();
  var count=0;
  for ( var key in storage.puck){
    if (storage.puck[key].state != "recycled"){
      count++;
    }
  }
  if (count >= 60 ){
    alert("failed to create puck. Max number of puck has reach his limit")
    return;
  }
  var puckStorage={};
  puckStorage.number=puck.puckNumber.value;
  puckStorage.projectName=puck.projectName.value;
  puckStorage.managerName=puck.manager.value;
  puckStorage.parentId="harvester";
  puckStorage.creationDate=new Date().toISOString().slice(0, 10);
  puckStorage.endTestDate="";
  puckStorage.state="created";

  createPuckDiv(puckStorage);

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
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function dropToDewar(ev) {
  if (ev.target.firstElementChild != null ){
    ev.preventDefault();
    return;
  }
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  var puckStorage=storage.puck[data];
  auditStorage= shallowCopy(puckStorage);
  if ( puckStorage.state == "created"){
    auditStorage.action="moveFromHarvesterToDewar";
    document.getElementById(data).classList.remove("created")
    document.getElementById(data).classList.add("storeUntested")
    puckStorage.state="storeUntested";
  }
  else if ( puckStorage.state == "testing"){
    auditStorage.action="moveFromMassifToDewar";
    puckStorage.endTestDate=new Date().toISOString().slice(0, 10);
    addEndTestDiv(document.getElementById(data),puckStorage.endTestDate)
    document.getElementById(data).classList.remove("testing")
    document.getElementById(data).classList.add("storeTested")
    puckStorage.state="storeTested";
  }
  else if ( puckStorage.state == "storeUntested" ){
    auditStorage.action="moveFromDewarToDewar";
  }
  else {
    ev.preventDefault();
    return;
  }
  puckStorage.parentId=ev.target.id;
  storage.audit.push(auditStorage);
  savePuckLocalStorage(storage);
  drop(ev); 
}

function dropToMassif(ev) {
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  var puckStorage=storage.puck[data];
  auditStorage= shallowCopy(puckStorage);
  if ( puckStorage.state == "storeUntested" ){
    auditStorage.action="moveFromDewarToMassif";
    puckStorage.parentId=ev.target.id;
    document.getElementById(data).classList.remove("storeTested")
    document.getElementById(data).classList.add("testing")
    puckStorage.state="testing";
    storage.audit.push(auditStorage);
    savePuckLocalStorage(storage);
    drop(ev);
  }
  else {
    ev.preventDefault();
    return;
  }
}


function dropToRecycler(ev) {
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  var puckStorage=storage.puck[data];
  if ( puckStorage.state == "storeTested" ){
    document.getElementById(data).classList.remove("storeTested");
    document.getElementById(data).classList.add("recycled");
    puckStorage.state="recycled";
    puckStorage.parentId=ev.target.id;
    auditStorage= shallowCopy(puckStorage);
    auditStorage.action="moveFromDewarToRecycler";
    //auditStorage.action="moveFrom"+ev.dataTransfer.getData("from").charAt(0).toUpperCase()+ev.dataTransfer.getData("from").slice(1)+"ToRecycler";
    storage.audit.push(auditStorage);
    savePuckLocalStorage(storage);
    drop(ev);
  }
  else {
      ev.preventDefault();
      return;
  }
}

function shallowCopy(obj) {
    var result = {};
    for (var i in obj) {
        result[i] = obj[i];
    }
    return result;
}

function loadData(){
  var storage=getPuckLocalStorage();
  for (var puck in storage.puck){
    createPuckDiv(storage.puck[puck]);
  }
}
function clearPucks(){
  puckDivs=document.getElementsByClassName("puck");
  for (i=0;i<puckDivs.length;i++){
    try {
        puckDivs[i].parentNode.removeChild(puckDivs[i]);
    }catch (err){
       log.console(err);
    }
  }
}

//load data at startup
document.addEventListener("DOMContentLoaded", function(event) {
    // Your code to run since DOM is loaded and ready
    loadData();
});

function preventMoveElementIfTargetFull(target,count){
  //every element has a first child that we include in the count
  if (target.childElementCount === count + 1){
    alert("failed to move element, target is full")
    ev.preventDefault();
    return true;
  }
}
