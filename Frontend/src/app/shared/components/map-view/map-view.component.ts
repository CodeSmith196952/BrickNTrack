import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface MapProperty {
  lat: number;
  lng: number;
  name: string;
  price: string;
  address: string;
  original: any;
}

@Component({
  selector: 'app-map-view',
  template: `
    <div class="map-wrapper" [style.height]="height">
      <!-- Multi-marker map using Leaflet -->
      <div #mapContainer class="map-container" *ngIf="validProperties.length > 0"></div>

      <!-- Single property fallback with OSM embed -->
      <iframe *ngIf="validProperties.length === 0 && singleMapUrl" [src]="singleMapUrl" class="map-frame"
              allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade">
      </iframe>

      <!-- No location data -->
      <div *ngIf="validProperties.length === 0 && !singleMapUrl" class="map-placeholder">
        <i class="fa-solid fa-map-location-dot"></i>
        <p>No properties with location data found</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .map-wrapper {
      width: 100%;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      background: #f1f5f9;
      position: relative;
    }
    .map-container {
      width: 100%;
      height: 100%;
    }
    .map-frame {
      width: 100%;
      height: 100%;
      border: none;
    }
    .map-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
    }
    .map-placeholder i { font-size: 32px; margin-bottom: 8px; }
    .map-placeholder p { font-size: 14px; }
  `]
})
export class MapViewComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() properties: any[] = [];
  @Input() height = '350px';
  @Input() zoom = 13;
  @Output() propertyClick = new EventEmitter<any>();

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  validProperties: MapProperty[] = [];
  singleMapUrl: SafeResourceUrl | null = null;
  private map: any = null;
  private leafletLoaded = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    if (this.validProperties.length > 0) {
      this.initLeafletMap();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['properties']) {
      this.parseProperties();
      if (this.validProperties.length > 0 && this.mapContainer) {
        setTimeout(() => this.initLeafletMap(), 100);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private parseProperties(): void {
    this.validProperties = [];
    this.singleMapUrl = null;

    if (!this.properties?.length) return;

    for (const prop of this.properties) {
      const lat = prop.latitude;
      const lng = prop.longitude;

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        this.validProperties.push({
          lat,
          lng,
          name: prop.projectName || 'Property',
          price: this.formatPrice(prop.budget),
          address: prop.projectAddress || prop.city || '',
          original: prop
        });
      }
    }
  }

  private async initLeafletMap(): Promise<void> {
    if (this.validProperties.length === 0) return;

    // Load Leaflet dynamically
    if (!this.leafletLoaded) {
      await this.loadLeaflet();
      this.leafletLoaded = true;
    }

    const L = (window as any).L;
    if (!L) {
      // Fallback to OSM embed for first property
      this.fallbackToEmbed();
      return;
    }

    // Remove existing map
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    const container = this.mapContainer?.nativeElement;
    if (!container) return;

    // Calculate center and bounds
    const lats = this.validProperties.map(p => p.lat);
    const lngs = this.validProperties.map(p => p.lng);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    this.map = L.map(container).setView([centerLat, centerLng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Add markers
    const markers: any[] = [];
    for (const prop of this.validProperties) {
      const marker = L.marker([prop.lat, prop.lng]).addTo(this.map);
      marker.bindPopup(`
        <div style="min-width:180px;">
          <strong style="font-size:14px;">${prop.name}</strong><br>
          <span style="color:#16a34a;font-weight:600;font-size:13px;">₹${prop.price}</span><br>
          <small style="color:#6b7280;">${prop.address}</small>
        </div>
      `);
      marker.on('click', () => this.propertyClick.emit(prop.original));
      markers.push(marker);
    }

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const group = L.featureGroup(markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }

    // Fix map render on resize
    setTimeout(() => this.map?.invalidateSize(), 200);
  }

  private loadLeaflet(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).L) {
        resolve();
        return;
      }

      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => resolve();
      script.onerror = () => resolve(); // Fallback gracefully
      document.head.appendChild(script);
    });
  }

  private fallbackToEmbed(): void {
    if (this.validProperties.length > 0) {
      const p = this.validProperties[0];
      const url = `https://www.openstreetmap.org/export/embed.html?bbox=${p.lng - 0.01},${p.lat - 0.008},${p.lng + 0.01},${p.lat + 0.008}&layer=mapnik&marker=${p.lat},${p.lng}`;
      this.singleMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  private formatPrice(value: number): string {
    if (!value) return '0';
    if (value >= 10000000) return (value / 10000000).toFixed(1).replace(/\.0$/, '') + ' Cr';
    if (value >= 100000) return (value / 100000).toFixed(1).replace(/\.0$/, '') + ' L';
    return value.toLocaleString('en-IN');
  }
}
