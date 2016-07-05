

var datasdsd = [];

var filesjson = ["1.json", "2.json", "3.json", "4.json", "5.json"];



function start(){
    /*for (var i = 0; i < filesjson.length; i++) {
        d3.json(filesjson[i],imprimir);
  
    };*/
    ja();
    
}

function ja(){
    

    for (var i = 0; i <= filesjson.length; i++) {
        $.ajax({
            dataType : "json",
            url : filesjson[0],
            async: false,
            success : function(data){datasdsd.push(data);}
        })
    };

    console.log("ya no se : " , datasdsd);
}


