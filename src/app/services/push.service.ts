import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo del push',
    //   body: 'Este es el body',
    //   date: new Date()
    // }
  ];

  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(
    private _oneSignal: OneSignal,
    private _storage: Storage
  ) { 
    this.cargarMensajes();
  }

  configuracionInicial() {
    this._oneSignal.startInit('0b0b7e7f-0b71-4dc6-97b9-0b1731c6afd8', '763640516225');

    this._oneSignal.inFocusDisplaying(this._oneSignal.OSInFocusDisplayOption.Notification);

    this._oneSignal.handleNotificationReceived().subscribe((noti) => {
    // do something when notification is received
      console.log('notificacion recibida', noti);
      this.notificacionRecibida(noti);
    });

    this._oneSignal.handleNotificationOpened().subscribe( async(noti) => {
      // do something when a notification is opened
      console.log('notificacion abierta', noti);
      await this.notificacionRecibida(noti.notification);
    });


    // Obtener id del suscriptor
    this._oneSignal.getIds().then( info => {
      this.userId = info.userId;
      console.log(this.userId);
    });

    this._oneSignal.endInit();
  }

  async notificacionRecibida(noti: OSNotification) {

    await this.cargarMensajes();

    const payload = noti.payload;
    const existe = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);

    if (existe) {
      return;
    }

    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);

    await this.guardarMensajes();
    
  }

  async getMensajes() {
    await this.cargarMensajes()
    return [...this.mensajes];
  }

  guardarMensajes() {
    this._storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes() {
    // this._storage.clear();
    this.mensajes = await this._storage.get('mensajes') || [];
    return this.mensajes;
  }

  async borrrarMensajes() {
    await this._storage.remove('mensajes');
    this.mensajes = [];
    this.guardarMensajes();
  }

}
