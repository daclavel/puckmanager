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

  var puckStorage={};
  puckStorage.number=puck.puckNumber.value;
  puckStorage.projectName=puck.projectName.value;
  puckStorage.managerName=puck.manager.value;
  puckStorage.parentId="harvester";
  puckStorage.creationDate=new Date().toISOString().slice(0, 10);
  puckStorage.endTestDate="";
  puckStorage.state="created";

  createPuckDiv(puckStorage);

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
      ev.dataTransfer.setData("from", "recycler");
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
  auditStorage= shallowCopy(puckStorage);
  if ( ev.dataTransfer.getData("from") == "harvester"){
    auditStorage.action="moveFromHarvesterToDewar";
    document.getElementById(data).classList.remove("created")
    document.getElementById(data).classList.add("storeUntested")
    puckStorage.state="storeUntested";
    
  }
  else if ( ev.dataTransfer.getData("from") == "test"){
    auditStorage.action="moveFromTestToDewar";
    puckStorage.endTestDate=new Date().toISOString().slice(0, 10);
    addEndTestDiv(document.getElementById(data),puckStorage.endTestDate)
    document.getElementById(data).classList.remove("storeUntested")
    document.getElementById(data).classList.add("storeTested")
    puckStorage.state="storeTested";
  }
  else if ( ev.dataTransfer.getData("from") == "recycler"){
    ev.preventDefault();
    return;
    //auditStorage.action="moveFromRecyclerToDewar";
    //document.getElementById(data).classList.removed("recycled")
  }
  puckStorage.parentId=ev.target.id;
  storage.audit.push(auditStorage);
  savePuckLocalStorage(storage);
  drop(ev); 
}

function dropToTest(ev) {
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  var puckStorage=storage.puck[data];
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
      ev.preventDefault();
      return;
      //auditStorage.action="moveFromRecyclerToTest";
  }
  puckStorage.parentId=ev.target.id;
  document.getElementById(data).classList.add("testing")
  puckStorage.state="storeTested";
  storage.audit.push(auditStorage);
  savePuckLocalStorage(storage);
  drop(ev);
}


function dropToRecycler(ev) {
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  document.getElementById(data).classList.remove("testing","created","storeTested","storeUntested");
  document.getElementById(data).classList.add("recycled");
  var puckStorage=storage.puck[data];
  puckStorage.state="recycled";
  puckStorage.parentId=ev.target.id;
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
