'use strict'

function loadFromStorage(key) {
    const value = localStorage[key];
    if (value) return JSON.parse(value)
}

function saveToStorage(key, value) {
    localStorage[key] = JSON.stringify(value);
}

function removeFromStorage(key) {
    localStorage.removeItem(key);
}