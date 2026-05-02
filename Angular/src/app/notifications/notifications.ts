import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header';
import { FooterComponent } from '../components/footer/footer';
import { AsideComponent } from '../components/sidebar/sidebar';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';  // ← import directo
import { Firestore, collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from '@angular/fire/firestore'; // ← añade deleteDoc

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, AsideComponent, CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  todayNotifs: any[] = [];
  yesterdayNotifs: any[] = [];
  last30Notifs: any[] = [];
  loading = true;

  ngOnInit() {
    onAuthStateChanged(this.auth, user => {
      if (!user) {
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      const q = query(
        collection(this.firestore, 'notifications'),
        where('to_uid', '==', user.uid),
        orderBy('created_at', 'desc')
      );

      onSnapshot(q, snapshot => {
        const all = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // ← AÑADE ESTO: marca como leídas
        snapshot.docs.forEach(async d => {
          if (!d.data()['read']) {
            await updateDoc(doc(this.firestore, 'notifications', d.id), { read: true });
          }
        });

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(todayStart.getDate() - 1);
        const last30Start = new Date(todayStart);
        last30Start.setDate(todayStart.getDate() - 30);

        this.todayNotifs = all.filter((n: any) => new Date(n.created_at) >= todayStart);
        this.yesterdayNotifs = all.filter((n: any) =>
          new Date(n.created_at) >= yesterdayStart && new Date(n.created_at) < todayStart
        );
        this.last30Notifs = all.filter((n: any) =>
          new Date(n.created_at) >= last30Start && new Date(n.created_at) < yesterdayStart
        );
        this.loading = false;
        this.cdr.detectChanges();
      });
    });
  }
  async deleteNotif(id: string) {
    await deleteDoc(doc(this.firestore, 'notifications', id));
  }
}
