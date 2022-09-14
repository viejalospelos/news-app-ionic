/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Article } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;
  private _localArticles: Article[] = [];

  constructor(private storage: Storage) {
    this.init();
  }

  get getLocalArticles(){
    return [ ...this._localArticles ]; // lo devolvemos desestructurado para que regrese un nuevo objeto
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
    this.loadFavorites();
  }

  // LAS OPERACIONES SOBRE INDEXEDDB SIEMPRE SON ASÍNCRONAS

  async saveRemoveArticle(article: Article){
    // con find() comprobamos si está repetido
    // busca en _localArticles un articulo que coincida con el título; si lo encuentra, lo devuelve entero
    const exist = this._localArticles.find(localArticle => localArticle.title === article.title);
    // una vez comprobado, si está reperido, exist contendrá un objeto, caso contrario será undefined
    // en el caso de que exist esté definido, con el método filter() creamos un nuevo _localArticles sin el articulo repetido
    // es decir si pulsas favorito por segunda vez, lo elimina de indexedDb
    if(exist){
      this._localArticles = this._localArticles.filter(localArticle => localArticle.title !== article.title);
    }else{
      this._localArticles = [article, ...this._localArticles]; //insertamos el nuevo artículo antes de los que ya tengamos (al principio)
    }

    await this._storage.set('articles', this._localArticles);  //el método set de storage devuelve una promesa

  }

  async loadFavorites(){
    try {
      const articles = await this._storage.get('articles'); //el método get de storage devuelve una promesa
      this._localArticles = articles || []; // cargamos los favoritos en _localArticles
    } catch (error) {
      
    }
  }

  // esto es para comprobar si tenemos cierto artículo en favoritos.
  articleInFavorites(article: Article){
    // la doble negación es para que devuelva un booleano en vez de un artículo.
    // la negación simple sería como "si no existe tal.." y la doble sería "si existe tal.." devolviendo true o false
    return !!this._localArticles.find(localArticle => localArticle.title === article.title);
  }

}
