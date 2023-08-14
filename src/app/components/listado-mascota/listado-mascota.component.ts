import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Mascota } from 'src/app/interfaces/mascota';
import { MascotaService } from 'src/app/services/mascota.service';




@Component({
  selector: 'app-listado-mascota',
  templateUrl: './listado-mascota.component.html',
  styleUrls: ['./listado-mascota.component.css']
})
export class ListadoMascotaComponent implements AfterViewInit {

  displayedColumns: string[] = ['nombre', 'apellido','acciones'];
  dataSource = new MatTableDataSource<Mascota>();
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _snackBar: MatSnackBar, private _mascotaService: MascotaService) {

  }

  ngOnInit(): void {
    this.obtenerMascota();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = 'Items por pag';
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerMascota() {
    this.loading = true;
    this._mascotaService.getMascotas().subscribe(data => {
      this.loading = false;
      this.dataSource.data = data;
    }, error => {
      this.loading = false;
      alert("Ocurrio un error");

    })
  }

  eliminarMascota(id: number) {

    this.loading = true;

    this._mascotaService.deleteMascota(id).subscribe(() => {
      this.mensajeExito();
      this.loading=false;
      this.obtenerMascota();
    })




  }

  mensajeExito() {
    this._snackBar.open('La Mascota fue eliminada con exito', '', {
      duration: 4000,
      horizontalPosition: 'right'
    });
  }
}
