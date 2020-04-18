//var gSearchedWord

var gKeepResolve; // is used to keep the "resolved" when the user actually click on the color picker modal


'use strict'

function onInit() {
    triggerAPIs('bush') // Default intial search
}


function onSubmitForm(ev) {
    ev.preventDefault();
    const searchedWord = document.querySelector('input').value
    if (searchedWord.length === 0) return
    //gSearchedWord = searchedWord
    triggerAPIs(searchedWord)
}

function onClickSearch() {
    const searchedWord = document.querySelector('input').value
    if (searchedWord.length === 0) return
    //gSearchedWord = searchedWord
    triggerAPIs(searchedWord)
}

function triggerAPIs(searchWord) {
    document.querySelector('input').value = searchWord;

    getWikiData(searchWord)
        .then(mergeWithDescData)
    getYoutubeData(searchWord)
        .then(buildMoviesObject)
}

// Handle movies 
function buildMoviesObject(movies) {
    if (movies.items.length === 0) {
        renderNoMovies()
        return
    }
    const moviesData = movies.items.map((movie) => {
        return {
            movieId: movie.id.videoId,
            movieTitle: movie.snippet.title,
            movieThumbnail: movie.snippet.thumbnails.medium.url
        }
    })
    onPlayMoive(moviesData[0].movieId)
    renderMovies(moviesData)
    renderSearchwords()
}

function renderMovies(moviesData) {
    const strHTML = moviesData.map(getMovieStr)
    document.querySelector('.movies-content').innerHTML = strHTML.join('')

}

function getMovieStr(movie) {
    return `
    <article class="movie-box" onclick="onPlayMoive('${movie.movieId}')">
    <img src="${movie.movieThumbnail}" >
    <h4>${movie.movieTitle}</h4>
    </article>
    `
}

function onPlayMoive(movieId) {
    document.querySelector('iframe').src = `https://www.youtube.com/embed/${movieId}`;
}

function renderNoMovies() {
    document.querySelector('.movies-content').innerHTML =
        `<h1>No Results</h1>`
}


// Handle wiki articles 

function mergeWithDescData(results) {
    // debugger
    const prmRepos = results[1].map(result => {
        return getWikiDesc(result)
    })
    Promise.all(prmRepos)
        .then(reposResults => {
            const wikiSearchFullData = reposResults.map((repoResult, index) => {
                return {
                    resultKey: results[1][index],
                    resultLink: results[3][index],
                    resultDesc: Object.values(repoResult.query.pages)[0].extract
                }


            })
            renderWikiData(wikiSearchFullData)
        })
}


function renderWikiData(wikiData) {
    const strHTML = wikiData.map(getWikiArticleStr)
    document.querySelector('.wiki-content').innerHTML = strHTML.join('')
}

function getWikiArticleStr(article) {
    return `
    <article class="wiki-box")>
    <a href="${article.resultLink}" title="Open in wikipedia">${article.resultKey}</a>
    <div>${article.resultDesc}</div>
    </article>
    `
}

// Handle search keywords

function renderSearchwords() {
    const words = getWords();
    const strHTML = words.map(geWordStr)
    strHTML.push(`<button onclick="onClearHistory()" style="margin-left:15px">Clear History</button>`)
    document.querySelector('.searched-words-content').innerHTML = strHTML.join('')
}

function geWordStr(word) {
    return `
<div class="search-word" onclick ="triggerAPIs('${word}')">${word}</div>
`
}


// Clear history modal

function onClearHistory() {
    Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, clear history'
    }).then((result) => {
        if (result.value) {
            clearStorage()
            renderSearchwords()
            document.querySelector('.searched-words-content button').disabled = true
            Swal.fire(
                'Cleared!',
                'History is clean',
                'success'
            )
        }
    })

}

// Change Theme modal

function onChangeTheme() {
    var prmRes = showThemeModal()
    prmRes.then(res => {
        if (res)
            document.querySelector('body').style.backgroundColor =
                document.querySelector('.popup input').value
    })
}

function showThemeModal() {
    const elPopup = document.querySelector('.popup');
    elPopup.hidden = false;
    return new Promise((resolve) => {
        gKeepResolve = resolve;
    })
}

function onUserRes(res) {
    gKeepResolve(res)
    const elPopup = document.querySelector('.popup');
    elPopup.hidden = true;
}