import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  // el static true del viewchild hace que se pueda utilizar en la función ngOnInit()
  // si no, aparecerá como undefined
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

  public articles: Article[] = [];

  constructor( private newsService: NewsService ) {}


  ngOnInit(){
    this.newsService.getTopHeadlines()
    .subscribe(
      articles => {
        this.articles.push(...articles);
      }
    );
  }

    // podemos quitar el parámetro event mediante viewchild

  // loadData(event: any){
    loadData(){
      this.newsService.getTopHeadlinesByCategory('business', true)
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
