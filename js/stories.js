"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {

  const hostName = story.getHostName();
  return $(`
      <li class="Story" id="${story.storyId}">
      <span > <i id= "favoriteButton" class="far fa-thumbs-up"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

}


/* call whenever the new story form is submitted, hides form area and resets input values to empty strings */
function resetAndHideForm() {
  console.log("hiding submit story form")
  $submitStoryForm.hide();
  $submitStoryForm.trigger("reset");
}


/* when user fills out and submits form, grab info and pass it to addStory(), collapse form and clear values */

async function submitNewStory(evt) {
  evt.preventDefault();
  console.log($("#submit-form-author").val())
  let newStoryData = {
    // CR: keys dont need to be strings
    author: $("#submit-form-author").val(),
    title: $("#submit-form-title").val(),
    url: $("#submit-form-url").val()
  }
  resetAndHideForm()
  let newStory = await storyList.addStory(currentUser, newStoryData);
  let $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
}
/* when submit form button is clicked, run submitNewStory */
$("#submit-story-form").on("submit", submitNewStory);

// data logic: clicking the icon will target the closest story.StoryId and add it to the 
// currentUser.favorites array. remove if already favorited

// UI logic: first click makes thumbs up dark, second click makes it light, prepends to 
// favorites section (check if this is already a section in starter code), remove from dom
// if unfavorited 


// on click of favorite button, target the closest list element and obtain the storyID, identify
// the story associated with that ID in the storyList

function toggleFavoriteButton(evt){
  // CR: dont look for a list items, runs risk of design changes adverse effects. instead assign a class.
  let clickedStoryId = $(evt.target).closest(".Story").attr("id");
  // CR: use .find instead of .filter, more fit for purpose. trying to find the one item that matches at an id
  let clickedStoryObject = storyList.stories.filter((story) => story.storyId===clickedStoryId);
  checkIfInFavorite(clickedStoryObject[0]);
}

// loops through currentUser.favorites and checks if the ID of the story clicked
// by the user matches an existing storyId in the current user's favorites array
// if present, will remove - else will add to the array
// CR: name: its not just checking, use .find instead of a for-of
function checkIfInFavorite(clickedStory){
  for (let story of currentUser.favorites){
    //loop through all currentUser favorite story IDs to check for match
    if(story.storyId === clickedStory.storyId){
      console.log('removing soon')
      return currentUser.removeUserFavorite(clickedStory);
      
    } 
  }
  console.log('adding soon')
  return currentUser.addUserFavorite(clickedStory);
}
//CR: attaches a listener to the allstorieslist, checks for any clicks in the storieslist, checks if the element click matches the
// class '.fa-thumbs-up', if so then run the toggleFavoriteButton
$allStoriesList.on("click", ".fa-thumbs-up", toggleFavoriteButton);

