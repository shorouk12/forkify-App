import View from './view.js';
import preveiwVeiw from './preveiwVeiw.js';


class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Bookmarks Yet. Find nice recipe and bookmark it ;)'; 
    _message=''; 

  addHandler(handler){
    window.addEventListener('click',handler);
  }

  _generateMarkUp() {
     
    return this._data.map(bookmark => preveiwVeiw.render(bookmark,false)).join(''); 
  }

}

export default new BookmarksView();
