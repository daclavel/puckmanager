

function createPuck(puck){

  var puckDiv=document.createElement('div');
  puckDiv.id=puck.puckNumber.value;
  puckDiv.classList.add('puck');
  puckDiv.setAttribute("draggable","true");
  puckDiv.setAttribute("ondragstart","drag(event)");
  
  var puckManagerDiv=document.createElement('div');
  puckManagerDiv.classList.add('puckElement');
  var puckManagerText=document.createTextNode(puck.manager.value);
  puckManagerDiv.appendChild(puckManagerText)
  puckDiv.appendChild(puckManagerDiv);

  var puckNumberDiv=document.createElement('div');
  puckNumberDiv.classList.add('puckElement');
  puckDiv.appendChild(puckNumberDiv);
  var puckNumberText=document.createTextNode(puck.puckNumber.value);
  puckNumberDiv.appendChild(puckNumberText)
  puckDiv.appendChild(puckNumberDiv);

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

function localStorageBackup() {
  var backup = {};
  for (i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    backup[key] = escape(encodeURIComponent(value));
  }
  var json = JSON.stringify(backup);
  var base = btoa(json);
  var href = 'data:text/javascript;charset=utf-8;base64,' + base;
  var link = document.createElement('a');
    link.setAttribute('download', 'backup.json');
  link.setAttribute('href', href);
  document.querySelector('body').appendChild(link);
  link.click();
  link.remove();
};

function localStorageRestore() {
  var t = document.createElement('div');
  var a = document.createElement('a');
  a.appendChild(document.createTextNode('X'));
  a.setAttribute('href', '#');

  a.style.position = 'absolute';
  a.style.top = '10px';
  a.style.right = '10px';
  a.style['text-decoration'] = 'none';
  a.style.color = '#fff';
  t.appendChild(a);
  a.onclick = function() {
      t.remove();
  };
  t.style.width = '50%';
  t.style.position = 'absolute';
  t.style.top = '25%';
  t.style.left = '25%';
  t.style['background-color'] = 'gray';
  t.style['text-align'] = 'center';
  t.style.padding = '50px';
  t.style.color = '#fff';
  t.style['z-index'] = 10000;

  var l = document.createElement('input');
  l.setAttribute('type', 'file');
  l.setAttribute('id', 'fileinput');
  l.onchange = function(e) {
      t.remove();
      var f = e.target.files[0];
      if (f) {
          var reader = new FileReader();
          reader.onload = function(e) {
              var text = e.target.result;
              var backup = JSON.parse(text);
              for (var key in backup){
                 var value = decodeURIComponent(unescape(backup[key]));
                 window.localStorage.setItem(key, value);
               }
              alert('Imported ' + Object.keys(backup).length + ' items from backup.')
          };
          reader.readAsText(f);
      } else {
        alert('Failed to load file');
      }
  };
  var a = document.createElement('h3');
  a.appendChild(document.createTextNode('Select file with backup'));
  t.appendChild(a);
  t.appendChild(l);
  document.querySelector('body').appendChild(t);
};

function localStorageClear() {
  if(window.confirm('Do you really want to delete all ' + localStorage.length + ' localStorage items of this website?')) {
    localStorage.clear();
  }
}
