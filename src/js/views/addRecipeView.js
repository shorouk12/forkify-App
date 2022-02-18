import View from './view';
import icons from 'url:../../img/icons.svg';

class addRecipeView extends View{
    _parentEl = document.querySelector('.upload');
    _message = "Recipe was successfully uploaded :)";
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor(){
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    _toggelWindow(){
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }
    
    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click',this._toggelWindow.bind(this));
    }

    _addHandlerHideWindow(){
        this._overlay.addEventListener('click',this._toggelWindow.bind(this) ) ;
        this._btnClose.addEventListener('click',this._toggelWindow.bind(this) ) ;
    }

    addHandlerUpload(handler){
        this._parentEl.addEventListener('submit',function(e){
            e.preventDefault();

            //gettinh the data of the recipe from the form using formdata 
            const dataArr = [ ...new FormData(this)] ;
            const data = Object.fromEntries(dataArr);
            handler(data);
        })
    }

    _generateMarkUp(){

    }
}

export default new addRecipeView();