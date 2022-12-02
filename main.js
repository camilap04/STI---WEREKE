var dataBaseProducts;
var dataBasePeople;

//Cargar bases de datos previamente
Papa.parse("datos_productos.csv", {
  download: true,
  complete: function (results) {
    dataBaseProducts = results.data;
  },

});
Papa.parse("datos_personas.csv", {
  download: true,
  complete: function (results) {
    dataBasePeople = results.data;
  },
});

var btn1821 = document.querySelector(".btn-18-21");
var btn2240 = document.querySelector(".btn-22-40");
var btn4159 = document.querySelector(".btn-41-59");
var btn60 = document.querySelector(".btn-60");


var aggregation = document.querySelector(".aggregation");
var protoTitle = document.querySelector(".proto-title");

var mainDataBase;
var otherDataBase;

function show1821() {
  resetMainDb(dataBasePeople);
  getKVal(dataBasePeople, 'de 18 a 21 años')
}

function show2240() {
  resetMainDb(dataBasePeople);
  getKVal(dataBasePeople, 'de 22 a 40 años')
}
function show4159() {
  resetMainDb(dataBasePeople);
  getKVal(dataBasePeople, 'de 41 a 59 años')
}
function show60() {
  resetMainDb(dataBasePeople);
  getKVal(dataBasePeople, '60 años o más')
}

function resetMainDb(db) {
  mainDataBase = db;
  if (mainDataBase == dataBasePeople) {
    otherDataBase = dataBaseProducts;
  } else {
    otherDataBase = dataBasePeople;
  }
}

function getKVal(results, group) {
  var arrayUsers = [];
  for (i = 1; i < results.length; i++) {
    if (results[i][0] === group) arrayUsers.push(results[i]);
  }
  createTableGroup(arrayUsers);
  doAggregation(arrayUsers, group);
}

btn1821.addEventListener('click', show1821);
btn2240.addEventListener('click', show2240);
btn4159.addEventListener('click', show4159);
btn60.addEventListener('click', show60);


function createTable(results) {
  table = "<table class='table'>";
  for (i = 0; i < results.length; i++) {
    table += "<tr>";
    var row = results[i];

    cells = row.join(",").split(",");
    if (i == 0) {
      var etiq = "th"

    } else {
      var etiq = "td"
    }
    table += "<" + etiq + ">";
    table += cells[0];

    if (i >= 1) {
      table += "<input type='checkbox' id='cbox" + i + "' value=" + i + ">"
    }
    table += "</" + etiq + ">";
    table += "</tr>";
  }
  table += "</table>";
  $("#parsed-list").html(table);
  createKValues(results);
}

function clearTable() {
  document.querySelectorAll("table").forEach((n) => n.remove());
}
function createKValues(db) {
  for (let i = 1; i < db.length; i++) {
    var val = document.createElement("option");
    val.innerHTML = i;
    val.value = Object.values(i);
    kValue.appendChild(val);
  }
}
//Calculo similitud coseno de todos los valores
function similCosAll(protoUser) {
  var user1 = protoUser;
  var user2 = [];
  var contador = 1;
  var similCos = [];
  for (let fil = 1; fil < otherDataBase.length; fil++) {
    for (let i = 0; i < otherDataBase[contador].length - 1; i++) {
      user2[i] = otherDataBase[contador][i + 1];
    }
    //Producto punto
    var valA = 0;
    var valB = 0;

    //Magnitud
    let magA = 0;
    let magB = 0;

    var prodPunt = 0;
    for (let i = 0; i < user1.length; i++) {
      valA = parseFloat(user1[i]);
      valB = parseFloat(user2[i]);

      prodPunt += (valA * valB);
      magA += Math.pow(valA, 2);
      magB += Math.pow(valB, 2);
    }
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);

    similCos.push([otherDataBase[contador][0], (prodPunt / (magA * magB)).toFixed(4), otherDataBase[contador][25]]);
    user2 = [];
    contador += 1;
  }
  createTableSimil(similCos);
}
function createTableSimil(array) {
  array.sort(function (a, b) {
    return b[1] - a[1];
  });
  var kval = 5;
  table = "<table class='table'>";
  table += "<tr>";
  table += "<th>";
  table += otherDataBase[0][0];
  table += "</th>";
  table += "<th>" + "AFINIDAD" + "</th>";
  table += "<th>";
  table += otherDataBase[0][25];
  table += "</th>";
  table += "</tr>";
  for (i = 0; i < kval; i++) {
    table += "<tr>";
    table += "<th>";
    table += array[i][0];
    table += "</th>";
    //Similitud coseno
    table += "<td>";
    table += array[i][1];
    table += "</td>";

    //Enlaces
    if (array[i][2] != undefined) {
      table += "<td>";
      table += "<a href=" + array[i][2] + ">" + array[i][2] + "</a>";
    } else {
      table += "<td>";
      table += array[i][2];
    }
    table += "</tr>";
  }
  table += "</table>";
  $("#simil-list").html(table);

}

var divProto = document.getElementById("protoPerson");

function createTableGroup(array) {
  table = "<table class='table'>";
  table += "<tr>";
  for (let k = 0; k < array[0].length - 1; k++) {
    table += "<th>";
    table += mainDataBase[0][k];
    table += "</th>";

  }
  for (i = 0; i < array.length; i++) {

    table += "<tr>";
    table += "<th>";
    table += array[i][0];
    table += "</th>";

    for (let j = 1; j < array[0].length - 1; j++) {

      table += "<td>";
      table += array[i][j];

      table += "</td>";
    }
    table += "</tr>";

  }
  table += "</table>";
  $("#groupP").html(table);
}

function doAggregation(group, category) {
  var protoUser = [];
  let valA = 0;
  let prom = 0;

  for (let col = 1; col < group[0].length - 1; col++) {
    for (let fil = 0; fil < group.length; fil++) {
      var data = parseFloat(group[fil][col]);
      switch (aggregation.options.selectedIndex + 1) {
        //Caso naiveAverage
        case 1:
          valA += data;
          break;
        //Caso LeastMisery
        case 2:
          if (data <= 1) {
            data = "null";
          }
          valA += data;
          break;
        //Caso MaximunPleasure
        case 3:
          if (data <= 3) {
            data = 1;
          }
          valA += data;
          break;
      }

    }
    prom = (valA / (group.length));
    protoUser[col - 1] = prom.toFixed(0);
    valA = 0;
  }
  for (let j = 0; j < protoUser.length; j++) {
    if (protoUser[j] == "NaN") {
      protoUser[j] = "0";
    }
  }

  if (aggregation.options.selectedIndex + 1 == 3) {
    for (let j = 0; j < protoUser.length; j++) {
      d = parseFloat(protoUser[j]);
      if (d >= 4) {
        protoUser[j] = "5";
      }
    }
  }
  createProtoPerson(protoUser, category);
  similCosAll(protoUser);
}

function createProtoPerson(array, category) {
  table = "<table class='table'>";
  table += "<tr>";

  for (i = 0; i < array.length + 1; i++) {
    table += "<th>";
    table += mainDataBase[0][i];
    table += "</th>";
  }

  table += "</tr>";
  table += "<th>";
  table += category;
  table += "</th>";

  for (i = 0; i < array.length; i++) {
    table += "<td>";
    table += array[i];
    table += "</td>";
  }

  table += "</table>";
  $(divProto).html(table);
  protoTitle.style.display = 'block';
}


