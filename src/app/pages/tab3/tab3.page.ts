import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  // articles: Article[];

  constructor(private storageService: StorageService) {


  }

  ngOnInit(): void {
    // this.articles = this.storageService.getLocalArticles;
    // console.log(this.articles);
  }

  // No sé por qué coño tengo que usar un get aquí
  // para recuperar los artículos de storage.service mediante getLocalArticles he intentado hacerlo de la manera clásica
  // y no funciona, devuelve un array vacío
  // no sé si es porque el método get de storage es asíncrono y no carga a tiempo o que sé yo


   get articles(): Article[]{
     return this.storageService.getLocalArticles;
   }



}
