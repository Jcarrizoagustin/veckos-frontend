import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RutaService {

  private currentUrlSubject = new BehaviorSubject<string>('');
  public currentUrl$ = this.currentUrlSubject.asObservable();

  constructor(private router: Router) {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.currentUrlSubject.next(event.url);
    });
    
    // Establecer la URL inicial
    this.currentUrlSubject.next(this.router.url);
  }

  /**
   * Verifica si un path específico existe en la URL actual
   * @param path - El path a buscar (ej: 'usuarios', '/dashboard', 'admin')
   * @param exactMatch - Si debe ser coincidencia exacta (default: false)
   * @returns boolean
   */
  hasPath(path: string, exactMatch: boolean = false): boolean {
    const currentUrl = this.router.url;
    
    // Limpiar el path (quitar barras al inicio y final)
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    
    if (exactMatch) {
      // Coincidencia exacta
      const cleanCurrentUrl = currentUrl.replace(/^\/+|\/+$/g, '');
      return cleanCurrentUrl === cleanPath;
    } else {
      // Verificar si el path está contenido en la URL
      return currentUrl.includes(cleanPath);
    }
  }

  /**
   * Verifica si la URL actual contiene alguno de los paths proporcionados
   * @param paths - Array de paths a verificar
   * @param exactMatch - Si debe ser coincidencia exacta (default: false)
   * @returns boolean
   */
  hasAnyPath(paths: string[], exactMatch: boolean = false): boolean {
    return paths.some(path => this.hasPath(path, exactMatch));
  }

  /**
   * Verifica si la URL actual contiene todos los paths proporcionados
   * @param paths - Array de paths que deben estar todos presentes
   * @returns boolean
   */
  hasAllPaths(paths: string[]): boolean {
    return paths.every(path => this.hasPath(path, false));
  }

  /**
   * Obtiene la URL actual
   * @returns string
   */
  getCurrentUrl(): string {
    return this.router.url;
  }

  /**
   * Obtiene los segmentos de la URL actual
   * @returns string[]
   */
  getUrlSegments(): string[] {
    return this.router.url.split('/').filter(segment => segment.length > 0);
  }

  /**
   * Verifica si estamos en una ruta específica por segmento
   * @param segmentIndex - Índice del segmento (0-based)
   * @param expectedValue - Valor esperado del segmento
   * @returns boolean
   */
  isSegmentEqual(segmentIndex: number, expectedValue: string): boolean {
    const segments = this.getUrlSegments();
    return segments[segmentIndex] === expectedValue;
  }

}
