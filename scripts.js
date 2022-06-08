const BASE_URL = "http://localhost:8000/api/v1/titles/";
const BEST_URL = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score'
const ACTION_URL = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=action";
const FANTASY_URL = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=fantasy";
const WAR_URL ="http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=war"

let movielist = {};

async function getMovies(path) {// Load 2 pages of a category from API and save the movies contained.
    var movies_list = [];
    var results = "";
    for (var i = 0; i < 2; i++) {
        var currentpath = `${path}&page=${i+1}`;
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

async function getCover(movie) {// Get covers for display
    console.log(movie);
    var title = movie["title"];
    var picture = movie["image_url"];
    var id = movie["id"];
    var result = `<p><input type="image" src="${picture}" alt="${title}" id="${id}"/></p>`;
    return result;
}

function displayMovies(list, element){
    var inner = "";
    var target = document.getElementById(element);
            console.log(list[1]);
    for(var i = 0; i < 7; i++){
        var movie = list[i];
        var title = list[i]["title"];
        var picture = list[i]["image_url"];
        var id = list[i]["id"];
        movie = `<p><input type="image" src="${picture}" alt="${title}" id="${id}"/></p>`;
        console.log(movie);
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
    var image = `<p><input type="image" src="${picture}" alt="${title}" id="${movieId}"/></p>`;
    target_title.innerHTML = title;
    target_div.innerHTML = image;
}


async function onLoading() {//Load all the datas required for page display.
    Promise.all([getTopMovie(), getMovies(BEST_URL), getMovies(ACTION_URL),
                getMovies(FANTASY_URL), getMovies(WAR_URL)])
    .then(([result1, result2, result3, result4, result5]) => {
    displayBest(result1);
    displayMovies(result2, "best_films");
    displayMovies(result3, "action");
    displayMovies(result4, "fantasy");
    displayMovies(result5, "war");
    movielist = {"best_films": result2,
                 "action": result3,
                 "fantasy": result4,
                 "war": result5};
});
    }


onLoading();