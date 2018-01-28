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
  document.getElementById(puckStorage.parentId).appendChild(puckDiv);

}

function addEndTestDiv(puckDiv,endTestDate){
    var puckEndTestDateDiv=document.createElement("div");
    puckEndTestDateDiv.classList.add("puckElement");
    puckDiv.appendChild(puckEndTestDateDiv);
    var puckEndTestDateText=document.createTextNode(endTestDate);
    puckEndTestDateDiv.appendChild(puckEndTestDateText);
    puckDiv.appendChild(puckEndTestDateDiv);
}

function createAuditDiv(auditStorage){
  var auditDiv=document.createElement("div");
  auditDiv.id="audit"+auditStorage.timestamp+"Puck"+auditStorage.number;
  auditDiv.classList.add("audit");

  var auditTimeDiv=document.createElement("div");
  auditTimeDiv.classList.add("auditCell");
  auditTimeDiv.classList.add("auditTime");
  auditDiv.appendChild(auditTimeDiv);
  var auditTimeText=document.createTextNode(auditStorage.time);
  auditTimeDiv.appendChild(auditTimeText);
  auditDiv.appendChild(auditTimeDiv);

  var auditActionDiv=document.createElement("div");
  auditActionDiv.classList.add("auditCell");
  auditActionDiv.classList.add("auditAction");
  auditDiv.appendChild(auditActionDiv);
  var auditActionText=document.createTextNode(auditStorage.action);
  auditActionDiv.appendChild(auditActionText);
  auditDiv.appendChild(auditActionDiv);

  var auditPuckNumberDiv=document.createElement("div");
  auditPuckNumberDiv.classList.add("auditCell");
  auditPuckNumberDiv.classList.add("auditPuckNumber");
  auditDiv.appendChild(auditPuckNumberDiv);
  var auditPuckNumberText=document.createTextNode(auditStorage.number);
  auditPuckNumberDiv.appendChild(auditPuckNumberText);
  auditDiv.appendChild(auditPuckNumberDiv);

  var auditPuckProjectDiv=document.createElement("div");
  auditPuckProjectDiv.classList.add("auditCell");
  auditPuckProjectDiv.classList.add("auditPuckProject");
  auditDiv.appendChild(auditPuckProjectDiv);
  var auditPuckProjectText=document.createTextNode(auditStorage.projectName);
  auditPuckProjectDiv.appendChild(auditPuckProjectText);
  auditDiv.appendChild(auditPuckProjectDiv);

  var auditPuckManagerDiv=document.createElement("div");
  auditPuckManagerDiv.classList.add("auditCell");
  auditPuckManagerDiv.classList.add("auditPuckManager");
  auditDiv.appendChild(auditPuckManagerDiv);
  var auditPuckManagerText=document.createTextNode(auditStorage.managerName);
  auditPuckManagerDiv.appendChild(auditPuckManagerText);
  auditDiv.appendChild(auditPuckManagerDiv);

  var auditPuckCreationDateDiv=document.createElement("div");
  auditPuckCreationDateDiv.classList.add("auditCell");
  auditPuckCreationDateDiv.classList.add("auditPuckCreationDate");
  auditDiv.appendChild(auditPuckCreationDateDiv);
  var auditPuckCreationDateText=document.createTextNode(auditStorage.creationDate);
  auditPuckCreationDateDiv.appendChild(auditPuckCreationDateText);
  auditDiv.appendChild(auditPuckCreationDateDiv);

  var auditPuckEndTestDateDiv=document.createElement("div");
  auditPuckEndTestDateDiv.classList.add("auditCell");
  auditPuckEndTestDateDiv.classList.add("auditPuckEndTestDate");
  auditDiv.appendChild(auditPuckEndTestDateDiv);
  var auditPuckEndTestDateText=document.createTextNode(auditStorage.endTestDate);
  auditPuckEndTestDateDiv.appendChild(auditPuckEndTestDateText);
  auditDiv.appendChild(auditPuckEndTestDateDiv);

  var logDiv=document.getElementById("log");
  logDiv.insertBefore(auditDiv,logDiv.childNodes[0]);
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
  auditStorage.time=new Date().toUTCString();
  auditStorage.timestamp=new Date().getTime();
  auditStorage.action="creation";
  storage.audit.push(auditStorage);
  savePuckLocalStorage(storage);
  createAuditDiv(auditStorage);
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
  auditStorage.time=new Date().toUTCString();
  auditStorage.timestamp=new Date().getTime();
  if ( puckStorage.state == "created"){
    auditStorage.action="moveFromHarvesterToDewar";
    document.getElementById(data).classList.remove("created")
    document.getElementById(data).classList.add("storeUntested")
    puckStorage.state="storeUntested";
  }
  else if ( puckStorage.state == "testing"){
    auditStorage.action="moveFromMassifToDewar";
    puckStorage.endTestDate=new Date().toISOString().slice(0, 10);
    auditStorage.endTestDate=puckStorage.endTestDate;
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
  createAuditDiv(auditStorage);
  drop(ev); 
}

function dropToMassif(ev) {
  var storage=getPuckLocalStorage();
  var data=ev.dataTransfer.getData("text");
  var puckStorage=storage.puck[data];
  auditStorage= shallowCopy(puckStorage);
  auditStorage.time=new Date().toUTCString();
  auditStorage.timestamp=new Date().getTime();
  if ( puckStorage.state == "storeUntested" ){
    auditStorage.action="moveFromDewarToMassif";
    puckStorage.parentId=ev.target.id;
    document.getElementById(data).classList.remove("storeTested")
    document.getElementById(data).classList.add("testing")
    puckStorage.state="testing";
    storage.audit.push(auditStorage);
    savePuckLocalStorage(storage);
    createAuditDiv(auditStorage);
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
    auditStorage.time=new Date().toUTCString();
    auditStorage.timestamp=new Date().getTime();
    auditStorage.action="moveFromDewarToRecycler";
    //auditStorage.action="moveFrom"+ev.dataTransfer.getData("from").charAt(0).toUpperCase()+ev.dataTransfer.getData("from").slice(1)+"ToRecycler";
    storage.audit.push(auditStorage);
    savePuckLocalStorage(storage);
    createAuditDiv(auditStorage);
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
  for (var audit in storage.audit){
    createAuditDiv(storage.audit[audit]);
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

/*Tab script*/
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
