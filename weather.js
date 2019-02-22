"use strict";
/* global $, Headers, */

//http://www.city-data.com/
//http://www.governing.com/gov-data/census/median-age-county-population-map.html

const api = (function() {
  function apiFetch(...args) {
    let error = false;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          error = true;
        }
        return res.json();
      })
      .then(data => {
        if (error) {
          throw new Error(data.message);
        }
        return data;
      })
      .catch(err => console.log(err.message));
  }

  const baseURL = `https://api.weatherbit.io/v2.0/current?key=f855b8978668496cb1bda0cbe469d66e&city=`;

  //const APIKEY = "f855b8978668496cb1bda0cbe469d66e";

  function getCities(city) {
    console.log("getCities is being called.");
    return apiFetch(`${baseURL}${city}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.data[0])
      .catch(err => alert(err));
  }

  return {
    getCities
  };
})();
console.log(api);

function matchCities(city) {
  if (store.cities.age === age) {
    return store.cities.name;
  }
}

function captureChoices() {
  $(".submit-choices").on("click", function(event) {
    event.preventDefault();
    console.log(event.currentTarget);
    console.log(`submit pressed.`);
    console.log(store.displayResult);
    let age = $(".age-options").val();
    let weather = $(".weather:checked").val();
    let city = $(".city-choice").val();
    if (age == "") {
      alert("please select an age");
    } else if (city == "") {
      alert("please select a city");
    } else if (weather == undefined) {
      alert("please select a weather");
    } else {
      store.displayResult = true;
      const data = api.getCities(city);

      let medianAge = 0;
      for (let i = 0; i < store.cities.length; i++) {
        if (store.cities[i].name === city) {
          console.log("city found");
          let ageRange = store.cities[i].age.split("-");
          if (ageRange[0] == "Under 18") {
            medianAge = 18;
          } else if (ageRange[0] == "65+") {
            medianAge = 65;
          } else {
            medianAge = Math.floor(
              (parseInt(ageRange[0]) + parseInt(ageRange[1])) / 2
            );
          }
          console.log(medianAge);
        }
      }
      console.log(
        `age: ${age}, weather: ${weather} city: ${city} medianAge: ${medianAge}`
      );

      data.then(response =>
        renderResults(age, weather, city, medianAge, response)
      );
    }
  });
}

function renderResults(age, weather, city, medianAge, data) {
  console.log(data.temp, medianAge);
  const fahrenheit = Math.floor(data.temp * 1.8 + 32);

  let flightCity = city.split(",");
  let flightLink = flightCity[0];

  console.log(fahrenheit);
  let resultString = "";
  if (fahrenheit >= 55 && weather === "warm") {
    resultString = `
      <p>Are people your age enjoying ${weather} weather right now in ${city}?</p>
      <p>${city} has a median age of ${medianAge} and the current temp is ${fahrenheit}. Looks like a good match!</p>
  
      <p><a href="https://www.google.com/search?ei=CyRwXIr2KdDesAXSyI-oBw&q=one+way+ticket+to+${city}&oq=one+way+ticket+to+${city}&gs_l=psy-ab.3..0j0i22i30l9.27497.30703..30816...0.0..0.107.2195.19j5......0....1..gws-wiz.......0i71j35i39j0i67j0i131j0i20i263.1vl3q8ti4As"> Ok, I'll pack my bags</a>
      <button type="button" class="try-again">Try again.</button></p>`;
  } else if (fahrenheit >= 55 && weather === "chilly") {
    resultString = `
      <p>Are people your age enjoying ${weather} weather right now in ${city}?</p>
     <p> ${city} has a median age of ${medianAge} and the current temp is ${fahrenheit}.</p>
      <p><button type="button" class="try-again">That is warmer than I like. Try again!</button></p>`;
  } else if (fahrenheit <= 55 && weather === "chilly") {
    resultString = `
      <p>Are people your age enjoying ${weather} weather right now in ${city}?</p>
     <p> ${city} has a median age of ${medianAge} and the current temp is ${fahrenheit}. Looks like a good match!</p>
  
      <p><a href="https://www.google.com/search?ei=CyRwXIr2KdDesAXSyI-oBw&q=one+way+ticket+to+${city}&oq=one+way+ticket+to+${city}&gs_l=psy-ab.3..0j0i22i30l9.27497.30703..30816...0.0..0.107.2195.19j5......0....1..gws-wiz.......0i71j35i39j0i67j0i131j0i20i263.1vl3q8ti4As"> Ok, I'll pack my bags</a>
      
      <button type="button" class="try-again">Try again.</button></p>
    `;
  } else if (fahrenheit <= 55 && weather === "warm") {
    resultString = `
      <p>Are people your age enjoying ${weather} weather right now in ${city}?</p>
     <p> ${city} has a median age of ${medianAge} and the current temp is ${fahrenheit}.</p>
      <p><button type="button" class="try-again">That is colder than I like. Try again!</button></p>`;
  }
  if (store.displayResult == true) {
    $(".results").html(resultString);
  } else {
    /*$(".results").html(
      `<img src="https://img.icons8.com/metro/26/000000/airplane-mode-on.png"> <img src="https://img.icons8.com/metro/26/000000/airplane-mode-on.png"><img src="https://img.icons8.com/metro/26/000000/airplane-mode-on.png">`
    );*/
    $(".results").hide();
  }
  $(".results").show();
  //directToFlights();
  console.log(store.displayResult);
}

function resetForm() {
  $("body").on("click", ".try-again", function(event) {
    event.preventDefault();
    console.log(`reset button hit.`);
    store.displayResult == false;
    $("form")[0].reset();
    $(".results").html(
      `<img src="https://img.icons8.com/metro/26/000000/airplane-mode-on.png"> <img src="https://img.icons8.com/metro/26/000000/airplane-mode-on.png"><img src="https://img.icons8.com/metro/26/000000/airplane-mode-on.png">`
    );
  });
}

function main() {
  captureChoices();
  resetForm();
}

$(main);
