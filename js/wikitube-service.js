'use strict'

const API_KEY = 'AIzaSyAxaWfcCWnZgFFEtSBDU8r6DDIaH8H11bg'
const SERCHED_WORDS_KEY = 'searched_words'
var gWords = []


function getWikiData(searchWord) {
    return axios.get(`https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${searchWord}&limit=5`)
        .then(res => {
            return res.data;
        })
        .catch((err) => {
            console.log('Had an issue:', err)
        })
}

function getWikiDesc(result) {
    return axios.get(`https://en.wikipedia.org/w/api.php?&origin=*&format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${result}`)
        .then(res => {
            return res.data;
        })
        .catch((err) => {
            console.log('Had an issue:', err)
        })
}

function getYoutubeData(inputSearchWord) {
    var recentSearches = loadFromStorage(SERCHED_WORDS_KEY)
    if (recentSearches) {
        const keyWord = recentSearches.find(searchWord => searchWord === inputSearchWord.toLowerCase())
        if (keyWord) {
            console.log('from storage')
            const currData = loadFromStorage(keyWord)
            return (Promise.resolve(currData))
        }
    }
    console.log('from server')
    return axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet &videoEmbeddable=true&type=video&key=${API_KEY}&q=${inputSearchWord}`)
        .then(res => {
            saveToStorage(inputSearchWord.toLowerCase(), res.data)
            const wordFound = gWords.find(word => (word === inputSearchWord))
            if (!wordFound) { //save only new words... 
                gWords.push(inputSearchWord.toLowerCase())
                saveToStorage(SERCHED_WORDS_KEY, gWords)  
            }
            console.log(res.data)
            return res.data;
        })
        .catch((err) => {
            console.log('Had an issue:', err)
        })
}

function getWords() {
    const words = loadFromStorage(SERCHED_WORDS_KEY)
    if (words) {
        gWords = words
        return gWords
    }
    return []
}

function clearStorage() { //For clearing history
    gWords = []
    removeFromStorage(SERCHED_WORDS_KEY)
}