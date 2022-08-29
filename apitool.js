/*
We would want the client to be able to input the device serial and update Device name or Device VIN.
*/


//function that pulls all the information once "submit" button is clicked.
const run = () =>{
  
var disp = false; 

//authenticate user credentials
const authentication = {
credentials:{
  database: document.getElementById("database").value,
  userName: document.getElementById("email").value, 
  password: document.getElementById("password").value  
},
path: document.getElementById("server").value
};

const api= new GeotabApi(authentication);

// if authentication is successful, try loading the data
api.authenticate( success => {
  
  //if the login was success, change the display on screen to the update form
    var x = document.getElementById("login");
    var y = document.getElementById("userinp");
  if (x.style.display === "none" && disp!=false) {
      x.style.display = "block";
    } else {
      x.style.display = "none";
      y.style.display = "block";

      const submit = document.getElementById('btn1');

      submit.addEventListener("click",() => {
        //read the input given in the box and append it on a list
        let sn_inp=document.getElementById("serial").value;
        let Serial_Number=[];


        let name_inp=document.getElementById("devicename").value;
        let name=[];

        let vin_inp=document.getElementById("vin_num").value;
        let VIN=[];


        Serial_Number.push(sn_inp);
        name.push(name_inp);
        VIN.push(vin_inp);

      //pull the device that nedds VIN/Name updated using the serial number given by the user.
        for (let j=0;j<Serial_Number.length;j++){
          api.call("Get", {
                  "typeName": "Device",
                  "search": {
                serialNumber: Serial_Number[j]
            }
          }, 

        function(result) {
    
    
        for (let i=0; i<result.length; i++){
            var res=result[i];
    
            if (res){
        
                const submit = document.getElementById('btn1');
      
                //if the user only wants to update only VIN
                if (name_inp==="" && vin_inp!==""){
            
                //if a vin does not exists then let the user change it
                if (res.vehicleIdentificationNumber===""){
                  res.vehicleIdentificationNumber=VIN[j]; 
                }

                //else, make sure that they want to update a VIN that already exists.
                else{
                  let confirmAction = confirm("A VIN for this Device already exists, are you sure you want to update the VIN?");
              
                  // if the user clicks "Okay"
                  if (confirmAction==true){
                    res.vehicleIdentificationNumber=VIN[j];
                  }
                  // alert cancel message if the user clicks "cancel"
                  else{
                    alert("VIN update canceled");
                  }
                }
            
              }
        
          //if the user wants to update the name only
            else if (vin_inp==="" && name_inp!==""){
                res.name=name[j];
            }
        
          // if the user wants to update both Device Name and VIN
            else if (vin_inp!=="" && name_inp!==""){
                //update the name but check if a VIN exists before updating the VIN
                res.name=name[j];
             
                //if a vin does not exists then let the user change it
                if (res.vehicleIdentificationNumber==""){
                  res.vehicleIdentificationNumber=VIN[j]; 
                }

                //else, make sure that they want to update a VIN that already exists.
                else{
                  let confirmAction = confirm("A VIN for this Device already exists, are you sure you want to update the VIN?");

                // if the user clicks "Okay"
                if (confirmAction==true){
                  res.vehicleIdentificationNumber=VIN[j];
                }
              // alert cancel message if the user clicks "cancel"
                else{
                  alert("VIN update canceled");
                }
              }
          }
        
          // if there's no input, let the user know that they must update either VIN or Device Name
            else{
              alert("You must input VIN or Device Name");
        }
        
        // call the api to set the new data after the input conditions are checked
        api.call("Set", {
                        "typeName": "Device",
                        "entity": res
                },
        // give message if the update happens without any error
                function(result){
                  alert("successfully updated the information");
                }
                );
    }
        
}
    // error message if there's an error 
    }, 
    function(e) {
      console.error("error in updating:", e);
    });
}
      })

    }
    
  }, (error) => {
  alert('Login Failed: Incorrect Credentials'); //show error if the credentials are wrong 
});

}










