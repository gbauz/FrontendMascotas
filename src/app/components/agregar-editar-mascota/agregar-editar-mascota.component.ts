import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from 'src/app/interfaces/mascota';
import { MascotaService } from 'src/app/services/mascota.service';

@Component({
  selector: 'app-agregar-editar-mascota',
  templateUrl: './agregar-editar-mascota.component.html',
  styleUrls: ['./agregar-editar-mascota.component.css']
})
export class AgregarEditarMascotaComponent {
  loading: boolean = false;
  form: FormGroup;
  id: number;
  operacion: string = 'Agregar';


  constructor(private fb: FormBuilder,
    private _mascotaService: MascotaService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private aRoute: ActivatedRoute) {

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      

    })

    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
  }


  ngOnInit(): void {
    if (this.id != 0) {
      this.operacion = 'Editar';
      this.obtenerMascota();
    }
  }

  obtenerMascota() {
    this.loading = true;
    this._mascotaService.getMascota(this.id).subscribe(data => {
      this.form.patchValue({
        nombre: data.nombre,
        apellido:data.apellido
      })
      this.loading = false;
    })
  }

  agregarEditarMascota() {
    //const nombre= this.form.get('nombre')?.value;
    //const nombre = this.form.value.nombre;

    //armamos el objeto
    const mascota: Mascota = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
     
    }

    if (this.id != 0) {
      //editar
      mascota.id=this.id;
      this.editarMascota(mascota);
    } else {
      //agregar
      this.agregarMascota(mascota);
    }


  }

  editarMascota(mascota: Mascota) {
    this._mascotaService.updateMascota(this.id,mascota).subscribe(data => {
      //console.log(mascota);
      this.mensajeExito('actualizada');
      this.router.navigate(['/listMascota'])
    });
  }


  agregarMascota(mascota: Mascota) {
    this._mascotaService.addMascota(mascota).subscribe(data => {
      //console.log(mascota);
      this.mensajeExito('registrada');
      this.router.navigate(['/listMascota'])
    });
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`La persona fue ${texto} con exito`, '', {
      duration: 4000,
      horizontalPosition: 'right'
    });
  }
}
