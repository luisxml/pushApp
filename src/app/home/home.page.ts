import { Component, OnInit, ApplicationRef } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mensajes: OSNotificationPayload[] = [];

  constructor(
    public _pushService: PushService,
    private _applicationRef: ApplicationRef
  ) {}
  
  ngOnInit() {
    this._pushService.pushListener.subscribe( noti => {
      this.mensajes.unshift(noti);
      this._applicationRef.tick();
    });
  }
  
  async ionViewWillEnter() {
    this.mensajes = await this._pushService.getMensajes();
    // return this.mensajes;
  }

  async borrrarMensajes() {
    await this._pushService.borrrarMensajes();
    this.mensajes = [];

  }

}
