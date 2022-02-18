import View from './view.js';
import preveiwVeiw from './preveiwVeiw.js';


class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No Recipes Found For Your Query! please try again ;)'; 
  _message=''; 
  
  _generateMarkUp() {
     
      return this._data.map(result => preveiwVeiw.render(result,false)).join(''); 
    }
}

export default new ResultsView();
