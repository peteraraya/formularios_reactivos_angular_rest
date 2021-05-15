import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';

import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  // Formulario reactivo
  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required],
  });

  // Llenar selectores
  regiones  : string[]    = [];
  paises    : PaisSmall[] = [];
  // fronteras : string[] = [];
  fronteras : PaisSmall[] = [];

  cargando  : boolean = false;


  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // obtener el valor -- primera forma
    // this.miFormulario.get('region')?.valueChanges
    //     .subscribe( region => {
    //       console.log(region)
    //       this.paisesService.getPaisePorRegion( region )
    //           .subscribe( paises =>{
    //             console.log(paises)
    //             this.paises = paises;
    //           })
    //     });

    // cuando cambia la region
    this.miFormulario
      .get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset(''); // reseteo campo país
          // this.miFormulario.get('frontera')?.disable()
          this.cargando = true; // cargando
        }),
        switchMap((region) => this.paisesService.getPaisePorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando= false; // ya obtengo la data
      },
        (err) => {
          console.info(err);
          this.cargando = false; // ya obtengo la data
        });

    // cuando cambia el país
    this.miFormulario
      .get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset(''); // reseteo campo frontera
          this.cargando = true;
        }),
        switchMap((codigo) => this.paisesService.getPaisPorCodigo(codigo)),
        tap(() => {
          this.cargando = false; // ya obtengo la data
        }),
        switchMap((pais)   => this.paisesService.getPaisesPorCodigos( pais?.borders! )),
      )
      .subscribe((paises) => {
        this.fronteras = paises || [];
        this.cargando = false; // ya obtengo la data
      },
      (err) => {
      console.info(err);
      this.cargando = false; // ya obtengo la data
    });



  }


  guardar() {
    console.log(this.miFormulario.value);
  }


}
