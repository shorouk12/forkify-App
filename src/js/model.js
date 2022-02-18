import {API_URL,RES_PER_PAGE,KEY} from './configration.js';
//import {getJSON,sendJSON} from './helpers.js';
import {AJAX} from './helpers.js';

//holds all the data of the application
export const state = {
    recipe: {},
    search: {
        query:'',
        results:[],
        resultsPerPage: RES_PER_PAGE,
        page: 1,
    }
    ,
    bookmarks: [],
}


const createRecipeObject = function(data){
    const rec = data.data.recipe;
    return { 
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        image: rec.image_url,
        servings: rec.servings,
        cookingTime: rec.cooking_time,
        ingredients: rec.ingredients,
        ...(rec.key && {key : rec.key}),
      };
};

export const loadRecipe = async function(id){
 
    try{ 
    //console.log(id);
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`)  //`${API_URL}${id}` https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886
    
    state.recipe = createRecipeObject(data);

    if(state.bookmarks.some(bookmark=> bookmark.id === id)){
        state.recipe.bookmarked = true;
    }
    else
    state.recipe.bookmarked = false;

    }

    catch(err){
        //error handling
        throw err;
    }
}

//search

export const loadSearchResults = async function(query){ 
    try{
        
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);  
        

        state.search.results= data.data.recipes.map(recipe=>{
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher, 
                image: recipe.image_url,
               ...(recipe.key && {key: recipe.key}),   
                   }
        })
        state.search.page = 1;
        
    }
    catch(error){
        console.log(error);
        throw error;
    }
    
}


export const getSearchResultsPage = function(page = state.search.page){
    state.search.page = page;
    const start = (page-1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start,end);
}

export const updatingServings = function(newServing){

    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServing / state.recipe.servings;
    });

    state.recipe.servings = newServing;
}


//for local storage
const persist = function(){
    window.localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
}

export const addBookMark = function(recipe){
    //add book marks
    state.bookmarks.push(recipe);

    //if the current recipe is bookmark, bookmark it
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persist();
}

export const removeBookmark = function(id){
    
    const index = state.bookmarks.findIndex(el => el.id === id);

    state.bookmarks.splice(index,1);

    if(id === state.recipe.id) state.recipe.bookmarked = false;

    persist();
};

export const uploadRecipe = async function(newRecipe){

    try
    {
    const ingredients =  Object.entries(newRecipe).filter(
        entry => entry[0].startsWith('ingredient') &&
                 entry[1] !== ''
    ).map(ing =>{
        const ingArr = ing[1].replaceAll(' ','').split(',');
        const [quantity,unit,description] = ingArr;

        if(ingArr.length !==3) throw new Error('Wrong Format! please use the correct format :)');

        return {quantity: quantity? +quantity: null,unit,description};
    });

    recipe = { 
        title: newRecipe.title,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        publisher: newRecipe.publisher,
        cooking_time: +newRecipe.cookingTime,
        servings: +newRecipe.servings,
        ingredients,
      };

    const data = await AJAX(`${API_URL}?key=${KEY}`,recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
    //console.log(data);

    }

    catch(err){
        throw err;
    }

   
};


const init = function(){
    const storage = window.localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);

}

init();