import View from './view';
import icons from 'url:../../img/icons.svg';
//import {Fraction} from 'fractional'; //libirary to turn fractions from (0.5) to 1/2

class paginationView extends View{
    _parentEl = document.querySelector('.pagination');

    _generateMarkUp(){

        const currentPage = this._data.page;
        //number of pages
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        

         //page 1 and there are other pages
         if(currentPage === 1 && numPages> 1){ 
            return this._nextButtonMarkup(currentPage);
           }

        //last page
        if(currentPage === numPages && numPages > 1){
           return this._backButtonMarkup(currentPage);
        }

        //other pages
        if(currentPage >1 && currentPage < numPages ){
            //go back and go forward
           
            return ` ${this._backButtonMarkup(currentPage)} 
                     ${this._nextButtonMarkup(currentPage)}`;
        }

        // page 1 and there is no other pages
        if(currentPage === 1 && numPages===1 ){
            return '';
        }
       
    }

    //the publisher
    addHandlerClick(handler){
        //delegation
        this._parentEl.addEventListener('click',function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return
            const gotoPage = btn.dataset.goto;
            
            handler(Number(gotoPage));
        });

    }

    _backButtonMarkup(currentPage){
        return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
      </button>`;
    }

    _nextButtonMarkup(currentPage){
        return `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
           <span>Page ${currentPage + 1}</span>
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-right"></use>
           </svg>
         </button>`;
    }
}

export default new paginationView();