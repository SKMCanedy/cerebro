'use strict';
// --- Global Variables ---
// stores the data the cust inputted in the search field
let userSearchData='';

// stores the comic vine character details so multiple calls will not need to be made
let capiCharDetails={};

// stores the giantbomb character details so multiple calls will not need to be made
let gapiCharDetails={};


// --- API Pull functions---

// Summary: Character ID Pull - Comic Vine API (capi)
// Details: This accesses the Comic Vine Characters API with the main goal to pull the api_detail_url so that specific character details can be pulled by getCapiCharDetails
function getCapiCharId (callback){
	console.log (`getCapiCharId function accessed`);
	const capiCharSearchUrl = "https://cors-anywhere.herokuapp.com/https://www.comicvine.com/api/characters/";
	const query = {
		api_key: "77e74b104e90bbe37c3f4576a41e5c7a37c87520",
		format: "json",
		filter: `name:${userSearchData}`,
		field_list: "id,name,api_detail_url",
	};
	$.getJSON(capiCharSearchUrl, query, callback);
};

// Summary: Specific character data pull - capi
// Details: This accesses the api character detail url received from getCapiCharID This provides more detail about a character that other functions will rely on. Callback: reviewCapiChar

function getCapiCharDetails (charURL, callback){
	console.log (`getCapiCharDetails function accessed`);
	const capiCharDetailsUrl = "https://cors-anywhere.herokuapp.com/"+charURL;
	const query = {
		api_key: "77e74b104e90bbe37c3f4576a41e5c7a37c87520",
		format: "json",
		field_list: "id,name,deck,first_appeared_in_issue,image,issue_credits,movies,api_detail_url,site_detail_url",
	};
	$.getJSON(capiCharDetailsUrl,query,callback);
};

// Summary: Comic book info data pull - capi
// Details: This pulls specific comic book data from Comic Vine Issues API


function getCapiComicDetails (comicId, callback){
	console.log (`getCapiComicDetails function accessed`);
	const capiComicDetailsUrl = `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/issues/`;
	const query = {
		api_key: "77e74b104e90bbe37c3f4576a41e5c7a37c87520",
		format: "json",
		filter: `id:${comicId}`,
		field_list: "id,name,image,description,site_detail_url",
	};
	$.getJSON(capiComicDetailsUrl,query,callback);
};

// Summary: Movie info data pull - capi
// Details: This pulls specific movie data from Comic Vine Movie API

function getCapiMovieDetails (movieId, callback){
	console.log (`getCapiMovieDetails function accessed`);
	const capiMovieDetailsUrl = `https://cors-anywhere.herokuapp.com/https://comicvine.gamespot.com/api/movies/`;
	const query = {
		api_key: "77e74b104e90bbe37c3f4576a41e5c7a37c87520",
		format: "json",
		filter: `id:${movieId}`,
		field_list: "id,name,image,description,site_detail_url",
	};
	$.getJSON(capiMovieDetailsUrl,query,callback);
};


// Character ID - Giantbomb API (gapi)
function getGapiCharId (callback){
	console.log (`getGapiCharId function accessed`);
	const gapiCharSearchUrl = `https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/characters/`;
	const query = {
		api_key: "2a8e5dcbcc310e7cf6713106844a65288cd678d4",
		format: "json",
		filter: `name:${userSearchData}`,
		field_list: "name,guid,api_detail_url",
	};
	$.getJSON(gapiCharSearchUrl,query,getGapiCharDetails);
};

// Specific character data - gapi
function getGapiCharDetails (apiData){
	console.log (`getGapiCharDetails function accessed`);
	console.log (apiData);
	if (apiData.number_of_total_results == 0){
		insertNoInfoFound('.gameInfo');
	}
	else {
		let charURL = apiData.results[0].api_detail_url;
		const gapiCharDetailsUrl = "https://cors-anywhere.herokuapp.com/"+charURL;
		const query = {
			api_key: "2a8e5dcbcc310e7cf6713106844a65288cd678d4",
			format: "json",
			field_list:"name,first_appeared_in_game,games",
		};
		$.getJSON(gapiCharDetailsUrl,query,updateGapiCharDetails);
	}
};


// Game info - gapi
function getGapiGameDetails (gameId, callback){
	console.log (`getGapiGameDetails function accessed`);
	const gapiGameDetailsUrl = `https://cors-anywhere.herokuapp.com/https://www.giantbomb.com/api/games/`;
	const query = {
		api_key: "2a8e5dcbcc310e7cf6713106844a65288cd678d4",
		format: "json",
		filter: `id:${gameId}`,
		field_list: "name,deck,image,site_detail_url",
	};
	$.getJSON(gapiGameDetailsUrl,query,callback);
};



