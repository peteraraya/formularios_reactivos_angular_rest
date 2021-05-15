import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
// interfaces
import { PaisSmall, Pais } from '../interfaces/paises.interface';


@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.eu/rest/v2';
  
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones():string[]{
    return [...this._regiones];
  }

  public noTieneBorders:boolean = false;
  

  constructor(
    private http:HttpClient
  ) { }


  getPaisePorRegion( region:string ): Observable<PaisSmall[]>{

    const url: string = `${this._baseUrl }/region/${ region }?fields=alpha3Code;name`;
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisPorCodigo( codigo:string ):Observable<Pais | null>{

    if ( !codigo ) {
       return of(null)
    }

    const url = `${this._baseUrl}/alpha/${ codigo }`;
    return this.http.get<Pais>(url);
  }

  getPaisPorCodigoSmall(codigo: string): Observable<PaisSmall>{

    const url = `${this._baseUrl}/alpha/${codigo }?fields=alpha3Code;name`;
    return this.http.get<Pais>(url);
  }

  getPaisesPorCodigos(borders: string[]): Observable<PaisSmall[]>{

    if (!borders) {
      this.noTieneBorders = true;
      return of ([]);      
    }
    // generamos peticiones
    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    });

    return combineLatest( peticiones );


  }

}
