const myClarifaiApiKey = 'd4671ee01e9e4d0a8a4df3442175c087';

const app = new Clarifai.App({apiKey: myClarifaiApiKey});



const predict_button = (value, source) => {

  let file = document.querySelector("input[type=file]").files[0];
  let prediction = document.getElementById('predictButtons');
  if (file) {
    prediction.disabled = false;
    prediction.style.backgroundColor = "green";
    prediction.style.cursor = "pointer";
  }

}
const predict_click = (value, source) => {
  let file    = document.querySelector("input[type=file]").files[0];
  let preview = $(".food-photo");
  let loader  = "https://s3.amazonaws.com/static.mlh.io/icons/loading.svg";
  let reader  = new FileReader();

  reader.addEventListener("load", function () {
    preview.attr('style', 'background-image: url("' + reader.result + '");');
    doPredict({ base64: reader.result.split("base64,")[1] });
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    $('#concepts').html('<img src="' + loader + '" class="loading" />');
  
  }
}


const doPredict = (value) => {
  app.models.predict(Clarifai.FOOD_MODEL, value).then(async function(response) {
    if(response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
      let tag = response.rawData.outputs[0].data.concepts;
      let tag_ = response.rawData.outputs[0].data.concepts[0].name;
      let chaine ="";
      let i = 0 
       for(let abc in tag){
         if (i < 2) {
         chaine += tag[abc].name + ' / ';
         i++;
        }
       }

        let res = await fetch("./data.json");
        let data = await res.json();
        let name_p = data[0][tag_];

        if(!name_p){
          let c = `Sorry the nutritional values of ${tag_} dosen't exist`;
          $('#concepts').html('<h2>'+ chaine + '</h2>' + "<p>"+c+"</p>");
          $('.titres').css('display', 'none'); 

        }else {

        let ab = data[0][tag_].values;
        let abRest = data[0][tag_].rest;
      
        // for (let i = 0 ; i<abRest.length; i++) {
        //   restChaine = Array.from(abRest).split(/[:]+/g);
        //  console.log(restChaine);
        // }
        let arr = Array.from(ab);
        let arrR = Array.from(abRest);
        
        let cal_equation = [];
        let cal = [];
        let lip = [];
        let sod = [];
        let chol = [];
        let awel = arr.shift();
        
        
        cal_equation =  parseFloat(arr[0].match(/[\d.\d]+/g).map(Number));
        await $('#calories_activity').html(cal_equation);
         let btn_v = document.getElementById('voire');
        btn_v.onclick =  () => {
       let poid = document.getElementById('poids').value;


        let equation_walk = cal_equation * 200 /( 3.5 *3.5 * parseFloat(poid)); 
        if(equation_walk > 60) {
          let h = Math.floor(equation_walk/60);
          let m = Math.round(equation_walk % 60) ;
          let h_m = `${h} Heure(s) et ${m} minutes`
          $('#time_walking').html( h_m);
          $('#walking_').css('display', 'none');
          
        }else {

          $('#time_walking').html(Math.round(equation_walk));
        }
        let equation_running = cal_equation * 200 /( 7 *3.5 * parseFloat(poid)); 
        if(equation_running > 60) {
          let h = Math.floor(equation_running/60);
          let m = Math.round(equation_running % 60) ;
          let h_m = `${h} Heure(s) et ${m} minutes`
          $('#time_running').html( h_m);
          $('#running_').css('display', 'none');
          
        }else {

          $('#time_running').html(Math.round(equation_running));
        }
        let equation_watching = cal_equation * 200 /( 1 *3.5 * parseFloat(poid)); 
        if(equation_watching > 60) {
          let h = Math.floor(equation_watching/60);
          let m = Math.round(equation_watching % 60) ;
          let h_m = `${h} Heure(s) et ${m} minutes`
          $('#time_watching').html( h_m);
          $('#watching_').css('display', 'none');
          
        }else {

          $('#time_watching').html( Math.round(equation_watching));
        }
        $('.all_activity').css('display', 'block');

      }
        cal = arr[0];
        lip = arr[1];
        sod = arrR[1];
        chol = arrR[0];
    
        let x = arr.toString(ab).replace(/[,]+/g,'<br class="br_"><hr>');
        let y = arrR.toString(abRest).split(/[:,]+/g);
        let restChaine = "";
        let restChaineNumber = "";
        for(let i = 0; i < y.length; i++ ){
          if(i%2 === 0){
            restChaine += `<p >${y[i]}</p>` ;
            $('#name_nut').html(restChaine);
          }else if(i%2 !== 0){
            restChaineNumber += `<p class="ligne_">${y[i]}</p>`;
            $('#num_nut').html(restChaineNumber );
        
            
          }

        }
 
         
         let calString = cal.toString(ab);
         let lipString = lip.toString(ab);
         let sodString = sod.toString(abRest);
         let cholString = chol.toString(abRest);
         
         let numCal = calString.match(/[\d.\d]+/g).map(Number);
         let numLip = lipString.match(/[\d.\d]+/g).map(Number);
         let numSod = sodString.match(/[\d.\d]+/g).map(Number);
         let numChol = cholString.match(/[\d.\d]+/g).map(Number);

         let restCalories = 2000 - parseFloat(numCal);
         let restLipides = 67 - parseFloat(numLip);
         let restSoduim = 2300 - parseFloat(numSod);
         let restCholesterol = 300 - parseFloat(numChol);
         
         let percentage_cal = (parseFloat(numCal) / 2000) *100;
         let percentage_lip = (parseFloat(numLip) / 67) *100;
         let percentage_sod = (parseFloat(numSod) / 2300) *100;
         let percentage_chol = (parseFloat(numChol) / 300) *100;
         
         $('#concepts').html('<h2>'+ chaine + '</h2>' + "<p class='awel-phrase'>"+ awel + "</p><p class='rest_phrase'>"+x+"</p>");
           $('#cal_rest').html(restCalories);
           $('#cal_total').html(numCal);
           $('#bar_calorie').css('width',`${percentage_cal}%`);
           $('#lip_rest').html(restLipides);
           $('#lip_total').html(numLip);
           $('#bar_Lipides').css('width',`${percentage_lip}%`);
           $('#sod_rest').html(restSoduim);
           $('#sod_total').html(numSod);
           $('#bar_sodium').css('width',`${percentage_sod}%`);
           $('#chol_rest').html(restCholesterol);
           $('#chol_total').html(numChol);
           $('#bar_cholesterol').css('width',`${percentage_chol}%`);
          

          //  $('#nutritional_name').html(numChol);

            $('.titres').css('display', 'block'); 

        }
        
      

      
      }
    }
  );
}