// --- Data Review Functions ---


// Using capi data, creates an array of ids of up to 5 comic books the character has been in. this allows getCapiComicDetails to pull specific comic information

function gatherComicData (apiData){
	console.log (`gatherComicData function accessed`);
	let comicIds= [capiCharDetails.results.first_appeared_in_issue.id];
	for (let i=0; i<capiCharDetails.results.issue_credits.length; i++){
		if (i>5){
			break;
		};
		comicIds.push(capiCharDetails.results.issue_credits[i].id);	
	};
	for (let i=0; i<comicIds.length; i++){
		getCapiComicDetails(comicIds[i],insertComicInfo);	
	};
	
};


// Using capi data, creates an array of ids of up to 5 movies the character has been in. this allows getCapiMovieDetails to pull specific movie information

function gatherMovieData (apiData){
	console.log (`gatherMovieData function accessed`);
	let movieIds= [];
	for (let i=0; i<capiCharDetails.results.movies.length; i++){
		if (i>5){
			break;
		};
		movieIds.push(capiCharDetails.results.movies[i].id);
	}
	console.log(movieIds);
	for (let i=0; i<movieIds.length; i++){
		getCapiMovieDetails(movieIds[i],insertMovieInfo);
	};
};

// Using gapi data, creates an array of ids of up to 5 games the character has been in. this allows getGapiGameDetails to pull specific game information

function gatherGameData (apiData){
	console.log (`gatherGameData function accessed`);
	const gameIds = [gapiCharDetails.results.first_appeared_in_game.id];
	for (let i=0; i<gapiCharDetails.results.games.length; i++){
		if (i>5){
			break;
		};		
		gameIds.push(gapiCharDetails.results.games[i].id);
	}
	for (let i=0; i<gameIds.length; i++){
		getGapiGameDetails(gameIds[i], insertGameInfo);
	};
};


// Summary: Reviews existence of character in capi. If so, will trigger api pulls to continue loading information. if not, it will call a function to display an invalid search message

function reviewCapiChar (apiData){
	console.log (`reviewCapiChar function accessed`);
	if (apiData.number_of_total_results>= 1) {
		console.log(`Character URL is ${apiData.results[0].api_detail_url}`);
		getCapiCharDetails(apiData.results[0].api_detail_url, updateCapiCharDetails);
		getGapiCharId ();
	}
	else {
		insertInvalidSearch(getGapiCharDetails);
	}
};

// Summary: Reviews comic book character info from capi to determine what to put into comic section DOM

function reviewCapiComic () {
	console.log (`reviewCapiComic function accessed`);
	if (capiCharDetails.results.issue_credits[0] != null){
		gatherComicData();
	}
	else {
		insertNoInfoFound('.comicInfo');
	}
};

// Summary: Reviews movie info from capi to determine what to put into movie section DOM

function reviewCapiMovie () {
	console.log (`reviewCapiMovie function accessed`);
	if (capiCharDetails.results.movies[0] != null){
		gatherMovieData();
	}
	else {
		insertNoInfoFound('.movieInfo');
	}	
};
// Summary: Compares gapi info against user input to determine what to put into game section DOM

function reviewGapiGame () {
	console.log (`reviewGapiGame function accessed`);
	if (gapiCharDetails.results.games[0] != null){
		gatherGameData();
	}
	else {
		insertNoInfoFound('.gameInfo');
	}		
};


// ---DOM Manipulation Functions

// Inserts Invalid Search error message in main dom area. Called when a user submits an invalid search (non comic book character)
function insertInvalidSearch (){
	console.log (`insertInvalidSearch function accessed`);
	$('#alertSection').html(`Uh oh. We can't find that character! Did you spell it correctly? Please try again.`);
	showAlertSection();
};

// Inserts No info found error message in results DOM
function insertNoInfoFound (divClass) {
	console.log (`insertNoInfoFound function accessed`);
	$(divClass).html(`No information available.`)
};

//Inserts a message to notify user that a search is in progress
function searchingMessage(){
	$('#alertSection').html(`<p>Searching...there's a lot of comic book characters y'know...</p>`);
	showAlertSection();
};

// Summary: Houses the calls to Dom updates when a valid character has been searched for

function loadValidCapiDom (){
	console.log (`loadValidCapiDom function accessed`);
	insertCharInfo();
	// showNavElem();
	// showScrollSpy();
	reviewCapiComic();
	reviewCapiMovie();
	showMainContent();
};

