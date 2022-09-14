import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { Article } from 'src/app/interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  // el static true del viewchild hace que se pueda utilizar en la función ngOnInit()
  // si no, aparecerá como undefined
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology'
  ];

  selectedCategory: string = this.categories[0];
  public articles: Article[] = [];

  constructor( private newsService: NewsService ) {}

  ngOnInit(): void {
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory).
    subscribe(articles => {
        this.articles = [...articles];
    });
  }

  segmentChanged( event: CustomEvent ){
    // al poner "as CustomEvent" typescript lo trata como tal y evitamos el any
    this.selectedCategory = (event as CustomEvent).detail.value;
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory).
    subscribe(articles => {
      this.articles = [...articles];
    });

  }

  // podemos quitar el parámetro event mediante viewchild

  // loadData(event: any){
  loadData(){
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true)
    .subscribe(articles => {
      // console.log(articles);
      if(articles.length === this.articles.length || articles.length === 0){
        // event.target.disabled = true;
        this.infiniteScroll.disabled = true; //esto es con el viewchild
        return;
      }

      this.articles = articles;
      // console.log(this.articles);

      // el setTimeout es un truco para asegurarnos de que se ha realizado todo el renderizado
      // antes de que el usuario lance una nueva petición
      setTimeout(() => {
        // event.target.complete();
        this.infiniteScroll.complete(); //esto es con el viewchild
      }, 1000);
    });
  }

}
