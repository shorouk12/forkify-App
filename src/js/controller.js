import 'core-js/stable'; //for pollyfilling every thing else
import 'regenerator-runtime/runtime'; //for pollyfilling async await
import * as model from './model.js';
import recipeVeiw from './views/recipeVeiw.js';
import searchVeiw from './views/searchVeiw.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './configration.js';



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if(module.hot) module.hot.accept();
const controlRecipes = async function () {
  try {
    
    //get the id of the recipe from the hash
    const id = window.location.hash.slice(1);
    
    if (!id) return;
    recipeVeiw.renderSpiner();

    resultsView.update(model.getSearchResultsPage()); 
    bookmarksView.update(model.state.bookmarks);
    //1) loading recipe
    await model.loadRecipe(id);

    //2)rendering recipe
    recipeVeiw.render(model.state.recipe);
    
  } catch (err) {
    recipeVeiw.renderError(); 
   //console.log(err);
  }
};


const controllSearchResults = async function () {
  try {
    //get search query
    resultsView.renderSpiner();
    const query = searchVeiw.getQuery();
    if (!query) return;
    
    //load search query
    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    
    //rendering results
    resultsView.render(model.getSearchResultsPage());

    //rendering initial paggination buttons
    paginationView.render(model.state.search);
    
    
  } catch (err) {
    console.log(err);
  }
};

const controlAddBookMark = function(){

  if(!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  //console.log(model.state.recipe);
  recipeVeiw.update(model.state.recipe);

  //rendering bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlPagination = function(page){
 
  //rendering new results
  resultsView.render(model.getSearchResultsPage(page));

  //rendering new paggination buttons
  paginationView.render(model.state.search);

}

const controlServings = function(newServing){
  //update ervings
  model.updatingServings(newServing);

  //update the recipe view
  recipeVeiw.render(model.state.recipe);
  //recipeVeiw.update(model.state.recipe);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe){
  try{

    //showing spinner
    addRecipeView.renderSpiner();


      await model.uploadRecipe(newRecipe);
      console.log(model.state.recipe);
      //render recipe
      recipeVeiw.render(model.state.recipe);

      //display success msg
      addRecipeView.renderMessage();

      //rendreing bookmarks
      bookmarksView.render(model.state.bookmarks);

      //change the url wiz the current id
      window.history.pushState(null,'',`#${model.state.recipe.id}`);

      //hide form after success msg
      setTimeout(function(){
        addRecipeView._toggelWindow();
      },MODAL_CLOSE_SEC * 1000);
  }
  catch(err){
      console.log(err);
      addRecipeView.renderError(err.message);
  }
  
}

//the subscriber
const init = function () {
  bookmarksView.addHandler(controlBookmarks);
  recipeVeiw.addHandlerRender(controlRecipes);
  recipeVeiw.addHandlerUpdateServings(controlServings);
  recipeVeiw.addHandlerAddBookmark(controlAddBookMark);
  searchVeiw.addHandlerSearch(controllSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
