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
      <li id="${story.storyId}">
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

// toggleFavoriteButton(evt) - save evt.target of closest to story to storyClicked var. check and see
// if storyClicked.storyId is in currentUser.favorites.storyId. 

function toggleFavoriteButton(evt){
  let clickedStoryId = $(evt.target).closest("li").attr("id");
  let result = checkIfInFavorite(clickedStoryId);
  addOrRemoveFavoriteConductor(result)
}

// loops through currentUser.favorites.storyId to check and see
// if ID passed as argument is inside current user array .  if YES => return true
// if NO => return false . 
function checkIfInFavorite(id){
  for (let story of currentUser.favorites){
    //loop through all currentUser favorite story IDs to check for match
    if(story.storyId === id){
      return true;
    } 
  }
  return false;
}

// conductor function. toggleFavoriteButton finds the clicked stories ID and passes it into CheckIfInFavorites to see if we have 
// already favorited story or not

function addOrRemoveFavoriteConductor(result){
  if (result){
    currentUser.addUserFavorite()
  }
}

$allStoriesList.on("click", "span", toggleFavoriteButton);

