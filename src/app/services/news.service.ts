import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { map } from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor( private http: HttpClient ) { }

  public executeQuery<T>( endpoint: string ) {
    console.log('Petición HTTP realizada');
    return this.http.get<T>(`${ apiUrl }${ endpoint }`, {
      params: { 
        apiKey: apiKey,
        country: 'us',
      }
    })
  }

  // voy a mandar el apiKey en la URL y en las cabeceras HTML (segundo parámetro de la petición);
  // sólo habría que hacerlo de una forma pero lo dejo así como muestra
  getTopHeadlines(): Observable<Article[]>{

    return this.getTopHeadlinesByCategory('business');


    // return this.http.get<NewsResponse>(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${ apiKey }`,
    // {
    //   params: {
    //     apiKey
    //   }
    // }).pipe(
    //   //forma desestructurada https://www.freecodecamp.org/espanol/news/desestructuracion-de-arreglos-y-objetos-en-javascript/
    //   map( ({articles}) => articles )
    // );

  }

  getTopHeadlinesByCategory( category: string, loadMore: boolean = false ): Observable<Article[]> {
// si el usuario quiere cargar más artículos loadMore sería true y se obtienen
    if ( loadMore){
      return this.getArticlesByCategory(category);
    }
// si el usuario cambia de categoría y luego vuelve a la categoría anterior,
// no se llama a la API, se devuelven los que habíamos cargado antes
    if (this.articlesByCategoryAndPage[category]) {
      return of(this.articlesByCategoryAndPage[category].articles); //of es una función de rxjs que convierte un array en un observable
    }
// si no es nada de lo anterior se llama a la API mediante getArticlesByCategory()
    return this.getArticlesByCategory(category);
  }

  private getArticlesByCategory( category: string ): Observable<Article[]> {

    if (Object.keys( this.articlesByCategoryAndPage ).includes(category)) {
      // ya existe
      // this.articlesByCategoryAndPage[category].page += 1;
      // console.log(this.articlesByCategoryAndPage);
    } else {
      // si no existe se crea el objeto según la hemos definido en la interfaz
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
      };
      // console.log(this.articlesByCategoryAndPage);
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${category}&page=${page}`)
    .pipe(
      map( ({articles}) => {

        if (articles.length === 0) {return [];}
        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [ ...this.articlesByCategoryAndPage[category].articles, ...articles]
        };

        return this.articlesByCategoryAndPage[category].articles;
      } )
    );
  }


}
