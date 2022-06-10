const BASE_URL = "http://localhost:8000/api/v1/titles/";
const BEST_URL = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score'
const ACTION_URL = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=action";
const FANTASY_URL = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=fantasy";
const WAR_URL ="http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=war";

let moviesdata = {};
let bestcount = 0;
let page_best = 0;
let page_action = 0;
let page_fantasy = 0;
let page_war = 0;

async function getMovies(path, page) {// Load 2 pages of a category from API and save the movies contained.
    var movies_list = [];
    var results = "";
    var startpage = page;
    for (var i = 0; i < 14; i++) {
        startpage++;
        var currentpath = `${path}&page=${startpage}`;
        var response = await fetch(currentpath);
        var data = await response.json();
        results = data["results"];
        for (var j = 0; j < 5; j++){//Loads all the movies inside a page
            movies_list.push({'title': results[j]["title"],
                              'image_url': results[j]["image_url"],
                              'id': results[j]["id"]}
                            );
        }
    }
    return movies_list;
}

async function getTopMovie() {//Gets the best movie id
    var movie_id = ""
    var response = await fetch(BEST_URL);
    var data = await response.json();
    movie_id = data["results"][0]["id"];
    return movie_id;
}

function displayMovies(list, element){
    var inner = "";
    var target = document.getElementById(element);
    for(var i = 0; i < 7; i++){
        var movie = list[i];
        var title = list[i]["title"];
        var picture = list[i]["image_url"];
        var id = list[i]["id"];
        movie = `<p><input type="image" src="${picture}" alt="${title}" id="${id}" onclick="openModal(BASE_URL, id)"/></p>`;
        inner = inner.concat(" ", movie)
    }
    target.innerHTML = inner;
}

async function displayBest(movieId) {//Show the best movie
    var target_title = document.getElementById("best_movie_title");
    var target_div = document.getElementById("best_movie_div");
    var response = await fetch(`${BASE_URL}${movieId}`);
    var data = await response.json();
    var title = data["title"];
    var picture = data["image_url"];
    var image = `<p><input type="image" src="${picture}" alt="${title} -cliquez pour plus d'information" id="${movieId}" onclick="openModal(BASE_URL, id)"/></p>`;
    target_title.innerHTML = title;
    target_div.innerHTML = image;
}

async function nextPage(element, url){
    if(element=="best_films"){
        page_best++;
        var page = page_best;
    }else if(element=="action"){
        page_action++;
        var page = page_action;
    }else if(element=="fantasy"){
        page_fantasy++;
        var page = page_fantasy;
    }else if(element=="war"){
        page_war++;
        var page = page_war;
    }
    if(page>10){
        alert("Vous avez atteint la fin de la liste");
    }else{
    Promise.all([getMovies(url, page)])
    .then(([result]) => {
        displayMovies(result, element);
    });
}
}

async function previousPage(element, url){
    if(element=="best_films"){
        page_best--;
        var page = page_best;
    }else if(element=="action"){
        page_action--;
        var page = page_action;
    }else if(element=="fantasy"){
        page_fantasy--;
        var page = page_fantasy;
    }else if(element=="war"){
        page_war--;
        var page = page_war;
    }
    if(page<0){
        alert("Vous êtes au début de la liste");
    }else{
    Promise.all([getMovies(url, page)])
    .then(([result]) => {
        displayMovies(result, element);
    });
}
}

async function load() {
    Promise.all([getTopMovie(), getMovies(BEST_URL, 0), getMovies(ACTION_URL, 0),
                getMovies(FANTASY_URL, 0), getMovies(WAR_URL, 0)])
    .then(([result1, result2, result3, result4, result5]) => {
    displayBest(result1);
    displayMovies(result2, "best_films");
    displayMovies(result3, "action");
    displayMovies(result4, "fantasy");
    displayMovies(result5, "war");
    var data = {"best_films": result2,
                 "action": result3,
                 "fantasy": result4,
                 "war": result5};
    return data;
}
);
}

async function openModal(url, id){
    var response = await fetch(`${url}${id}`);
    var result = await response.json();
    var cover = result["image_url"];
    var title = result["title"];
    var genres = result["genres"];
    var launch_date = result["date_published"];
    var score = result["imdb_score"];
    var directors = result["directors"];
    var actors = result["actors"];
    var duration = `${result["duration"]} minutes`;
    var country = result["countries"];
    var description = result["description"];
    var box_office = result["worldwide_gross_income"];
    if (box_office == null) {
        worldwide = "Information non disponible.";
    }
    if (description == "Add a Plot »") {
        description = "Pas de résumé disponible.";
    }
    if (typeof cover != "string") {
        cover = "img/unavailable.jpg";
    }
    var movie_infos = [genres, launch_date, score,
                       directors, actors, duration, country, description,
                       box_office];
    var modal = document.getElementById("myModal");
    var modal_content = document.getElementById("modal-content");
    var modal_title = document.getElementById("modal-title");
    var modal_image = document.getElementById("modal-image");
    modal_image.src = cover;
    modal_title.innerHTML = title;
    modal_content.innerHTML = movie_infos;
    modal.style.display="flex";
}

function closeModal(){
    var closeButton = document.getElementsByClassName("modal-close")[0];
    var modal = document.getElementById("myModal");
    console.log(closeButton);
    closeButton.onclick = function() {
        modal.style.display = "none";
      };
}




load(); 