function loadValidGapiDom(){
	console.log (`loadValidGapiDom function accessed`);
	reviewGapiGame();
}

// Summary: Inserts capi character pic and desc
function insertCharInfo(){
	console.log (`insertCharInfo function accessed`);
	hideAlertSection();
	let charDetailsString = `
		<div class="card text-center" style="width: 18rem;">
			<h2>${capiCharDetails.results.name}</h2>
			<img class="card-img-top" src="${capiCharDetails.results.image.medium_url}" alt="Image of ${capiCharDetails.results.name}">
			<div class="card-body">
		    	<p class="card-text">${capiCharDetails.results.deck}</p>
		  	</div>
		</div>`
	$(".charInfo").html(charDetailsString);

};
// Inserts capi comic information
function insertComicInfo(apiData){
	console.log (`insertComicInfo function accessed`);
	console.log(apiData);
	let comicDetailsString = `
		<div class="card" style="width: 18rem;">
			<p>${apiData.results[0].name}</p>
		  	<img class="card-img-top" src="${apiData.results[0].image.medium_url}" alt="Image of ${apiData.results[0].name}">
		  	<div class="card-body">
		    <p class="card-text">${apiData.results[0].description}</p>
		  </div>
		</div>
	`;

	$('.comicInfo').append(comicDetailsString);
};

// Inserts capi movie info
function insertMovieInfo(apiData){
	console.log (`insertMovieInfo function accessed`);
	console.log(apiData);
	let movieDetailsString = `
		<div class="card" style="width: 18rem;">
		  <img class="card-img-top" src="${apiData.results[0].image.medium_url}" alt="Image of ${apiData.results[0].name}">
		  <div class="card-body">
		    <p class="card-text">${apiData.results[0].name}</p>
		  </div>
		</div>
	`;

	$('.movieInfo').append(movieDetailsString);
};


// Inserts gapi video game info
function insertGameInfo(apiData){
	console.log (`insertGameInfo function accessed`);
	console.log(apiData);
	let gameDetailsString = `
		<div class="card" style="width: 18rem;">
			<p>${apiData.results[0].name}</p>
			<img class="card-img-top" src="${apiData.results[0].image.medium_url}" alt="Image of ${apiData.results[0].name}">
			<div class="card-body">
		    <p class="card-text">${apiData.results[0].deck}</p>
		  </div>
		</div>
	`;

	$('.gameInfo').append(gameDetailsString);
};

// unhides section containing h2 elements
function showMainContent(){
	console.log (`showMainContent function accessed`);
	$('#hiddenSection').removeClass("d-none");

};

// Hides section containing h2 elements
function hideMainContent(){
	console.log (`hideMainContent function accessed`);
	$('#hiddenSection').addClass("d-none");	
}

// Shows Alert Section
function showAlertSection(){
	$('#alertSection').removeClass("d-none");
}

// Hides Alert Section
function hideAlertSection(){
	$('#alertSection').addClass("d-none");
}

//Clears all content within the results sections
function clearContent(){
	$('.detailSection').html("");
}



// --- Other DOM manipulations ---

// Displays nav bar elements
// function showNavElem(){
// 	console.log (`showNavElem function accessed`);

// }

// // Hides nav bar elements
// function hideNavElem(){
// 	console.log (`hideNavElem function accessed`);

// }


// }

// // Implements scrollspy
// function showScrollSpy (){
// 	console.log (`showScrollSpy function accessed`);
// }


// ---Other functions---

// Summary: creates storage place for results of capi character details pull

function updateCapiCharDetails(apiData){
	console.log (`updateCapiCharDetails function accessed`);
	capiCharDetails=apiData;
	console.log(capiCharDetails);
	loadValidCapiDom();
};

// Summary: creates storage place for results of gapi character details pull

function updateGapiCharDetails(apiData){
	console.log (`updateGapiCharDetails function accessed`);	
	gapiCharDetails=apiData;
	console.log(gapiCharDetails);
	loadValidGapiDom();
};

// --- Event Listeners ---


// Home function that clears all added elements and returns to original screen


// Summary: Evaluates & stores cust input upon button click
function getUserSubmitValue (){
	$('.searchButton').on('click', function (event) {
		console.log (`getUserSubmitValue function accessed`);
		event.preventDefault();
		hideAlertSection();
		hideMainContent();
		clearContent();
		userSearchData = $(".searchBox").val();
		console.log (`This is what the user searched for: ${userSearchData}`);
		$('.searchBox').val("");
		searchingMessage();
		getCapiCharId (reviewCapiChar);	
	})
};

$(getUserSubmitValue);