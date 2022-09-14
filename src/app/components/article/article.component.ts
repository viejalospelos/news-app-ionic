import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {

  @Input() article: Article;
  @Input() index: number;

  constructor(
    private iab: InAppBrowser,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService: StorageService)
    { }

  ngOnInit() {}

  openArticle(){
    if( this.platform.is('ios') || this.platform.is('android') ){
      const browser = this.iab.create(this.article.url);
      browser.show();
    }else{
      window.open(this.article.url, '_blank');  //esto es para abrir en el navegador externo en vez de en InAppBrowser y evitar un warning
    }
  }

  async onOpenMenu(){
    const articleInFavorite = this.storageService.articleInFavorites(this.article);

//estos botones aparecen siempre, tanto en desktop como en móvil
    const normalBtns: ActionSheetButton[] = [
      {
        text: articleInFavorite ? 'Eliminar de favoritos' : 'Favorito',
        icon: articleInFavorite ? 'heart' : 'heart-outline',
        handler: () => this.onToggleFavorite()
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel'
      }
    ];
//este botón aparece sólo en móvil (en desktop da warnings y no funciona)
    const shareBtn: ActionSheetButton = {
      text: 'Compartir',
      icon: 'share-outline',
      handler: () => this.onShareArticle()
    };
//si estamos en capacitor significa que estamos en móvil
// lo que hacemos es añadir el botón al array de normalBtns
    console.log('estamos en capacitor: ' + this.platform.is('capacitor'));
    if(this.platform.is('capacitor')){
      normalBtns.unshift(shareBtn); //unshift añade el botón al principio del array para que aparezca el primero
    }
// creamos la botonera; si estamos en móvil aparecerán 3 y si estamos en desktop, 2
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Opciones',
      buttons: normalBtns
    });

    await actionSheet.present();
  }

  onShareArticle(){
    this.socialSharing.share(
      this.article.title,
      this.article.source.name,
      null,
      this.article.url
    );
  }

  onToggleFavorite(){
    this.storageService.saveRemoveArticle(this.article);
  }

}