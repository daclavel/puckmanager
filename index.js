function createPuck(puck){

  var puckDiv=document.createElement('div');
  puckDiv.id=puck.puckNumber.value;
  puckDiv.classList.add('puck');
  puckDiv.setAttribute("draggable","true");
  puckDiv.setAttribute("ondragstart","drag(event)");
  
  var puckNumberDiv=document.createElement('div');
  puckNumberDiv.classList.add('puckElement');
  puckDiv.appendChild(puckNumberDiv);
  var puckNumberText=document.createTextNode(puck.puckNumber.value);
  puckNumberDiv.appendChild(puckNumberText)
  puckDiv.appendChild(puckNumberDiv);

  var projectNameDiv=document.createElement('div');
  projectNameDiv.classList.add('puckElement');
  var projectNameText=document.createTextNode(puck.projectName.value);
  projectNameDiv.appendChild(projectNameText)
  puckDiv.appendChild(projectNameDiv);

  var puckManagerDiv=document.createElement('div');
  puckManagerDiv.classList.add('puckElement');
  var puckManagerText=document.createTextNode(puck.manager.value);
  puckManagerDiv.appendChild(puckManagerText)
  puckDiv.appendChild(puckManagerDiv);

  var puckCreationDateDiv=document.createElement('div');
  puckCreationDateDiv.classList.add('puckElement');
  puckDiv.appendChild(puckCreationDateDiv);
  var puckCreationDateText=document.createTextNode(new Date().toISOString().slice(0, 10));
  puckCreationDateDiv.appendChild(puckCreationDateText)
  puckDiv.appendChild(puckCreationDateDiv);

  document.getElementById("robot").appendChild(puckDiv);
}



function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.effectAllowed='move';
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}



