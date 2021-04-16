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
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
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
  console.log("hiding submit form")
  $submitForm.hide();
  $submitForm.trigger("reset");
}


/* when user fills out and submits form, grab info and pass it to addStory(), collapse form and clear values */

async function submitNewStory(evt) {
  evt.preventDefault();
  console.log($("#submit-form-author").val())
  let newStoryData = {
    "author": $("#submit-form-author").val(),
    "title": $("#submit-form-title").val(),
    "url": $("#submit-form-url").val()
  }
  resetAndHideForm()
  let newStory = await storyList.addStory(currentUser, newStoryData);
  let $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
}
/* when submit form button is clicked, run submitNewStory */
$("#submit-story-form").on("submit", submitNewStory);